// 该函数表示在一个日期范围内，每一条重复做一件事情，fn表示每一天要执行的动作

module.exports = function(fn){
	var today = new Date().getTime() ;
    var dayDelta = 24*60*60*1000 ;
    var startDate = today - 2*dayDelta ; // 时间跨度的设置
    var endDate = today + 15*dayDelta ;

    for(var i=startDate; i<= endDate; i+= dayDelta){
     var tmp = new Date(i) ;
     fn.call(null,tmp) ;  // 回调中传入的是计算出的Date对象
    }
}