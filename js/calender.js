


(function(){
	function Calender(Observer){
		var calender={};
		
		var availw=document.documentElement.clientWidth-1000;
		var availh=$("#people_calender").css("height");
		availh=parseInt(availh.split("p")[0])+20;
		$("#people_calender").css("left",1000).css("width",availw).css("height",availh);
		//console.log(availw+" "+availh);
		//Observer.fireEvent("event_name",dataSend,Example);
		
		var people=["b9949157d649b5597d","f83aba720030f9b076","e0825f383acf9f19d7"];
		var calenderdatareturn=[];
		var timearr;
		
		var dom = document.getElementById("people_calender");
		var myChart = echarts.init(dom,'dark');
		var app = {};
		option = null;
		var cellSize = [30, 30];
		var pieRadius = 10;

		function getVirtulData() {
			var date = +echarts.number.parseDate('2016-11-01');
			var end = +echarts.number.parseDate('2016-12-01');
			var dayTime = 3600 * 24 * 1000;
			var data = [];
			for (var time = date; time < end; time += dayTime) {
				if(Math.random()>0.1){
					data.push([
						echarts.format.formatTime('yyyy-MM-dd', time),
						Math.floor(Math.random() * 10000)
					]);
				}
				
			}
			console.log(data);console.log("getVirtulData");
			return data;
		}
		function getVirtulData2() {
			timearr=_.pluck(calenderdatareturn,"beginTime");
			timearr=_.map(timearr, function(num){ return num.split(" ")[0]; });
			timearr=_.uniq(timearr);
			//console.log(timearr);
			var date = +echarts.number.parseDate('2016-11-01');
			var end = +echarts.number.parseDate('2016-12-01');
			var data = [];
			for(let i=0;i<timearr.length;i++){
				let ttt=+echarts.number.parseDate(timearr[i]);
				if(ttt>=date && ttt<=end){
					data.push([
						echarts.format.formatTime('yyyy-MM-dd', ttt),
						0
					]);
				}
			}
			console.log(data);console.log("getRealData");
			return data;
		}
		
		function getPieSeries(scatterData, chart) {
			return echarts.util.map(scatterData, function (item, index) {
				var center = chart.convertToPixel('calendar', item);
				console.log("getPieSeries");
				var rtd={
					id: index + 'pie',
					type: 'pie',
					center: center,
					label: {
						normal: {
							show:false,
							formatter: '{c}',
							position: 'inside'
						}
					},
					radius: pieRadius,
					data: []
				};
				for(let i=0;i<people.length;i++){
					var ttt=Math.random();
					if(ttt>0.5){
						rtd.data.push({name: people[i], value: Math.round(Math.random() * 24)});
					}
				}
				
				return rtd; 
			});
		}
		
		function getPieSeries2(scatterData, chart) {
			return echarts.util.map(scatterData, function (item, index) {
				//console.log(item);
				var center = chart.convertToPixel('calendar', item);
				//console.log("getPieSeries-real");
				var rtd={
					id: index + 'pie',
					type: 'pie',
					center: center,
					label: {
						normal: {
							show:false,
							formatter: '{c}',
							position: 'inside'
						}
					},
					radius: pieRadius,
					data: []
				};
				let fff = _.filter(calenderdatareturn, function(obj){ 
					let tt=obj.beginTime;
					tt=tt.split(" ")[0];
					return tt== item[0]; 
				});
				//console.log(fff);
				fff=_.pluck(fff,"ID");
				fff=_.uniq(fff);
				//console.log(fff);
				for(let i=0;i<fff.length;i++){
					rtd.data.push({name: fff[i], value: 1/fff.length});
				}
				return rtd; 
			});
		}

		function getPieSeriesUpdate(scatterData, chart) {
			console.log("getPieSeriesUpdate");
			return echarts.util.map(scatterData, function (item, index) {
				var center = chart.convertToPixel('calendar', item);
				return {
					id: index + 'pie',
					center: center
				};
			});
		}

		var scatterData;// = getVirtulData();

		option = {
			backgroundColor: '#404a59',
			tooltip : {},
			calendar: {
				top: 'middle',
				left: 'left',
				orient: 'vertical',
				cellSize: cellSize,
				splitLine:{
					lineStyle:{
						color:"white"
					}
				},
				itemStyle:{
					normal:{
						color:"#5c6573"
					}
				},
				yearLabel: {
					show: false,
					textStyle: {
						fontSize: 5
					}
				},
				dayLabel: {
					margin: 10,
					firstDay: 1,
					nameMap: ['日', '一', '二', '三', '四', '五', '六'],
					textStyle: {
						color: "white"
					},
					borderColor:"white"
				},
				monthLabel: {
					show: false
				},
				range: ['2016-11']
			},
			series: [{
				id: 'label',
				type: 'scatter',
				coordinateSystem: 'calendar',
				symbolSize: 1,
				label: {
					normal: {
						show: true,
						formatter: function (params) {
							return echarts.format.formatTime('dd', params.value[0]);
						},
						offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
						textStyle: {
							
							color: "white",
							fontSize: 7
						}
					}
				},
				data: scatterData
			}]
		};

		if (!app.inNode) {
			/*
			var pieInitialized;
			setTimeout(function () {
				pieInitialized = true;
				scatterData = getVirtulData();
				myChart.setOption({
					series: getPieSeries(scatterData, myChart)
				});
				
			}, 10);
			
			app.onresize = function () {
				if (pieInitialized) {
					myChart.setOption({
						series: getPieSeriesUpdate(scatterData, myChart)
					});
					console.log(scatterData);
				}
			};
			*/
		};
		if (option && typeof option === "object") {
			console.log(scatterData);
			myChart.setOption(option, true);
		}
		
		calender.randomResetData=function(){
			scatterData = getVirtulData();
			myChart.setOption({
					series: getPieSeries(scatterData, myChart)
				});
		}
		
		function getdataajaxbyidarr(){
			calenderdatareturn=[];
			getdataajax(0);
		}
		getdataajaxbyidarr();
		function getdataajax(dataind){
			if(dataind==people.length){
				console.log("query id arr end");
				console.log(calenderdatareturn);
				scatterData = getVirtulData2();
				myChart.setOption({
					series: getPieSeries2(scatterData, myChart)
				});
				return;
			}
			console.log("query people "+people[dataind]);
			$.ajax({
				type: "POST",
				url: "http://182.254.134.126:9494/get_record_by_personid",
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				data: JSON.stringify({personid:people[dataind]}),
				success: function(data) {
					console.log(data.res);
					if(data.status==0){
						console.log("empty");
						return;
					}
					//push data
					for(let i=0;i<data.res.length;i++){
						calenderdatareturn.push(data.res[i]);
					}
					getdataajax(dataind+1);
					
				},
				error: function(message) {
					console.log("query fail");
					console.log(message);
				}
			});
		}
		calender.onMessage = function(message, data, from){
			if(message == "Selected_id"){
				console.log("Selected_id");
				console.log(data.personid);
				if(from == Crime){
				//if(from == Crime && data.Status!=0){
					
					people=data.personid;
					getdataajaxbyidarr();
				}
			}

		};
		Observer.addView(calender);
		return calender;
	}
	
	
	window["Calender"] = Calender;
})();