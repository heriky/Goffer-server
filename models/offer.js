var mongoose = require('mongoose') ;
var pages = require('mongoose-pages') ;
var Schema = mongoose.Schema ;
var objectId = Schema.Types.ObjectId ;

var OfferSchema = new Schema({
	enterprise: String,
	datetime: Date,
	detailTime: String,
	addr: String,
	detailUrl: String,
	pv: {
		type:Number,
		default:0
	},
	school :{
		type: objectId,
		ref:'School'
	},
	meta:{
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type: Date,
			default: Date.now()
		}
	}
})

OfferSchema.pre('save', next=>{
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.updateAt = Date.now() ;
	}
	next() ;
})

OfferSchema.methods = {}

OfferSchema.statics = {
	findbyid(id,cb){
		this.findOne({_id:id})
				.exec(cb)
	},
	findAll(cb){
		this.find({})
				.exec(cb)
	},
	removebyid(id,cb){
		this.remove({_id:id})
				.exec(cb)
	}

}
pages.skip(OfferSchema)

module.exports = mongoose.model('Offer',OfferSchema)
