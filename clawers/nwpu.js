var sp = require('superagent');
var schoolName = "西工大";
var baseURL = 'http://job.nwpu.edu.cn';
var dataIds = [] ; // 记录本次动作中所有被更新的offer的id，用于更新相应school中offer值
var total = 0 ; // 记录本次更新了多少条数据

//http://job.nwpu.edu.cn/ajax/indexMeeting.do?limit=200&year=2016&month=8&day=
// 如果想一次性获得本月所有的信息，可以按照以上的URL一次性获取一个jsonArray
module.exports = function() {
    require('../utils/schoolUtil')(schoolName, school => {
        fetchAndSaveData(school._id)
    })
}

function fetchAndSaveData(schoolId) {
    require('../utils/dateUtil')(date => {
        var year = date.getFullYear();
        var month = date.getMonth();
        var date = date.getDate();
        //+'year=2016&month=8&day=5'
        var url = baseURL + `/ajax/indexMeeting.do?limit=0&year=${year}&month=${month}&day=${date}`;
        fetchDateByURL(url, schoolId);
    })
}

function fetchDateByURL(url, schoolId) {
    sp
        .get(url)
        .set({ 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36' })
        .timeout(10000)
        .end((err, res) => {
            if (res.text == null || res.text.trim() == "") {return; } // 如果没有返回则不进行处理
            var list = JSON.parse(res.text);
            total += list.length ;
            
            list.forEach((info, index) => {
                var data = {
                        school: schoolId,
                        enterprise: info.title.search(/\:|\：/) == -1 ? "解析数据错误" : info.title.substr(info.title.lastIndexOf("：") + 1),
                        datetime: new Date(info.date),
                        detailTime: `${info.date.split(/\s+/).pop()}~${info.endDate.split(/\s+/).pop()}`,
                        addr: `[${schoolName}]${info.description}`,
                        detailUrl: baseURL + info.url
                    }
                    // Save
                var Offer = require('../models/offer');
                var School = require('../models/school') ;

                new Offer(data)
                .save()
                .then(_offer => {
                    // console.log('Offer Saved!')
                   dataIds.push(_offer._id) ;
                   if (dataIds.length == total) {
                    console.log(dataIds.length, total)
                    School.update({_id:schoolId},{'$set':{offers: dataIds}})
                        .then(_school=>{})
                        .catch(err=>{throw err;})
                   }
                   
                  
                })
                .catch(err => {
                    throw err; });

            })
        })
    console.log(schoolName + ':数据请求发送完毕!')
}
