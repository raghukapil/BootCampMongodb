const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide course name']
    },
    discription: {
        type: String,
        required: [true, 'Please provide discription']
    },
    weeks: {
        type: Number,
        required: [true, 'Please provide weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please enter tuition amount']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please provide minimum skill'],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

// static method to calculate Average cost of tuition
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    const obj = await this.aggregate([
        {
            $match: {bootcamp : bootcampId}
        },
        {
            $group: {
                _id : '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: obj[0].averageCost
        })
    } catch (err) {
        console.log(err);
    }
}

//call getAverageCost before saving course
CourseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

//call getAverageCost before saving course
CourseSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);