
/**
 * Created by Marian on 1.4.2017 г..
 */

const mongoose = require('mongoose');

let taskSchema = mongoose.Schema ({
    taskName: { type: String, required: true},
    taskDescription: {type: String, required: true},
    taskDeadline: {type: Date, required: true},
    taskProjectId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project'},
    taskTeamId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Team'},
    taskComment: {type: String, default: ''},
    taskActive: {type: Boolean, default: true},
    taskWeight: {type: Number, required: true}
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;