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

module.exports.seedAdminOccupation = () => {
    Occupation.findOne({occupationName: 'Manager'}).then(occupation => {
        if (!occupation) {
            let adminOccupation = {
                occupationName: 'Manager',
                occupationRate: 0
            };
            Occupation.create(adminOccupation).then(occupation => {
                console.log('Admin occupation seeded successfully!')
            })
        }
    });
}
