//链接数据库的 模块，单独分离出来
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('debug', false);

const db = mongoose.connect('mongodb://127.0.0.1:27017/acgnight', {
    config: {
        autoIndex: false
    }
});

db.connection.on('error', function (error) {
    console.log('连接数据库失败:' + error);
});

db.connection.on('open', function () {
    console.log('连接数据库成功');
});