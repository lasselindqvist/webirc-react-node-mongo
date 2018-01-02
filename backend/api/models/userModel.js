'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		required: 'Username is required'
	},
	creationTime: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Users', UserSchema);
