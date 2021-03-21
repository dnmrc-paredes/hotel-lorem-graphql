const mongoose = require(`mongoose`)

const ratingSchema = new mongoose.Schema({
    rating: Number,
    ratingBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Rating = new mongoose.model(`Rating`, ratingSchema)

module.exports = Rating