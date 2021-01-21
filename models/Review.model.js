const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: [true, 'Please provide title for your review']
    },
    text: {
        type: String,
        required: [true, 'Please provide review text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please provide rating in between 1 to 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to calculate Average Rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    const obj = await this.aggregate([
        {
            $match: {bootcamp : bootcampId}
        },
        {
            $group: {
                _id : '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (err) {
        console.log(err);
    }
}

//call getAverageCost before saving course
ReviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.bootcamp);
});

//call getAverageCost before removing course
ReviewSchema.pre('remove', async function () {
    await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);