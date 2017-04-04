/**
 * Created by Lora on 30.3.2017 г..
 */

const Rate = require('mongoose').model('Rate');
const User = require('mongoose').model('User');

module.exports = {
	rateCreateGet: (req, res) => {
		User.find({}).then(users => {
			res.render('rate/create', {users: users})
		})
	},
	
	rateCreatePost: (req, res) =>
	{
		let rateArgs = req.body;
		
		User.findOne({fullName: rateArgs.userID}).then(user =>
		{
			rateArgs.userID = user._id;
			Rate.create(rateArgs).then(rate => {
				user.rate = rate;
				user.save(err => {
					if (err) {
						res.redirect('/userViews/user', {error: err.message});
					}
					
					else {
						res.redirect('/userViews/user')
					}
			})
		});
	  })
	}
};