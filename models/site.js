const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true
},
    description:{
        type: String,
        required: true

},
    imageURL:{
        type: String,
        required: true
}
})

module.exports = mongoose.model('Site', siteSchema)