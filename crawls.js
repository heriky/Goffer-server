/**
 * Created by hk on 2015/11/3.
 */
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var app = express() ;

var PORT = process.env.PORT || 3000 ;

app.get('/todo/api/v1.0/collect/xjtu', function (req,res) {
    superagent
        .get('http://job.xjtu.edu.cn/listMeeting.do?is4practice=0&week=0')
        .set({'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36'})
        .end(function (err,sres) {
            if (err) console.log(err);

            var $ = cheerio.load(sres.text,{
                ignoreWhitespace: true,
                xmlMode: true,
                lowerCaseTags: false
            });
            var infos = [] ;
            var days = $('.week_fairs_tb') ;
            days.each(function () {
                var dayInfos = $(this).find('tr') ;
                var date ;
                $(dayInfos).each(function (index) {
                    var element = $(this);
                    var info = {} ;
                    if(index == 0) {
                        date = $('th',element).text();
                    }else{
                        info['title'] = $('a',element).text().replace(/\s+/,'').trim();

                        var href = $('a', element).attr('href') || 'http://job.xjtu.edu.cn' ; // href可能为空
                        if(!href.startsWith('http')){
                            href = 'http://job.xjtu.edu.cn'+href ;
                        }
                        info['href'] = href;
                        info['loc'] = $('td',element).eq(1).text().trim() ;
                        info['time'] = $('td',element).eq(2).text().trim();
                        info['date'] = date ;
                        infos.push(info)
                    }
                });
            });
            var college = {name:'西安交大',infos:infos} ;
            //console.log(college)
           res.json(college);
    });
});



app.listen(PORT, function () {
    console.log('Server is running on http://localhost:3000/');
}) ;