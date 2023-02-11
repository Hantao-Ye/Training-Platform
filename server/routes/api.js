const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user_model');

router.post('/user/register', async (req, res) => {
    const user = new User();
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);

    user.save()
        .then((result) => {
            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email
                },
                process.env.RANDOM_TOKEN,
                { expiresIn: '72h' }
            );

            res.status(201).send({ message: 'User created successfully', result, token });
        })
        .catch((error) => {
            if (error.code && error.code == 11000) {
                res.status(409).send({ message: 'An account with the same email already exists.', error });
            } else {
                res.status(500).send({ message: 'Error creating user', error });
            }
        });
});

router.post('/user/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user.validPassword(req.body.password)) {
                return res.status(403).send({ message: 'Password not correct.', error });
            }

            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email
                },
                process.env.RANDOM_TOKEN,
                { expiresIn: '72h' }
            );

            res.status(200).send({ message: 'Login successful', email: user.email, token });
        })
        .catch((error) => {
            res.status(404).send({ message: 'Email not found', error });
        });
});

module.exports = router;
