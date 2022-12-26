const { Schema, model } = require('mongoose');
const pollSchema = new Schema({
    _id: Schema.Types.ObjectId,
    msgId: String,
    buttonNumbers: Boolean,
    votes: Array
})

module.exports = model("Poll", pollSchema, 'polls');