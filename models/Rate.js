/**
 * Created by Lora on 30.3.2017 г..
 */

const mongoose = require('mongoose');

let rateSchema = mongoose.Schema ({
	userID: { type: String, required: true},
	rate: {type: Number, required: true},
});

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;