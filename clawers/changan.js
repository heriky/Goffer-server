var sp = require('superagent') ;

var baseURL = 'http://182.254.150.113:88/Pro_StudentEmploy/StudentJobFair/JobFairSingle_Detail.aspx?JobId=' ;
var schoolName = "长安大学" ;

// 设置时间范围 -3 ~ +7
var startDate = new Date() ;
var endDate = new Date() ;
startDate = startDate.setDate(new Date().getDate() - 3) ;
endDate = endDate.setDate(new Date().getDate() + 7);

// 根据日期产生requestUrl
var requsetUrl = `http://182.254.150.113:88/Frame/Data/jdp.ashx?rnd=${new Date().getTime()}`+
`&fn=GetJobFairListToWeb&StartDate=${formatDate(startDate)}%2000%3A00%3A00&EndDate=${formatDate(endDate)}%2023%3A59%3A59&InfoState=1&start=0&limit=999&IsOpen=1`;


module.exports = ()=>{
	require('../utils/schoolUtil')(schoolName,school=>{
        fetchAndSaveData(school._id)
    })
}

function fetchAndSaveData(schoolId){
	// 页面时固定的
	sp
		.get(requsetUrl)
		.set({ 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36' })
		.timeout(10000)
		.end((err, res)=>{
			if (err) { console.log(err); return} 
			if (res.text == null || res.text.trim().length == null) {return }
			
			var dataIds = [] ; // 记录被插入offer的id值，用于更新school中相应字段
			
			var list =  JSON.parse(res.text).rows ;
			list.forEach(item=>{
				var data = {
					school: schoolId,
					enterprise: item.CompanyName,
					datetime: new Date(item.MeetDate.split(/\s+/)[0]+' '+item.TimesName.split('-')[0]),
					detailTime: item.TimesName,
					addr: '[长安大学]'+ item.SitusName,
					detailUrl: baseURL+item.Id
				}
				
				// Save 存储入数据库
				var Offer = require('../models/offer');
				var School = require('../models/school') ;

				// 删除旧的记录，插入新的值，即要更新offers表，也要更新school表中offers字段
        new Offer(data)
          .save()
          .then(_offer => {
              // console.log('Offer Saved!')
              // 只在所有offers记录都存储后，所有offer的_id都明确了，再进行school中offers的更新
              dataIds.push(_offer._id) ;
              console.log(dataIds.length, list.length)
              if (dataIds.length == list.length) {
              	School.update({_id:schoolId},{'$set':{offers: dataIds}})
              		.then(_school=>{})
              		.catch(err=>{throw err;})
              }
          })
          .catch(err => {
              throw err; 
           });
			})

		})
}

// 输入的是时间戳
function formatDate(timestamp){
	var date = new Date(timestamp) ;
	var year = date.getFullYear() ;
	var month = date.getMonth() + 1;
	var date = date.getDate()  ;
	return year+'-'+month+'-'+date ;
}
