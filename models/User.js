const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');

var workPerProject = {
    Project: mongoose.Schema.Types.ObjectId,
    Hours: Number, // total spent hours per project
    Amount: Number, //hours per rate
};

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        phone: {type: String, default: ''},
        country: {type: String, default: ''},
        address: {type: String, default: ''},
        salt: {type: String, required: true},
        rate: {type: Number, default: 0},
        team: {type: [mongoose.Schema.Types.ObjectId], default:[], ref: 'Team'},
        workedHours: {type: [workPerProject], default: []} //array [project: spent hours]
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



