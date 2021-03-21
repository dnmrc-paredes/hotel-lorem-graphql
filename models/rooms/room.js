const mongoose = require(`mongoose`)

const roomSchema = new mongoose.Schema({
    name: String,
    rating: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ]
})

const Room = new mongoose.model(`Room`, roomSchema)

module.exports = Room