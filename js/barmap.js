


(function(){
	function Barmap(Observer){
		$("#problem1btn").on("click",function(){
			barmap.mode=1;
			//mode-1 问题一 不响应其他视图事件
			$("#problem_1").show();
			re0();
			//改变颜色大小
			//colorlinear=function(ind,d){return '#abc';}
			sizelinear=function(ind,d){return 8;};
			reloadmap();
		})
		$("#problem2btn").on("click",function(){
			barmap.mode=2;
		})
		$("#problem3btn").on("click",function(){
			barmap.mode=3;
		})
		
		var barmap={};

		//mode-1 问题一 不响应其他视图事件
		//mode-2 问题二 流动人口（籍贯） 热力图
		//mode-3 问题三 青年犯罪团伙 高亮
		barmap.mode=1;
		
		//map data
		var geoCoordMap = {};
		var bardata=[];
		var bardatafiltered;
		var objpreclicked={};
		var clickedbararr=[];
		var dblclickedbar=-1;
		var dblclickedbar0=-1;
		var dblclickedbarpopobj=[];//[{"PERSONID":123,"DURATION":3},{"PERSONID":123,"DURATION":5},{"PERSONID":23,"DURATION":11},{"PERSONID":54,"DURATION":7},{"PERSONID":8,"DURATION":8}];
		var barlocinfo;
		
		var durationbrushrange=-1;
		var cusnumberrange=-1;
		
		var problem3bararr=[];
		var problem2barobj=[];
		
		var colorcompute;
		var colorcomputelinear;

		var sizelinear=function(ind,d){return 8;};
		var colorlinear=function(ind,d){
			return '#E0E0E0';
			//return '#93b7e3';
		}

		var barcusnuminfo;

		var dommap = document.getElementById("middle_view");
		var mapChart = echarts.init(dommap);

		d3.csv("./data/bar_pos.csv",function(error,databar){
			//读取网吧地理信息
			barlocinfo=databar;
			for(let i=0;i<databar.length;i++){
				if(parseFloat(databar[i]["lng"])==107.6){
					geoCoordMap[databar[i]["SITEID"]]=[107,30.5];
					bardata.push({"name": databar[i]["SITEID"], "barID": parseInt(databar[i]["ID"]), "value": i});
					//continue;
				}else{
					geoCoordMap[databar[i]["SITEID"]]=[parseFloat(databar[i]["lng"]),parseFloat(databar[i]["lat"])];
					bardata.push({"name": databar[i]["SITEID"], "barID": parseInt(databar[i]["ID"]),"value":i});
				}
				
			}
			totalbaridarr=_.pluck(bardata,"barID");
			durationfilterbarid=totalbaridarr;
			cusnumberfilterbarid=totalbaridarr;
			//console.log(geoCoordMap);
			//console.log(bardata);
			mapoption.series[0].data=convertData(bardata);
			
			if (mapoption && typeof mapoption === "object") {
				//console.log("set option");
				mapChart.setOption(mapoption, true);
				mapChart.on('click', function (params) {
					mapchartclickfunc(params);
				});
				mapChart.on('dblclick', function (params) {
					mapchartdblclickfunc(params);
				});
			}
		})
		d3.csv("./data/bar_cusnum.csv",function(error,databar){
			//读取网吧顾客人数
			barcusnuminfo=[];
			for(let i=0;i<databar.length;i++){
				barcusnuminfo.push({"barid":parseInt(databar[i]["ID"]),"cusnum":parseInt(databar[i]["person_num"])});
			}
		});
		var convertData = function (data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push({
						name: data[i].name,
						value: geoCoord.concat(data[i].value),
						ind:data[i].barID
					});
					//console.log(geoCoord.concat(data[i].value));
				}
			}
			return res;
		};
		var convertData2 = function (data) {
			var res = [];
			for (var i = 0; i < data.length; i++) {
				var geoCoord = geoCoordMap[data[i].name];
				if (geoCoord) {
					res.push(geoCoord.concat(data[i].value));
				}
			}
			return res;
		};
		//地图和散点图设置
		var mapoption = {
			//backgroundColor: 'white',
			//color:['#93b7e3'],
			title: {
				text: 'internet bar geo info',
				x:'center',
				textStyle: {
					color: 'white'
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					//return params.data.ind;
					return "barID: "+params.data.name;
				}
			},
			geo: {
				map: 'chongqing',
				zoom:1.5,
				roam:true,
				label: {
					emphasis: {
						show: true,
						textStyle: {
							color: '#ccc'
							//color: 'rgba(0,0,0,0.4)'
						}
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#111'
					},
					emphasis: {
						areaColor: '#2a333d'
					}
				}
			},
			series: [
				{
					name: 'bar',
					type: 'scatter',
					coordinateSystem: 'geo',
					data: convertData([{}]),
					symbolSize: 10,
					label: {
						normal: {
							show: false
						},
						emphasis: {
							show: false
						}
					},
					symbolSize: function (val, param) {
						//console.log(val);
						return sizelinear(param.data.ind,val[2]);
					},
					itemStyle: {
						emphasis: {
							color:'#f6b26b',//'#577ceb',
							borderColor:'#f99935',//'#577ceb',
							borderWidth:5
						},
						normal: {
							borderColor:'gray',
							borderWidth:0.2,
							color: function (param) {
								return colorlinear(param.data.ind,param.value[2])
							}
						}
					}
				}
			]
		};
		//热力图设置
		var mapoption2 =Observer.deepClone(mapoption);
		mapoption2.series[0]={
		//mapoption2.series[1]={
			name: 'p3',
			type: 'heatmap',
			coordinateSystem: 'geo',
			data: convertData2([{}])
		};
		mapoption2.visualMap={
			splitNumber: 5,
			//seriesIndex: [1],
			inRange: {
				color: ['#d94e5d','#eac736','#50a3ba'].reverse()
			},
			textStyle: {
				color: '#fff'
			}
		};
		
		
		var barpop = document.getElementById("p1_pop");
		var barpopChart = echarts.init(barpop);
		//弹出框设置
		var barpopoption={
			backgroundColor:"rgba(0,0,0,0.3)",
			title : {
				text: 'xxx',
				textStyle:{fontWeight:"normal",fontSize:12,color:"white"},
				subtext:'duration time Top 5',
				subtextStyle:{fontWeight:"normal",fontSize:12,color:"white"},
				itemGap:1
			},
			grid:{
				top:38,
				left:45,
				bottom:15
			},
			tooltip : {
				trigger: 'axis',
				axisPointer : {  
					type : 'shadow' 
				},
				formatter:function (params) {
					//console.log(params);
					return "0";
				}
			},
			xAxis : [
				{
					type : 'category',
					axisLine:{
						lineStyle:{
							color:'white'
						}
					},
					axisLabel:{
						show:false
					},
					data : ['1','2','3','4','5']
				}
			],
			yAxis : [
				{
					type : 'value',
					axisLine:{
						lineStyle:{
							color:'white'
						}
					},
					axisLabel:{
						textStyle:{
							color:'white'
						}
					},
					splitLine: {
						show: false
					}
				}
			],
			series : [{
					name:'dtop5',
					type:'bar',
					data:[2.0, 4.9, 7.0, 23.2, 25.6],
				}]
		};
		barpopChart.setOption(barpopoption, true);
		$("#p1_pop").hide();
		$("#p4_pop").hide();
		//地图上的点点击触发
		function mapchartclickfunc(params){
			if (params.componentType === 'series') {
				//console.log(params.data.ind);
				//console.log(params.dataIndex);
				//如果之前存在点击过的，取消高亮
				if(JSON.stringify(objpreclicked) != "{}"){ 
					mapChart.dispatchAction({
						type: 'downplay',
						seriesIndex: objpreclicked.seriesIndex,
						seriesName: objpreclicked.seriesName,
						dataIndex: objpreclicked.dataIndex,
						name: objpreclicked.name
					});
				}
				//如果现在点击的不是之前点击的，高亮
				if(objpreclicked.dataIndex!=params.dataIndex){
					mapChart.dispatchAction({
						type: 'highlight',
						seriesIndex: params.seriesIndex,
						seriesName: params.seriesName,
						dataIndex: params.dataIndex,
						name: params.name
					})
					objpreclicked.seriesIndex=params.seriesIndex;
					objpreclicked.seriesName=params.seriesName;
					objpreclicked.dataIndex=params.dataIndex;
					objpreclicked.name=params.name;
					Observer.fireEvent("bar_selected",params.data.ind,Barmap);
				}else{
					//如果重复点击
					objpreclicked={};
					Observer.fireEvent("bar_selected_cancel",[],Barmap);
				}
			}
		}		
		//地图上的点双击触发
		function mapchartdblclickfunc(params){
			console.log(params.data.name+" "+params.data.ind);
			if(barmap.mode==1){
				if(durationbrushrange==-1){return;}
				if(dblclickedbar==params.data.ind){
					mapChart.dispatchAction({
						type: 'downplay',
						dataIndex: dblclickedbar0
					});
					dblclickedbar=-1;dblclickedbar0=-1;
					$("#p1_pop").hide();
				}else{
					//console.log(event.clientX+" "+event.clientY);
					$("#p1_pop").css("left",event.clientX+10).css("top",event.clientY+10);
					//query data
					console.log({id:params.data.ind, left:durationbrushrange[0]*timeinterval, right:durationbrushrange[1]*timeinterval});
					$.ajax({
						type: "POST",
						url: "http://182.254.134.126:9494/get_personinfo_by_duration_and_barid",
						dataType: "json",
						contentType: "application/json;charset=utf-8",
						data: JSON.stringify({id:params.data.ind, left:durationbrushrange[0]*timeinterval, right:durationbrushrange[1]*timeinterval}),
						success: function(data) {
							//console.log(data.res);
							if(data.status==0){return;}
							dblclickedbarpopobj=data.res;
							
							//返回值存储在 dblclickedbarpopobj
							//let tmpd=_.pluck(dblclickedbarpopobj,"DURATION");
							//barpopoption.series[0].data=_.map(tmpd, function(num){ return Math.log(num); });
							barpopoption.series[0].data=_.pluck(dblclickedbarpopobj,"DURATION");
							barpopoption.xAxis[0].data=_.range(dblclickedbarpopobj.length);
							barpopoption.tooltip.formatter=function (params) {
								let tmpind=params[0].dataIndex;
								return dblclickedbarpopobj[tmpind].PERSONID+":"+dblclickedbarpopobj[tmpind].DURATION;
							}
							barpopoption.title.text="barID:"+params.data.name;
							barpopoption.title.subtext='duration time Top '+dblclickedbarpopobj.length;
							
							
							barpopChart.setOption(barpopoption, true);
							$("#p1_pop").show();
							mapChart.dispatchAction({
								type: 'downplay',
								dataIndex: dblclickedbar0
							});
							dblclickedbar=params.data.ind;
							dblclickedbar0=params.dataIndex;
							mapChart.dispatchAction({
								type: 'highlight',
								dataIndex: params.dataIndex
							})
						},
						error: function(message) {
							console.log("fail");
						}
					});
				}
			}else{
				//console.log("pop4");
				if(dblclickedbar==params.data.ind){
					mapChart.dispatchAction({
						type: 'downplay',
						dataIndex: dblclickedbar0
					});
					dblclickedbar=-1;
					dblclickedbar0=-1;
					$("#p4_pop").hide();
				}else{
					mapChart.dispatchAction({
						type: 'downplay',
						dataIndex: dblclickedbar0
					});
					dblclickedbar=params.data.ind;dblclickedbar0=params.dataIndex;
					mapChart.dispatchAction({
						type: 'highlight',
						dataIndex: params.dataIndex
					})
					$("#p4_pop").css("left",event.clientX+10).css("top",event.clientY+10);
					Observer.fireEvent("bar_dblclicked",params.data.ind,Barmap);
					$("#p4_pop").show();
				}
			}
			
		}
		//duration filter#########################################
		//var bartimedata=[1,5,6,9,3,4,10,7,8,2];
		var bartimedataorigin=[2330,1784,898,486,268,
		166,124,83,53,46,30,33,26,14,13,14,8,7,6,6,2,2,7,4,2,1,3,0,2,2,0,3,1,1,1,1,0,2,2,0,1,1,0,1,1,
		0,0,1,0,48,33,2,1,2,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0
		,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0
		,0,0,0,0];
		var bartimedata=_.map(bartimedataorigin,function(value){return Math.log(value+1);});
		var timeinterval=24;
		var maxduration=3519.37;

		var bartimedom = document.getElementById("bar_filter_timerange");
		var bartimeChart = echarts.init(bartimedom);
		var bartimeoption = {
			color:['white'],
			grid:{
				top:10,
				left:25,
				bottom:50
			},
			toolbox: {
				iconStyle: {
					normal: {
						borderColor: '#fff'
					},
					emphasis: {
						borderColor: '#b1e4ff'
					}
				}
			},
			tooltip: {
				trigger: 'axis',
				formatter: function (params) {
					//console.log(params);
					//console.log(bartimedataorigin[params[0].dataIndex])
					return params[0].axisValue+" : "+bartimedataorigin[params[0].dataIndex];
				}
			},
			xAxis: {
				name:'duration',
				nameLocation:'middle',
				nameGap:25,
				axisLine:{
					lineStyle:{
						color:'white'
					}
				},
				axisLabel:{
					textStyle:{
						color:'white'
					}
				},
				data: bartimedata.map(function (item,ind) {
					return ind*24;
				})
			},
			yAxis: {
				axisLine:{
					lineStyle:{
						color:'white'
					}
				},
				axisLabel:{
					textStyle:{
						color:'white'
					}
				},
				splitLine: {
					show: false
				}
			},
			brush:{
				 name:'duration',
				 xAxisIndex:'all',
				 toolbox:["lineX"],
				 brushType:'lineX',
				 throttleType :'debounce',
				 throttleDelay: 700,
				 brushStyle:{
					 borderWidth: 1,
					 color: 'rgba(202,213,235,0.3)',
					 borderColor: 'rgba(202,213,235,0.8)'
				 }
			},
			series: {
				name: 'bar_timefilter',
				type: 'line',
				smooth:true,
				lineStyle:{
					normal:{
						width:0.7
					}
				},
				data: bartimedata.map(function (item) {
					return item;
				})
			}
		}
		bartimeChart.setOption(bartimeoption,true);
		bartimeChart.on('brushSelected', function (params) {
			filterbrushed(params)
		});

		//customer number filter###################################
		//var barcusnumdata=[14,17,32,9,7,10,21,9,12,10];
		var barcusnumdataorigin=[183,141,123,134,102,128,94,88,96,89,82,71,79,62,67,50,43,58,45,45,45,36,39,37,40,
		27,16,20,25,22,21,23,10,17,17,6,10,8,11,7,14,11,6,7,8,5,9,1,3,4,3,7,3,2,1,3,3,3,0,5,3,2,
		0,1,0,0,1,0,1,0,3,4,4,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
		0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
		var barcusnumdata=_.map(barcusnumdataorigin,function(value){return Math.log(value+1);});
		var numinterval=300;
		var cumnummax=42901;
		var barcusdom = document.getElementById("bar_filter_cusnumber");
		var barcusChart = echarts.init(barcusdom);
		var barcusnumoption=Observer.deepClone(bartimeoption);
		barcusnumoption.series.name='bar_cusnumfilter';
		barcusnumoption.series.data=
		barcusnumdata.map(function (item) {
				return item;
		})

		barcusnumoption.xAxis.data=barcusnumdata.map(function (item,ind) {return ind*numinterval;})
		barcusnumoption.xAxis.name='customer num';
		barcusnumoption.brush.name='customer';
		barcusnumoption.tooltip.formatter=function(params){
			//return params[0].data;
			return params[0].axisValue+" : "+barcusnumdataorigin[params[0].dataIndex];
		}

		barcusChart.setOption(barcusnumoption,true);
		barcusChart.on('brushSelected', function (params) {
			filterbrushed(params)
		});
		//############################################
		var totalbaridarr;//=_.pluck(bardata,"barID");
		var durationfilterbarid;//=totalbaridarr;
		var durationfilterbarnum=[];//=[{"barID":123,"cnt":3},{"barID":125,"cnt":12}]
		var cusnumberfilterbarid;//=totalbaridarr;
		function filterbrushed(params){
			//筛选
			//console.log(params);
			var tmparea=params.batch[0].areas[0];
			//如果刷选范围不为空
			if(tmparea!=undefined){
				let tmpname=params.batch[0]["brushName"];
				let tmprange=params.batch[0].areas[0]["coordRange"];
				//let tmprange=[4,5];
				cancelhl();
				if(tmpname=="duration"){
					//如果刷选的是duration
					durationbrushrange=tmprange;
					if(tmprange[1]==1){
						filterbar("duration",totalbaridarr,false,0,0);
						return;
					}
					var tmpbarIDarr=[];
					durationfilterbarnum=[];
					var readstart=tmprange[0];
					var readend=tmprange[1];
					if(tmprange[1]>120/timeinterval){
						readend=120/timeinterval;
					}
					let filetoread=(filename(tmprange[0],tmprange[1]));
					if(tmprange[1]<=120/timeinterval){
					//如果只需要读取本地文件
					//if(filetoread.length!=0){
						//如果需要读取本地文件
						console.log("filetoread");
						console.log(filetoread);
						let cnt=0;
						d3.csv(filetoread[0],function(error,data0){
							for(let i=0;i<data0.length;i++){
								tmpbarIDarr.push(parseInt(data0[i].ID));
								durationnumadd(parseInt(data0[i].ID),parseInt(data0[i].nums));
							}
							cnt++;
							if(cnt!=filetoread.length){
								d3.csv(filetoread[1],function(error,data1){
									for(let i=0;i<data1.length;i++){
										tmpbarIDarr.push(parseInt(data1[i].ID));
										durationnumadd(parseInt(data1[i].ID),parseInt(data1[i].nums));
									}
									cnt++;
									if(cnt!=filetoread.length){
										d3.csv(filetoread[2],function(error,data2){
											for(let i=0;i<data2.length;i++){
												tmpbarIDarr.push(parseInt(data2[i].ID));
												durationnumadd(parseInt(data2[i].ID),parseInt(data2[i].nums));
											}
											cnt++;
											if(cnt!=filetoread.length){
												d3.csv(filetoread[3],function(error,data3){
													for(let i=0;i<data3.length;i++){
														tmpbarIDarr.push(parseInt(data3[i].ID));
														durationnumadd(parseInt(data3[i].ID),parseInt(data3[i].nums));
													}
													cnt++;
													//filterbar("duration",tmpbarIDarr,tmprange[1]!=readend,tmprange[0],tmprange[1]);
													filterbar("duration",tmpbarIDarr,false,tmprange[0],tmprange[1]);
												})
											}else{
												//filterbar("duration",tmpbarIDarr,tmprange[1]!=readend,tmprange[0],tmprange[1]);
												filterbar("duration",tmpbarIDarr,false,tmprange[0],tmprange[1]);
											}
										})
									}else{
										//filterbar("duration",tmpbarIDarr,tmprange[1]!=readend,tmprange[0],tmprange[1]);
										filterbar("duration",tmpbarIDarr,false,tmprange[0],tmprange[1]);
									}
								})
							}else{
								//filterbar("duration",tmpbarIDarr,tmprange[1]!=readend,tmprange[0],tmprange[1]);
								filterbar("duration",tmpbarIDarr,false,tmprange[0],tmprange[1]);
							}
						})
					}else{
						//filterbar("duration",tmpbarIDarr,tmprange[1]!=readend,tmprange[0],tmprange[1]);
						filterbar("duration",tmpbarIDarr,true,tmprange[0],tmprange[1]);
					}
				}else if(tmpname=="customer"){
					//如果刷选的是customer
					cusnumberrange=tmprange;
					let tmpbar2=_.filter(barcusnuminfo,function(obj){return obj.cusnum>=tmprange[0]*numinterval&&obj.cusnum<tmprange[1]*numinterval;})
					let tmpbarid2=_.pluck(tmpbar2,"barid");
					//console.log(tmpbarid2);
					filterbar("customer",tmpbarid2,false,0,0);
				}
			}else{
				//刷选范围为空
				let tmpname=params.batch[0]["brushName"];
				//console.log(tmpname);
				if(tmpname=="duration"){
					durationbrushrange=-1;
					filterbar("duration",totalbaridarr,false,0,0);
				}else if(tmpname=="customer"){
					//console.log("customer number all");
					cusnumberrange=-1;
					filterbar("customer",totalbaridarr,false,0,0);
				}
			}
		}
		function durationnumadd(baridp,cntp){
			for(let i=0;i<durationfilterbarnum.length;i++){
				if(parseInt(durationfilterbarnum[i].barID)==baridp){
					durationfilterbarnum[i].cnt=durationfilterbarnum[i].cnt+cntp
					return;
				}
			}
			durationfilterbarnum.push({"barID":baridp,"cnt":cntp});
		}
		function filename(start,end){
			//根据duration 刷选的范围 返回要读取的文件名
			let namearr=["data/24-48.csv","data/48-72.csv","data/72-96.csv","data/96-120.csv"];
			if(start==0){start=1;}
			return namearr.slice(start-1,end-1);
		}
		
		function filterbar(filtername,baridarr,queryflag,querystart,queryend){
			//根据过滤后网吧的ID过滤map上要显示的对象
			//如果duration过滤范围超过120h，调用后端接口查询
			if(filtername=="duration"){
				durationfilterbarid=baridarr;
				if(queryflag){
					let readstart2=querystart*timeinterval;
					//if(readstart2<120){readstart2=120;}
					let readend2=queryend*timeinterval;
					//if(readend2>maxduration){readend2=maxduration}
					//console.log("start query duration from "+readstart2+" to "+readend2);
					$.ajax({
						type: "POST",
						url: "http://182.254.134.126:9494/get_bar_id_by_duration",
						dataType: "json",
						contentType: "application/json;charset=utf-8",
						data: JSON.stringify({left:readstart2, right:readend2}),
						success: function(data) {
							//console.log(data);
							if(data.status==0){
								console.log("empty");
								return;
							}
							for(let i=0;i<data.res.length;i++){
								durationfilterbarid.push(parseInt(data.res[i].ID));
								durationfilterbarnum.push({"barID":parseInt(data.res[i].ID),"cnt":parseInt(data.res[i].nums)});
							}
							durationfilterbarid=_.uniq(durationfilterbarid);
							reloadmap();
						},
						error: function(message) {
							console.log("query fail");
							console.log(message);
						}
					});
				}else{
					durationfilterbarid=_.uniq(durationfilterbarid);
					reloadmap();
				}
			}else if(filtername=="customer"){
				cusnumberfilterbarid=baridarr;
				reloadmap();
			}
		}

		function findandbarid(arra,arrb){
			//取数组的交集
			let tmparr=_.difference(arra,arrb);
			return _.difference(arra,tmparr);
		}

		function reloadmap(){
			//根据数组cusnumberfilterbarid和durationfilterbarid 重新画map
			let tmpb=findandbarid(durationfilterbarid,cusnumberfilterbarid);
			//console.log(durationfilterbarid);console.log(cusnumberfilterbarid);console.log(tmpb);console.log("##########");
			console.log(tmpb);
			console.log(durationfilterbarnum);
			bardatafiltered = _.filter(bardata, function(obj){ return _.indexOf(tmpb,obj.barID)!=-1; });
			mapoption.series[0].data=convertData(bardatafiltered);
			changecolor(durationfilterbarnum);
			mapChart.setOption(mapoption, true);
		}
		
		function changecolor(data){
			//如果筛选了duration，根据nums改变颜色和tip
			if(durationbrushrange!=-1){
				var tmp=_.pluck(data,"cnt");
				var tmp2=_.pluck(data,"barID");
				var min=_.min(tmp);var max=_.max(tmp);
				//console.log(min+" "+max);
				var a = d3.rgb(224,224,224);
				var b = d3.rgb(70,100,190);
				colorcompute = d3.interpolate(a,b);  
				colorcomputelinear = d3.scale.linear()  
										.domain([min,max])  
										.range([0,1]);  
				
			}
			mapoption.tooltip.formatter=function (params) {
				if(durationbrushrange!=-1){
					let tmpi=_.indexOf(tmp2,params.data.ind);
					if(tmpi!=-1){return "barID: "+params.data.name+" cnt: "+tmp[tmpi];}
					else{return "barID: "+params.data.name;}
				}
				else{return "barID: "+params.data.name;}
			}
			colorlinear=function(ind,d){
									if(barmap.mode==3&&_.indexOf(problem3bararr,ind)!=-1){return "#f6b26b";}
									else{
										if(durationbrushrange!=-1){
											let tmpi=_.indexOf(tmp2,ind);
											if(tmpi!=-1){return colorcompute(colorcomputelinear(tmp[tmpi])); }
											else return "#E0E0E0";
										}else{
											return "#E0E0E0";//"#577ceb";
										}
									}
								}
		}
		
		function cancelhl(){
			//取消map的高亮
			if(JSON.stringify(objpreclicked) != "{}"){
				mapChart.dispatchAction({
						type: 'downplay',
						seriesIndex: objpreclicked.seriesIndex,
						seriesName: objpreclicked.seriesName,
						dataIndex: objpreclicked.dataIndex,
						name: objpreclicked.name
					});
				objpreclicked={};
			}
			if(dblclickedbar0!=-1){
				mapChart.dispatchAction({
						type: 'downplay',
						dataIndex: dblclickedbar0
					});
				dblclickedbar0=-1;
			}
		}
		
		barmap.onMessage = function(message, data, from){
			if(message == "problem3"){
				//if(from == Iphist ){
					problem3bararr=data;
					console.log(barmap.mode);
					if(barmap.mode==3){
						console.log(problem3bararr);
						//mapChart.setOption(mapoption, true);
						//mode-3 问题三 青年犯罪团伙 高亮
						$("#problem_1").hide();
						re0();
						//改变颜色大小
						/*
						colorlinear=function(ind,d){
							if(_.indexOf(problem3bararr,ind)==-1){return "#f6b26b";}
							else{return "#577ceb";}
						}
						*/
						sizelinear=function(ind,d){
							if(_.indexOf(problem3bararr,ind)==-1){return 8;}
							else{return 15;}
						}
						reloadmap();
					}
				//}
			}
			
			if(message == "problem2"){
				//if(from == Iphist ){
					problem2barobj=data;
					if(barmap.mode==2){
						$("#problem_1").hide();
						re0();
						let tmp=_.pluck(data,"value");
						//console.log(tmp);
						mapoption2.visualMap.min=_.min(tmp);
						mapoption2.visualMap.max=_.max(tmp);
						//mapoption2.series[0]=Observer.deepClone(mapoption.series[0]);
						//mapoption2.series[1].data=convertData2(problem2barobj);
						mapoption2.series[0].data=convertData2(problem2barobj);
						mapChart.setOption(mapoption2, true);
					}
				//}
			}
			
			
		};
		function re0(){
			//切换mode时
			$("#p1_pop").hide();$("#p4_pop").hide();
			dblclickedbar=-1;dblclickedbar0=-1;
			cancelhl();
			durationfilterbarid=totalbaridarr;
			cusnumberfilterbarid=totalbaridarr;
			durationfilterbarnum=[];
			durationbrushrange=-1;cusnumberrange=-1;
		}
		/*
		//problem2 test
		setTimeout(function(){
			Observer.fireEvent("problem2",[
			{"name":50010210000086,"value":100},
			{"name":50024210000053,"value":50},
			{"name":50023010000004,"value":30},
			{"name":50023010000014,"value":40},
			{"name":50024210000060,"value":31},
			{"name":50022310000007,"value":7},
			{"name":50022710000024,"value":22}
			],
			Barmap);
		},5000);
		
		
		//problem3 test
		setTimeout(function(){
			Observer.fireEvent("problem3",[1095],Barmap);
		},6000);
		*/
		
		Observer.addView(barmap);
		return barmap;
	}
	
	
	window["Barmap"] = Barmap;
})();