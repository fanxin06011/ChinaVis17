


(function(){
	function Popuchara(Observer){
		var popuchara={};
		/*
		code here
		*/
		//Observer.fireEvent("event_name",dataSend,Popuchara);
		
		popuchara.onMessage = function(message, data, from){
			if(message == "bar_selected"){
				if(from == Barmap ){
					console.log(data);
				}
			}
		};

		
		Observer.addView(popuchara);
		return popuchara;
	}
	
	
	window["Popuchara"] = Popuchara;
})();