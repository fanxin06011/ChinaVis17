


(function(){
	function Popview(Observer){
		var popview={};
		/*
		code here
		*/
		
		popview.onMessage = function(message, data, from){
			if(message == "bar_dblclicked"){
				if(from == Barmap ){
					console.log(data);
					
				}
			}
		};

		
		Observer.addView(popview);
		return popview;
	}
	
	
	window["Popview"] = Popview;
})();