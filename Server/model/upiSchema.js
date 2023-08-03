const mongoose = require('mongoose')
const upiSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    reference_id: { type: String, required: true },
    transcation_note: { type: String },
    upiLink: { type: String, required: true },
    status: { type: String, default: 'pending' },
})

const UPI = mongoose.model('UPI', upiSchema)
module.exports = UPI