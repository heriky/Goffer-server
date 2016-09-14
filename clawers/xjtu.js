var sp = require('superagent');
//var C = require('../env.config.js');
var schoolName = "西安交大"; 
var baseURL = 'http://job.xjtu.edu.cn/meeting/listMeetingbydate.do?dates=';
var dataIds = [] ; // 记录本次动作中所有被更新的offer的id，用于更新相应school中offer值
var total = 0 ; // 记录本次更新了多少条数据

module.exports = function(){
    
    //1. 首先建立schools表中相应记录，有则拿来用，没有则创建
    //2. 确定schools表中相应项建立好之后进行网络数据的拉取
    //3. 如果school项目已经存在的，那么就删完offer表中school对应的项

    require('../utils/schoolUtil')(schoolName,school=>{
        fetchAndSaveData(school._id)
    })
}


//进行网络请求，存储数据。按照-2 ~ +15 的规格进行数据拉去
function fetchAndSaveData(schoolId) {
    // 列举时间
    require('../utils/dateUtil')(date=>{ // 回调函数中是具体时间
        var rs = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}` ;
        fetchDataByDate(rs,schoolId) ;
    })
}


// 根据url获取并存储数据，url由日期生成
function fetchDataByDate(datetime,schoolId){
    sp
    .get(baseURL+datetime)
    .set({ 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36' })
    .timeout(10000)
    .end((err, res) => {
        if (err) {console.log(err);throw err };
        if(res.text==null) return;
        var list = res.text.split('#').slice(0, -1);
        total += list.length ;

        list.forEach(function(element, index) {
            var info = element.split('=');
            var data = {
                school: schoolId,
                enterprise: info[2],
                datetime: new Date(datetime + ' ' + info[3]),
                detailTime: `${info[3]}~${info[4]}`,
                addr: `[${schoolName}]${info[1]}`,
                detailUrl: info[5] == 1 ? `http://job.xjtu.edu.cn/meeting/${info[0]}` : ''
            }

            var Offer = require('../models/offer');
            var School = require('../models/school') ;
            // 插入数据之前已经将就数据完全删除了 
            new Offer(data)
                .save()
                .then(_offer=>{
                     // console.log('Offer Saved!')
                  // 只在所有offers记录都存储后，所有offer的_id都明确了，再进行school中offers的更新
                 
                  dataIds.push(_offer._id) ;
                  if (dataIds.length == total) {
                    School.update({_id:schoolId},{'$set':{offers: dataIds}})
                        .then(_school=>{})
                        .catch(err=>{throw err;})
                  }
                })
                .catch(err=>{throw err;}) ;
            
            
            
        });

    })
    console.log(schoolName+':数据请求发送完毕!')
}