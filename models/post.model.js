const {Schema, model} = require('mongoose');

const Post = new Schema({
    author: {type: String, required: true},
    category: {type: String, required: false},
    content: {type: String, required: true},
    createDate: {type: String, required: false},
    id: {type: String, required: true},
    lastModifyDate: {type: String, required: false},
    priority: {type: Number, required: false},
});

module.exports = model('Post', Post);
