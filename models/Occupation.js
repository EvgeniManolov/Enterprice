/**
 * Created by Marian on 13.4.2017 г..
 */

const mongoose = require('mongoose');

let occupationSchema = mongoose.Schema ({
    occupationName: { type: String, required: true, unique: true},
    occupationRate: {type: Number, required: true}
});

const Occupation = mongoose.model('Occupation', occupationSchema);

module.exports = Occupation;
