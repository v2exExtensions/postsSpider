const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  user: {
    // 用户名
    type: String,
    required: true
  },
  posts: {
    // 用户发表主题,对象数组
    type: Array,
    default: []
  }
})

const PostModel = mongoose.model('post', PostSchema)

module.exports = PostModel