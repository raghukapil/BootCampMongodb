const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more then 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [500, 'Description can not be more then 500 characters']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use valid URL']
    },
    phone: {
        type: String,
        maxlength: [10, 'Phone number can not be more then 10 characters']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid email']
    },
    address: {
        type: String,
        required: [true, 'Please add address']
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Developer',
            'Mobile Developer',
            'UI/UX',
            'Data Science',
            'IOS',
            'Android',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be atleast 1'],
        max: [10, 'Rating Max is 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);