const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        phone: {type: String, default: ''},
        country: {type: String, default: ''},
        address: {type: String, default: ''},
        salt: {type: String, required: true},
        rate: {type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Rate'},
        team: {type: [mongoose.Schema.Types.ObjectId], default:[], ref: 'Team'}
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



