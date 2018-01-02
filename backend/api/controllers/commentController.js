'use strict';

var mongoose = require('mongoose');
var Comment = mongoose.model('Comments');

exports.list_all_comments = function (req, res) {
	Comment.find({}, function (err, comment) {
		if (err) { res.send(err); }
		res.json(comment);
	});
};

exports.read_comments_from_channel = function (req, res) {
	let channel = req.body.channel;
	let ignoredUsers = req.body.ignoredUsers;
	if (ignoredUsers != null && ignoredUsers.length > 0) {
		Comment.find({ 'channel': channel, username: { $nin: ignoredUsers } }, function (err, comment) {
			if (err) { res.send(err); }
			res.json(comment);
		});
	} else {
		Comment.find({'channel': channel}, function (err, comment) {
			if (err) { res.send(err); }
			res.json(comment);
		});
	}
};

exports.create_a_comment = function (req, res) {
	var newComment = new Comment(req.body);
	newComment.save(function (err, comment) {
		if (err) { res.send(err); }
		res.json(comment);
	});
};

exports.read_a_comment = function (req, res) {
	Comment.findById(req.params.commentId, function (err, comment) {
		if (err) { res.send(err); }
		res.json(comment);
	});
};

exports.update_a_comment = function (req, res) {
	Comment.findOneAndUpdate({_id: req.params.commentId}, req.body, {new: true}, function (err, comment) {
		if (err) { res.send(err); }
		res.json(comment);
	});
};

exports.delete_a_comment = function (req, res) {
	Comment.remove({
		_id: req.params.commentId
	}, function (err, comment) {
		if (err) { res.send(err); }
		res.json({ message: 'Comment successfully deleted' });
	});
};
