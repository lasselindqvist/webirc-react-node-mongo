'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('Users');

exports.create_a_user = function (req, res) {
	let username = req.body.username;
	User.count({'username': username}, function (err, count) {
		if (err) { res.send(err); }
		if (count > 0) {
			res.json({errors: 'The username is already in use.'});
		} else {
			var newUser = new User({'username': username});
			newUser.save(function (err, user) {
				if (err) { res.send(err); }
				res.json(user);
			});
		}
	});
};

exports.read_a_user = function (req, res) {
	User.findById(req.params.userId, function (err, user) {
		if (err) { res.send(err); }
		res.json(user);
	});
};

exports.read_a_user_by_username = function (req, res) {
	User.findOne({'username': req.params.username}, function (err, user) {
		if (err) { res.send(err); }
		res.json(user);
	});
};

exports.delete_a_user = function (req, res) {
	User.remove({
		_id: req.params.userId
	}, function (err, user) {
		if (err) { res.send(err); }
		res.json({ message: 'User successfully deleted' });
	});
};
