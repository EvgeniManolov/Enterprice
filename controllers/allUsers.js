/**
 * Created by Lora on 4.4.2017 г..
 */

const User = require('mongoose').model('User');

module.exports = {
	
	usersGet: (req, res) => {
		
		User.find({}).then(users => {
			
			/*TO DO: Error message*/
			
			res.render('userViews/allUsers', {users: users});
			
		})
	},
	
	userDetailsGet: (req, res) => {
		
		let userID = req.params.id; //take user id, then populate 'team (as object => this.team.name)'
		
		User.findOne({_id : userID }).populate('team').then(user => {
			
			res.render('userViews/userProfile', {user: user})
		})
	}
};