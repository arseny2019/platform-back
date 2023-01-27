const {Schema, model} = require('mongoose');

const User = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    roles: [
        {
            type: String,
            ref: 'Role'
        }
    ],
    email: {type: String, unique: true, required: true},
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
});

module.exports = model('User', User);
