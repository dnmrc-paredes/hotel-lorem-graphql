const mongoose = require(`mongoose`)

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    isAdmin: Boolean,
    roomsBooked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookedRoom'
        }
    ],
    hotelRated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
})

const User = new mongoose.model(`User`, userSchema)

module.exports = User