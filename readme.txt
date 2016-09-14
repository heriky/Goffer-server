// 通过爬虫定向爬取数据，并存如数据库中

// 数据表设计

// OfferInfo 招聘信息表
var offer = {
  [_id: 由mongodb生成的id值]
	school:[ObjectId],
	enterprise:"小米公司",
	datetime:'2016-9-10 19:00',
	detailTime:'19:00~21:00'
	addr:"金花校区",
	detailUrl:"http://www.baidu.com",  //表示详情页的url 
	pv:001  // 点击数. 优先级，先按点击数排列，再按照日期排列
}

var school = {
	name: "西安交大",
	pic: 'http:/www.baidu.com' // 校徽url,
	offers:[{type:obectId,ref:}]
}

db.offers.insert({school:"西安电子科技大学",enterprise:'去哪儿网', datetime:Date('2016-10-30'),addr:"太白校区",detailUrl:"http://www.baidu.com",pv:1})

db.schools.insert({name: '西安交通大学', pic: 'http://www.baidu.com'})

db.offers.update({_id: {$in:[ ObjectId("57bbbb9ed1a91087e827f44a"), ObjectId("57bbbbb3d1a91087e827f44b"), ObjectId("57bbbbd1d1a91087e827f44c")]}},{$set:{school: ObjectId("57bbc154d1a91087e827f44f")}},true,true)

// 西电的
ObjectId("57bbbb9ed1a91087e827f44a")ObjectId("57bbbbb3d1a91087e827f44b"),ObjectId("57bbbbd1d1a91087e827f44c")

 // 西交大的
ObjectId("57bbba96d1a91087e827f444"),ObjectId("57bbbaffd1a91087e827f445"),ObjectId("57bbbb37d1a91087e827f446")

 // 西北工业的
ObjectId("57bbbb56d1a91087e827f447"),ObjectId("57bbbb6ed1a91087e827f448"),ObjectId("57bbbb80d1a91087e827f449")

 db.schools.update({name:"西安电子科技大学"},{$set:{offers:[ObjectId("57bbbb9ed1a91087e827f44a"),ObjectId("57bbbbb3d1a91087e827f44b"),ObjectId("57bbbbd1d1a91087e827f44c")]}})

 db.offers.update({"_id" : ObjectId("57bbbbd1d1a91087e827f44c")},{$set:{datetime: new Date('2016-9-30')}})



db.offers.find({ _id: { '$in': [ ObjectId("57bbba96d1a91087e827f444"), ObjectId("57bbbaffd1a91087e827f445"), ObjectId("57bbbb37d1a91087e827f446"), ObjectId("57bbbb56d1a91087e827f447"), ObjectId("57bbbb6ed1a91087e827f448"), ObjectId("57bbbb80d1a91087e827f449"), ObjectId("57bbbb9ed1a91087e827f44a"), ObjectId("57bbbbb3d1a91087e827f44b"), ObjectId("57bbbbd1d1a91087e827f44c") ] }, datetime: { '$gte': new Date("Tue, 23 Aug 2016 04:30:49 GMT") } }, {limit:270, fields:undefined })





// 西安交大数据分析

272158147=就创中心一楼信息发布厅=小米科技有限责任公司2017校园招聘=19:10=21:00=1#272158143=就创中心204室=中国电子科技集团公司第五十五研究所=19:10=21:00=1#272158478=中二-1200=北京字节跳动科技有限公司(今日头条)=19:10=21:00=1#272239822=就创中心一楼信息发布厅=日立永济电气设备（西安）有限公司=16:40=18:30=1#272166267=中二-1200=中航工业第一飞机设计研究院=16:40=18:30=1#272155520=就创中心204室=好未来海边直播2017校园招聘=16:40=18:30=1#272155404=就创中心204室=宁波银行股份有限公司校园招聘=14:40=16:20=1#272154224=就创中心一楼信息发布厅=珠海金山办公软件有限公司=14:40=16:20=1#272154276=就创中心一楼信息发布厅=北京京东世纪贸易有限公司=10:10=12:00=0#272155914=就创中心204室=北京未尔锐创科技有限公司=10:10=12:00=1#

list = str.split('#') ;

info = item.split('=')
data[id] = info[0]
data[addr] = info[1]
data[enterprise] = info[2]
data[datetime] = info[3]+'~'info[4] 
data[isDetail] = info[5]

offer = {
	school:[schoolId],
	enterprise:,
	datetime:new Date(),
	time: detailTime,
	addr:"金花校区",
	detailUrl:"http://www.baidu.com",  //表示详情页的url 
	pv:001  // 点击数. 优先级，先按点击数排列，再按照日期排列

}