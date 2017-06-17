


(function(){
	function Crime(Observer){
		var crime={};
		/*
		code here
		*/
		//Observer.fireEvent("event_name",dataSend,Crime);
		crime.onMessage = function(message, data, from){
			if(message == "bar_selected"){
				if(from == Barmap ){
					console.log("aaa");
					console.log(data);
				}
			}
			if(message == "bar_selected_cancel"){
				if(from == Barmap ){
					console.log("bbb");
					console.log(data);
				}
			}
		};

		
		Observer.addView(crime);
		return crime;
	}
	
	
	window["Crime"] = Crime;
})();