const express = require('express')
const router = express.Router()
require('../database/connect');
const Post = require('../database/post');
const init = require('../spider');

// 新增 Post/文章
router.route('/').get((req, res) => {
  const user = req.query.user ? req.query.user : null
  if (null) {
    res.end();
    return;
  }

  const getPost = new Promise((resolve, reject) => {
    Post.findOne({
      user: user
    }).exec((err, post) => {
      err ? reject(err) : resolve(post);
    });
  });

  getPost.then(post => {
      if (post) {
        return post.toObject().posts
      }
      return new Promise((resolve, reject) => {
        // 数据库中不存在数据，开始爬取
        init(user, posts => {
          resolve(posts)
        })
      })
    })
    .then(posts => {
      res.status(200);
      res.json(posts);
    })
    .catch(err => {
      res.status(500);
      res.json({
        msg: '咦？貌似哪里出错了，请联系作者反馈！'
      });
    });
})

module.exports = router