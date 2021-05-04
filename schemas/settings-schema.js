const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('dont-gone-one.settings', settingsSchema)