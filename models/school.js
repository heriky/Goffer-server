var mongoose = require('mongoose') ;
var Schema = mongoose.Schema ;
var objectId = Schema.Types.ObjectId ;

var SchoolSchema = new Schema({
	name: String,
	// pic: String,
	offers: [{
		type: objectId,
		ref: 'Offer'
	}],
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
});

SchoolSchema.pre('save',next=>{
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.updateAt = Date.now()
	}
	next()
})

SchoolSchema.methods = {
	
}

SchoolSchema.statics = {
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

var schoolModel = mongoose.model('School',SchoolSchema) ;

module.exports = schoolModel ;

