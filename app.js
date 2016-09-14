const http = require('http');
const express = require('express');
const app = express();
const path = require('path');

const router = require('./routes')

//const favicon = require('favicon') ;
const logger = require('morgan');

const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const dbUrl = 'mongodb://127.0.0.1:27017/goffer'
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl)


// 1. 程序基本配置
app.use(logger('dev'));
app.use(session({
    secret: 'This is private key of 128 chars',
    cookie: {
        maxAge: 1800 * 1000, // 30分钟
        httpOnly: true
    },
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: true,
    saveUninitialized: false
}));
app.use(cookieParser)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// 2.配置开发环境
if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// 3.路由总入口
app.use('/api/v1', router);




// 4.处理错误
// 500错误
app.use((err, req, res, next) => {
    if (err) {
        console.log(err.stack)
        res.status(500).send('Server Internal Err : ' + err.msg + ' [hk]')
        throw err
    } else {
        next();
    }
})

// 404 错误
app.use((err, req, res, next) => {
    var err = Error('404 NOT FOUND [hk]')
    console.log(err.stack);
    res.status(404).send(err);
})

// 5.开启监听
var port = require('./env.config.js').port ;
http.createServer(app).listen(port || 3000, () => {
    console.log('Server is running on port '+ (port || 3000))
});


// 6. 开始抓取, 定时任务

require('./clawers/xjtu')() ; //西交大的爬虫

require('./clawers/nwpu')() ; //西工大爬虫

require('./clawers/xidian')()

// 定时任务
var schedule = require('node-schedule');

var j = schedule.scheduleJob({hour: 23, minute: 0}, function(){
  require('./clawers/xjtu')() ; //西交大的爬虫

	require('./clawers/nwpu')() ; //西工大爬虫

	require('./clawers/xidian')()

	console.log('Schedule Job executed!')

});




