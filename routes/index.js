const School = require('../models/school') ;
const Offer = require('../models/offer') ;
const router = require('express').Router() ;
const Eventproxy = require('eventproxy')
const ep = new Eventproxy() ;
const C = require('../env.config') ;
var path = require('path');

const popularSchools = ["西安交大","西工大","西电-太白校区"] ;

// 所有数据
router.get('/offers/all',(req,res)=>{  
	
	Offer.findAll((err,offers)=>{
		if (err) {
			console.log(err)  ;
			throw err;
		}

		res.json(offers)
	}) 
})


router.get('/offers/popular',(req,res)=>{
	var pageSize = req.query.p || 10 ;
	var pageNum = req.query.q || 1 ;
	Offer.findPaginated({datetime:{'$gte': Date.now()}},
		(err,rs)=>{
			if (err) {return console.log(err)};
					res.json(rs.documents)
		}, pageSize, pageNum).sort({pv:-1})
})

// 获取学校总数目
router.get('/offers/schools', (req,res)=>{  
	School.findAll((err,schools)=>{
		if (err) throw err;
		res.json(schools)
	})
})

// 按学校查询
router.get('/offers/school/:id', (req,res)=>{	
	const id = req.params.id ;
	const pageSize = req.query.p || 10 ;
	const pageNum = req.query.q || 1 ;

	const begin = (pageNum - 1)* pageSize ;
	const limit = pageSize ;

	School.findOne({_id:id})
				.populate({
					path: "offers",
					match:{datetime: {$gte: Date.now()}},
					options:{skip:begin,limit:limit,sort:{datetime: 1}}
				})
				.exec((err,school)=>{
					if (err) {throw err} ;
					res.json(school.offers)
				})
})

// 按时间查询
router.get('/offers/time', (req, res)=>{   
	const time = req.query.t || Date.now();
	const pageSize = req.query.p || 10 ;
	const pageNum = req.query.q || 1 ;

	Offer.findPaginated({datetime:{$gte: new Date(time)}}, 
			(err, rs)=>{
				if (err) {console.log(err); throw err;}
				res.json(rs.documents)
			}, pageSize, pageNum)
		.sort({datetime: 1})
})

//  用户的请求修改数据库，用于统计用户关心程度, 统计pv值
router.route('/offer/:id') 
			.get((req,res)=>{
				const id = req.params.id ;
				Offer.update({_id:id},{$inc:{pv:1}},(err,offer)=>{
					if (err) {throw err} ;
					res.json(offer) ;
				})
			})

/*
 * 关键字查询，只支持标题检索
 */
router.get('/offers/',(req,res)=>{  
	const keyword = req.query.q ;
	const regex = new RegExp(keyword,'i') ; //  这里不能直接用/  / 而要用Regexp()
	Offer.find({enterprise: regex})
				.sort({datetime: 1})
				.limit(30)
				.exec((err,offers)=>{
					if (err) {throw err} ;
					res.json(offers)
				})
})


// 版本信息更新

router.get('/update/info',(req,res)=>{
	res.json(C.appInfo)
})

router.get('/update/download',(req,res)=>{
	res.download(path.resolve(__dirname,'../update.apk'),'update.apk');
})


// 工具函数汇总
module.exports = router 

