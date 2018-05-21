const db = require('../config/db');

const query = {
  saveComment(comment, videoId) {
    return db.insertObj(
      'INSERT INTO comments (text, user_id, video_id, post_date) VALUES (?, ?, ?, ?)',
      [comment.text, comment.userId, videoId, comment.postDate],
    );
  },
  getCommentByIdAndUserId(id, userId) {
    return db.getMultipleResult(
      'SELECT c.id, c.text, c.post_date, c.likes_count, c.dislikes_count, u.name, j.like_sign FROM comments AS c ' +
      'LEFT JOIN users AS u ' +
      'ON u.id = c.user_id ' +
      'LEFT JOIN (SELECT cul.comment_id, cul.like_sign FROM comments_users_likes AS cul  ' +
      'JOIN users AS u ' +
      'ON u.id = cul.user_id ' +
      'WHERE u.id = ?) AS j ' +
      'ON j.comment_id = c.id ' +
      'WHERE c.video_id = ?  ' +
      'ORDER BY c.post_date DESC',
       [userId,id]
    );
  },
  deleteComment(videoId, commentId, userId) {
    return db.deleteObj(
      'DELETE FROM comments  ' +
      'WHERE id = ? AND video_id = ? ' +
      'AND ' +
      '(user_id = ? OR (select u.role from users as u where u.id = ?) = admin)',
      [commentId, videoId, userId, userId],
    );
  },
  updateComment(text, likesCount, dislikesCount, commentId) {
    return db.updateObj(
      'UPDATE comments SET  text = ?, likes_count = ?, dislikes_count = ? WHERE id = ? ',
      [text, likesCount, dislikesCount, commentId],
    );
  },
  findByVideoAndCommentID(videoId, commentId) {
    return db.getSingleResult(
      "SELECT * FROM comments AS c WHERE c.id = ? and c.video_id = ?", [commentId, videoId]
    )
  },
  getCommentByIdAndUserIdAndVideoId(videoId, commentId, userId) {
    return db.getSingleResult(
      "SELECT * FROM comments AS c WHERE c.id = ? AND c.user_id = ? AND c.video_id = ?",
      [commentId, userId, videoId]
    )
  }
};

module.exports = query;
