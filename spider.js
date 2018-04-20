const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const Post = require('./database/post')

const init = (name, cb) => {

    if (!name) {
        return
    }

    let pages = 2; // 回帖总页数
    let current = 1;
    let posts = [] //用户创建帖子数组
    let user = name;
    let url = `https://www.v2ex.com/member/${user}/replies?p=${current}`
    let callback = cb; // route 回调

    const start = () => {
        if (current > pages) {
            // 把结果传递出去
            callback(posts)
            new Post({
                user,
                posts
            }).save((err) => {
                err ? console.log('保存数据出错!', err) : console.log('保存数据成功!');
            });
            return;
        }
        https.get(url, function (sres) {
            let chunks = [];
            sres.on('data', function (chunk) {
                chunks.push(chunk);
            });
            sres.on('end', function () {
                const html = iconv.decode(Buffer.concat(chunks), 'utf-8');
                const $ = cheerio.load(html, {
                    decodeEntities: false
                });
                if (current === 1) {
                    pages = $('#Main > div.box > div.header').text().match(/页 \/ 共 (\d*?) 页/)[1];
                }
                current++;
                url = `https://www.v2ex.com/member/${user}/replies?p=${current}`

                $('#Main > div.box .dock_area span.gray').each((index, item) => {
                    if ($(item).find('a:nth-child(1)').text() !== user) {
                        return;
                    }

                    const nodeDOM = $(item).find('a:nth-child(3)');
                    const postDOM = $(item).find('a:nth-child(5)');
                    // 是当前用户发的帖子的话,添加到数组
                    if (posts.find(item => {
                            return item.postUrl === postDOM.attr('href')
                        })) {
                        // 如果数组中已经存在数据
                        return;
                    }
                    posts.push({
                        node: nodeDOM.text(),
                        nodeUrl: nodeDOM.attr('href'),
                        post: postDOM.text(),
                        postUrl: postDOM.attr('href'),
                    });
                });

                setTimeout(() => {
                    start()
                }, 0)
            });
        });
    }

    start(url);
}





module.exports = init;