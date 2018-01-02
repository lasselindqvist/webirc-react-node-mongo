'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	username: {
		type: String,
		required: 'Username is required'
	},
	channel: {
		type: String,
		required: 'Channel is required'
	},
	contents: {
		type: String,
		required: 'Contents is required'
	},
	creationTime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Comments', CommentSchema);
