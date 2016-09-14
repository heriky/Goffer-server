var cheerio = require('cheerio') ;
var sp = require('superagent') ;
const charset = require('superagent-charset');
charset(sp); // 解决gbk编码网页的乱码问题

var baseURL = 'http://job.xidian.edu.cn' ;
var schoolName = "西电-太白校区"

module.exports = ()=>{
	require('../utils/schoolUtil')(schoolName,school=>{
        fetchAndSaveData(school._id)
    }) ;
}

function fetchAndSaveData(schoolId){
	// 只抓取北校区招聘会 ,固定url地址
	sp
	.get('http://job.xidian.edu.cn/html/zpxx/bxqzph/') 
	 .set({ 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36' })
	 .charset('gb2312')
   .timeout(10000)
   .end((err, res)=>{
   		if (err) {
   			console.log(err) ;
   			return;
   		}
   		var $ = cheerio.load(res.text,{
	      ignoreWhitespace: true,
	      xmlMode: true,
	      lowerCaseTags: false
      });
			
			var list = $('tr', '.zphTable').slice(1) ;

			var dataIds = [] ; // 记录被插入的offer的id值
			list.each((index, item)=>{
				var $item = $(item).children('td') ;

				// xxxx年xxx月xxx日，这样的日期格式要转换成xxxx-xx-xx 才能有效存储
				var data = {
					school: schoolId,
					enterprise: $item.eq(3).text(),
					datetime: formatDate($item.eq(0).text()),
					detailTime: $item.eq(1).text(),
					addr: '['+schoolName+']'+$item.eq(2).text(),
					detailUrl: baseURL+$item.eq(3).children("a").attr('href')
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

// xxxx年xxx月xxx日 => 转换为Date对象
 function formatDate(str){
 	str = str.trim();
	var yearIndex = 0;
	var monthIndex = str.indexOf('年') ;
	var dateIndex = str.indexOf('月') ;

	var year = '20'+str.substring(yearIndex,monthIndex) ;
	var month = str.substring(monthIndex+1,dateIndex) ;
	var date = str.slice(dateIndex+1,-1);

	return new Date(`${year}-${month}-${date}`)
 }