const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

router.route('/register').post(function (req, res, next) {
    const { body } = req;
    const { password, name, type } = body;
    let { email } = body;

    if (!name) {
        return res.send({
            success: false,
            message: 'Name cannot be blank.',
        });
    }
    if (!email) {
        return res.send({
            success: false,
            message: 'Email cannot be blank.',
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank.',
        });
    }
    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find(
        {
            Email: email,
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
                    message: 'Error: Account with email already exists.',
                });
            }

            // Save the new user
            const newUser = new User({
                Name: name,
                Email: email,
                Type: type,
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
    let { email } = body;

    if (!email) {
        return res.send({
            success: false,
            message: 'Email cannot be blank.',
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Password cannot be blank.',
        });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find(
        {
            Email: email,
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
                    message: "Account with that email doesn't exist.",
                });
            }
            const user = users[0];

            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Password is incorrect.',
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
                console.log(sessions[0].userId);
                User.findById(sessions[0].userId, (err, user) => {
                    console.log(user);

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
