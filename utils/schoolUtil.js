// 主要完成抓取数据的初始化工作：
// 检测shcools表中是否有当前学校的记录。如果没有则必须
// 首先在schools表中创建一个学校的记录，然后针对此学校添加
// offer数据； 如果有，则直接添加offer。
// 因为添加offer条目的时候必须有shcoolId存在

var School = require('../models/school');
var Offer = require('../models/offer');

module.exports = function(schoolName,cb){
	if (schoolName == null) {
		throw new Error('This function need a param : schoolName') ;
	}

 	School.findOne({ name: schoolName })
      .then(school => {
          if (school == null) { // 等于空先存一个，再进行保存
              new School({ name: schoolName }).save()
                  .then(_school => {
                  		cb.call(null,_school)
                      //fetchAndSaveData(_school._id)
                  })
                  .catch(err => {
                      console.log(err)
                      throw err;
                  })
          } else {
            // 如果该项目是已经存在的，那么可能在offers表中有与该school相关联的项
            // 初始化的时候，将相关联的offer项全部删除，以填充新的数据
          	Offer.remove({school: school._id},err=>{
              if (err) {console.log(err); throw err;}
              cb.call(null,school)
            })
          }
      })
      .catch(err => {
          console.log(`创建schools表信息${schoolName}出错！`)
          console.log(err);
          throw err;
      })	
}