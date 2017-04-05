/**
 * Created by User on 01/04/2017.
 */

const mongoose = require('mongoose');

let teamSchema = mongoose.Schema({
    teamName: { type: String, required: true, unique:true },
    userID: {type: [mongoose.Schema.Types.ObjectId], default:[] , ref:'User'},
    projects: {type: [mongoose.Schema.Types.ObjectId], default:[] , ref:'Project'},
    tasks: {type: [mongoose.Schema.Types.ObjectId], default:[] , ref:'Task'}
});

const Team = mongoose.model('Team',teamSchema);

module.exports = Team;