
/**
 * Created by Marian on 1.4.2017 г..
 */

const mongoose = require('mongoose');

var taskComments = {
    user: mongoose.Schema.Types.ObjectId,
    comment: String,
    date: String
}

let taskSchema = mongoose.Schema ({
    taskName: { type: String, required: true},
    taskDescription: {type: String, required: true},
    taskDeadline: {type: Date, required: true},
    taskProjectId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project'},
    taskTeamId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Team'},
    taskComment: {type: [{user: mongoose.Schema.Types.ObjectId, picture: String, name: String, comment: String, date: String }]},
    taskActive: {type: Boolean, default: true},
    taskActualHours: {type: Number, default: 0},
    taskWeight: {type: Number, required: true}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;