const mongoose = require(`mongoose`)

const bookedRoomSchema = new mongoose.Schema({
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    theBookedRoom: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    bookAt: Date
})

const BookedRoom = new mongoose.model(`BookedRoom`, bookedRoomSchema)

module.exports = BookedRoom