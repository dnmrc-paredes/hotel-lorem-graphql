const mongoose = require(`mongoose`)

const roomSchema = new mongoose.Schema({
    name: String,
    rating: Number,
})

const Room = new mongoose.model(`Room`, roomSchema)

module.exports = Room