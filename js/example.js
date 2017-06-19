


(function(){
	function Example(Observer){
		var example={};
		/*
		code here
		*/
		//Observer.fireEvent("event_name",dataSend,Example);
		example.onMessage = function(message, data, from){
			if(message == "bar_selected"){
				if(from == Barmap ){
					//console.log("aaa");
					//console.log(data);
				}
			}
			if(message == "bar_selected_cancel"){
				if(from == Barmap ){
					//console.log("bbb");
					//console.log(data);
				}
			}
			if(message == "bar_dblclicked"){
				if(from == Barmap ){
					//console.log("ccc");
					//console.log(data);
				}
			}
		};

		
		Observer.addView(example);
		return example;
	}
	
	
	window["Example"] = Example;
})();