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
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    },
    bookAt: String,
    isCancelled: Boolean,
    isDone: Boolean,
    isRated: Boolean
})

const BookedRoom = new mongoose.model(`BookedRoom`, bookedRoomSchema)

module.exports = BookedRoom