'use strict';
module.exports = function (app) {
	var commentList = require('../controllers/commentController');
	var loginList = require('../controllers/loginController');

	app.route('/login')
    .post(loginList.create_a_user);

	app.route('/comment')
    .get(commentList.list_all_comments)
    .post(commentList.create_a_comment);

	app.route('/comments/:commentId')
    .get(commentList.read_a_comment)
    .put(commentList.update_a_comment)
    .delete(commentList.delete_a_comment);

	app.route('/comments')
    .post(commentList.read_comments_from_channel);
};
