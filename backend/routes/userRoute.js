const express = require('express');
const { remove } = require('../models/User');
const router = express.Router();

const User = require('../models/User');
const UserSession = require('../models/UserSession');

router.route('/update').put(function (req, res) {
    const { body } = req;
    const {
        id,
        addSaved,
        removeSaved,
        addLiked,
        removeLiked,
        addReview,
        removeReview,
    } = body;

    let params = {};

    if (addSaved) {
        params = { $addToSet: { Saved: addSaved } };
    }

    if (removeSaved) {
        params = { $pull: { Saved: removeSaved } };
    }

    if (addLiked) {
        params = { $addToSet: { Liked: addLiked } };
    }

    if (removeLiked) {
        params = { $pull: { Liked: removeLiked } };
    }

    if (addReview) {
        params = {
            $addToSet: { Reviews: addReview },
        };
    }

    if (removeReview) {
        params = {
            $pull: { Reviews: removeReview },
        };
    }

    User.findOneAndUpdate(
        { _id: id },
        params,
        { new: true, upsert: true },
        function (err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
});

router.route('/user/:username').get(function (req, res) {
    let username = req.params.username;

    User.findOne({ Username: username }, function (err, user) {
        if (err) {
            console.log(error);
        } else {
            res.json(user);
        }
    });
});

router.route('/register').post(function (req, res, next) {
    const { body } = req;
    const { password, name } = body;
    let { username } = body;

    if (!name) {
        return res.send({
            success: false,
            message: 'Name cannot be blank.',
        });
    }
    if (!username) {
        return res.send({
            success: false,
            message: 'Username cannot be blank.',
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Password cannot be blank.',
        });
    }

    username = username.trim();

    if (username.length > 14) {
        return res.send({
            success: false,
            message: 'Username cannot be longer than 14 characters.',
        });
    } else if (username.length < 6) {
        return res.send({
            success: false,
            message: 'Username must be at least 6 characters.',
        });
    }

    User.find(
        {
            Username: username,
        },
        (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Server error.',
                });
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account with username already exists.',
                });
            }

            // Save the new user
            const newUser = new User({
                Name: name,
                Username: username,
            });

            newUser.set({ Password: newUser.generateHash(password) });

            newUser.save((err, user) => {
                console.log(user);
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Server error.',
                    });
                } else {
                    const userSession = new UserSession({ userId: user._id });

                    userSession.save((err, doc) => {
                        if (err) {
                            return res.send({
                                success: false,
                                message: 'Error: server error',
                            });
                        }
                        return res.send({
                            success: true,
                            message: 'Valid sign in',
                            token: doc._id,
                            user: user,
                        });
                    });
                }
            });
        }
    );
});

router.route('/login').post(function (req, res, next) {
    const { body } = req;
    const { password } = body;
    let { username } = body;

    if (!username) {
        return res.send({
            success: false,
            message: 'Username cannot be blank.',
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Password cannot be blank.',
        });
    }

    username = username.trim();

    User.find(
        {
            Username: username,
        },
        (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Server error.',
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Either username and/or password is incorrect.',
                });
            }
            const user = users[0];

            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Either username and/or password is incorrect.',
                });
            }

            const userSession = new UserSession({ userId: user._id });

            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: server error',
                    });
                }
                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id,
                    user: user,
                });
            });
        }
    );
});

router.route('/logout').post(function (req, res, next) {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.findOneAndUpdate(
        {
            _id: token,
            isDeleted: false,
        },
        {
            $set: {
                isDeleted: true,
            },
        },
        null,
        (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Server Error',
                });
            }
            return res.send({
                success: true,
                message: 'Logged out',
            });
        }
    );
});

router.route('/verify').get(function (req, res, next) {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.find(
        {
            _id: token,
            isDeleted: false,
        },
        (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server error',
                });
            }
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid',
                });
            } else {
                User.findById(sessions[0].userId, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return res.send({
                            success: true,
                            message: 'Session valid',
                            user: user,
                        });
                    }
                });
            }
        }
    );
});

module.exports = router;
