var User = require("../models/user");
var Notes = require("../models/notes");
var config = require("../../config");

var secretKey = config.secretKey;

var jsonwebtoken = require("jsonwebtoken");

function createToken(user) {
    var token = jsonwebtoken.sign({
        _id: user._id,
        name: user.name,
        username: user.username
    }, secretKey, {
        exportsInMinute: 1440
    });

    return token;
}

module.exports = function(app, express, io) {
    var api = express.Router();

    api.get('/all_notes', function(req, res) {
        Notes.find({}, function(err, notes) {
            if(err) {
                res.send(err);
                return;
            }

            res.json(notes);
        });
    });

    api.post('/signup', function(req, res) {
        var user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        var token = createToken(user);

        user.save(function(err) {
            if(err) {
                res.send(err);
                return;
            }

            res.json({
                success: true,
                message: 'User has been created!',
                token: token
            });
        });
    });

    api.get('/users', function(req, res) {

        User.find({}, function(err, users) {
            if(err) {
                res.send(err);
                return;
            }

            res.json(users);
        });

    });

    api.post('/login', function(req, res) {
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {
            if(err) throw err;

            if(!user) {
                res.send({message: "Unknown user..."});
            } else if(user) {
                var validPassword = user.comparePassword(req.body.password);

                if(!validPassword) {
                    res.send({
                        message: "Invalid password"
                    });
                } else {
                    var token = createToken(user);

                    res.json({
                        success: true,
                        message: "Successfully login!",
                        token: token
                    });
                }
            }
        });
    });

    api.use(function(req, res, next) {
        console.log("Somebody just came our app!");

        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        if(token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if(err) {
                    res.status(403).send({
                        success: false,
                        message: "Failed to authenticate user"
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No Token Provided"
            });
        }
    });

    api.route('/')
        .post(function(req, res) {
            var note = new Notes({
                creator: req.decoded._id,
                content: req.body.content
            });

            note.save(function(err, newNote) {
                if(err) {
                    res.send(err);
                    return;
                }

                io.emit('note', newNote);
                res.json({
                    message: "New Note Created!"
                });
            });

            // console.log(req.decoded._id);
        })

        .get(function(req, res) {
            Notes.find({creator: req.decoded._id}, function(err, notes) {
                if(err) {
                    res.send(err);
                    return;
                }

                res.json(notes);
            });
        });

    api.get('/me', function(req, res) {
        res.json(req.decoded);
    });

    return api;
};
