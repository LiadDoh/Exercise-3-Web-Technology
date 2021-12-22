const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true

    },
    imageURL: {
        type: String,
        required: true
    },
    backgroundImageURL: {
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
    }
})

module.exports = mongoose.model('Site', siteSchema)