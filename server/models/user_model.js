const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const saltRounds = 10;

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
}, {
    methods: {
        generateHash(password) {
            return bcrypt.hashSync(password, saltRounds);
        },
        validPassword(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
});


module.exports = mongoose.model('user', userSchema, 'users');