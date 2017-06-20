(
function(){
	function Observer(){
		var observer={};
		var viewList = [];
		
		function isClass(o){
		  if(o===null) return "Null";
		  if(o===undefined) return "Undefined";
		  return Object.prototype.toString.call(o).slice(8,-1);
		}
		
		observer.deepClone=function(obj){
			var result;
			var oClass=isClass(obj);
			//确定result的类型
			if(oClass==="Object"){
				result={};
			}else if(oClass==="Array"){
				result=[];
			}else{
				return obj;
			}
			for(key in obj){
				var copy=obj[key];
				if(isClass(copy)=="Object"){
					result[key]=arguments.callee(copy);//递归调用
				}else if(isClass(copy)=="Array"){
					result[key]=arguments.callee(copy);
				}else{
					result[key]=obj[key];
				}
			}
			return result;
		}

		observer.addView=function(view){
			viewList.push(view);
		}
		observer.fireEvent=function(message, data ,from){
			viewList.forEach(function(view){
				view.onMessage(message, data, from);
			})
		}
		return observer;
	}
	window["Observer"] = Observer;
})()

//

var obs = Observer();
var barmap = Barmap(obs);
var example = Example(obs);
var popview = Popview(obs);
var popuchara = Popuchara(obs);
var crime = Crime(obs);
var calender = Calender(obs);