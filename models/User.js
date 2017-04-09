const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');
const Role = require('mongoose').model('Role');

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
        team: {type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Team'},
        workedHours: {type: [workPerProject], default: []}, //array [project: spent hours]
        roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
        profession: {type: String, required: true}
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   },

    isAdmin: function (roles) {
        Role.findOne({name: 'Admin'}).then(role => {

            let isAdmin = true;

            if(roles.indexOf(role._id) == -1) {
                isAdmin = false; }

            return isAdmin;
        })
    }

});



const User = mongoose.model('User', userSchema);

module.exports = User;

module.exports.seedAdmin = () => {
    let email = 'admin@enterprice.com';

    User.findOne({email: email}).then(admin => {
        if (!admin) {
            Role.findOne({name: 'Admin'}).then(role => {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('123', salt);

                let roles = [];
                roles.push(role.id);

                let user = {
                    email: email,
                    passwordHash: passwordHash,
                    fullName: 'Admin',
                    salt: salt,
                    roles: roles
                };

                User.create(user).then(user => {
                    role.users.push(user.id);
                    role.save(err => {
                        if(err) {
                            console.log(err.message)
                        } else {
                            console.log('Admin seeded successfully!')
                        }

                    })
                })
            })
        }
    })
};



