


(function(){
    var sentData;
    var selected_time_min;
    var selected_time_max;
    var strt = 0;
	function Crime(Observer){
		var crime={};
        var first_flag=0;
		/*
		code here
		*/
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      $("#slider").dateRangeSlider({
        bounds:{
          min: new Date(2016, 8, 1),
          max: new Date(2016, 10, 31)},
        defaultValues: {min: new Date(2016, 9, 1), max: new Date(2016, 9, 10)},

        scales: [{
          first: function(value){ return value; },
          end: function(value) {return value; },
          next: function(value){
            var next = new Date(value);
            return new Date(next.setMonth(value.getMonth() + 1));
          },
          label: function(value){
            return months[value.getMonth()];
          },
          format: function(tickContainer, tickStart, tickEnd){
            tickContainer.addClass("myCustomClass");
          }
        }]

        });

        $("#slider").bind("valuesChanged", function(e, data){
			console.log("Something moved. min: " + data.values.min + " max: " + data.values.max);
			
			var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S");
            selected_time_min = parseTime(data.values.min);
            selected_time_max = parseTime(data.values.max);
            console.log(selected_time_min.split("-")[1]);
            if(selected_time_min.split("-")[1] == "09")
            {
                strt = 9;
            }
            else if(selected_time_min.split("-")[1] == "10")
            {
                strt = 10;
            }
            else if(selected_time_min.split("-")[1] == "11")
            {
                strt = 11;
            }
            else
            {
                console.log("Invalid Strt");
            }

			console.log({beginTime:parseTime(data.values.min), endTime:parseTime(data.values.max)});
			$.ajax({
				type: "POST",
				url: "http://127.0.0.1:9494/get_siteId_and_itscount_by_time",
				dataType: "json",
				contentType: "application/json;charset=utf-8",
				data: JSON.stringify({beginTime:parseTime(data.values.min), endTime:parseTime(data.values.max)}),
				success: function(data) {
					console.log(data);
					Observer.fireEvent("problem3_timerange",data.res,Crime);
				},
				error: function(message) {
					console.log("查询失败");
				}
			});
        });

        /*
        这里上面是设定的那个滑动的进度条
        */


        var myChart = echarts.init(document.getElementById('Chart'));
        var domheight = 200;
        var gantt_data = [];
        var dataCount = 10;
        var startTime = +new Date();
        console.log(typeof(startTime));
        var categories = ['cc03a93e2decc4cc1c', 'ea723a6e98e5749bb0', '003f97c9f42edf51b6','4aa5e9d88ccb6c670f'];
        var types = [
            {name: 'Online Time', color: '#7b9ce1'}
        ];

        // Generate mock data
        echarts.util.each(categories, function (category, index) {
            var baseTime = startTime;
            for (var i = 0; i < dataCount; i++) {
                var typeItem = types[Math.round(Math.random() * (types.length - 1))];
                var duration = Math.round(Math.random() * 10000);
                gantt_data.push({
                    name: typeItem.name,
                    value: [
                        index,
                        baseTime,
                        baseTime += duration,
                        duration
                    ],
                    itemStyle: {
                        normal: {
                            color: typeItem.color
                        }
                    }
                });
                baseTime += Math.round(Math.random() * 2000);
            }
        });

        console.log(gantt_data);
        function renderItem(params, api) {
            var categoryIndex = api.value(0);
            var start = api.coord([api.value(1), categoryIndex]);
            var end = api.coord([api.value(2), categoryIndex]);
            //var height = api.size([0, 1])[1] * 0.6;
            var height = ((domheight - 30) / categories.length)*0.7;
            return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect({
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                }, {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                }),
                style: api.style()
            };
        }


        option = {
            tooltip: {
                formatter: function (params) {
                    return params.marker + params.name + ': ' + params.value[3] + ' ms';
                }
            },  
            legend: {
                data: ['bar', 'error']
            },
             toolbox: {
                show: true,
                feature: {
                    myfunc:{
                        show:true,
                        title:"confirm",
                        icon:'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                        onclick: function (){
                           confirm();
                        }
                        }
                }
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: domheight-10,
                height: 5,
                borderColor: 'transparent',
                backgroundColor: '#e2e2e2',
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                handleSize: 10,
                handleStyle: {
                    shadowBlur: 6,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2,
                    shadowColor: '#aaa'
                },
                labelFormatter: ''
            }, {
                type: 'inside',
                filterMode: 'weakFilter'
            }],
            grid: {
                height:domheight - 50,
                top:10
            },



            
            brush: {
                yAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                colorAlpha: 0.1
                },
                throttleType: 'debounce',
                throttleDelay: 300,
        },

            xAxis: {
                min: startTime,
                scale: true,
                axisLabel: {
                    formatter: function (val) {
                        return Math.max(0, val - startTime) + ' ms';
                    },
                textStyle: {
                                color: 'white'
                            }
                },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
            	}
            },
            yAxis: {
                data: categories,
                axisLabel:{
                textStyle: {
                                color: 'white'
                            }
                        },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
            	}
            },
            series: [{
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    normal: {
                        opacity: 0.8
                    }
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: gantt_data
            }]
        };


        myChart.setOption(option);
        myChart.on('brushSelected', renderBrushed);



        function renderBrushed(params) {
            console.log(params);
            var temp_min = params.batch[0].areas[0]["coordRange"];
            temp_min[1]=Math.ceil(temp_min[1]);
            temp_min[0]=Math.floor(temp_min[0]);
            var sentPerson = [];
            for(var m = temp_min[0];m<=temp_min[1];m++)
            {
                sentPerson.push(categories[m]);
            }
            if(typeof(strt) == "number")
            {
            console.log(strt);
            }
            else
            {
            console.log("Not number");
            console.log(typeof(strt));

            }   
            sentData = {
                Status : first_flag,
                index  : temp_min,
                personid : sentPerson,
                data: gantt_data,
                monthL: strt
            }
            /*

        */
        
        };



        

            myChart.dispatchAction({
            type: 'brush',
            areas: [
            {
                brushType: 'lineY',
                coordRange: [categories.length/3, categories.length/2],
                yAxisIndex: 0
            }
            ]
            });
        
        function confirm()
        {
            var tmin=-1,tmax=-1;
            console.log(sentData);

            Observer.fireEvent("Selected_id",sentData,Crime);
         
            
            var gcate = [];
            var gdata = [];
            for(var i=0;i<=sentData.index[1];i++)
            {
                if(i >= sentData.index[0] && i <= sentData.index[1])
                {
                    gantt_data[i].value[0] = gcate.length;
                    gcate.push(categories[i]);
                    gdata.push(gantt_data[i]);
                    if(tmin == -1 || tmin > gantt_data[i].value[1])
                    {
                        tmin = gantt_data[i].value[1];
                    }
                    if(tmax == -1 || tmax < gantt_data[i].value[2])
                    {
                        tmax = gantt_data[i].value[2]
                    }

                }
            }
            
              
            gantt_data = [];
            categories = [];
            gantt_data = gdata;
            categories = gcate;
            console.log(gantt_data);
            console.log(categories);

            option = {
            tooltip: {
                formatter: function (params) {
                    //console.log(params);
                    return categories[params.dataIndex] + params.name + ': ' + params.value[3] + ' ms';
                }
            },  
            legend: {
                data: ['bar', 'error']
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: domheight-10,
                height: 5,
                borderColor: 'transparent',
                backgroundColor: '#e2e2e2',
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                handleSize: 10,
                handleStyle: {
                    shadowBlur: 6,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2,
                    shadowColor: '#aaa'
                },
                labelFormatter: ''
            }, {
                type: 'inside',
                filterMode: 'weakFilter'
            }],
            grid: {
                height:domheight - 50,
                top:10
            },
            xAxis: {
                min: tmin,
                scale: true,
                axisLabel: {
                    formatter: function (val) {
                        return Math.max(0, val - startTime) + ' ms';
                    },
                textStyle: {
                                color: 'white'
                            }
                },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
                }
            },
            yAxis: {
                data: categories,
                axisLabel:{
                textStyle: {
                                color: 'white'
                            }
                        },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
                }
            },
            series: [{
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    normal: {
                        opacity: 0.8
                    }
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: gantt_data
                }]
            };

            myChart.setOption(option);
            myChart.dispatchAction({
            type: 'brush',
            areas: [
            {
                brushType: 'lineY',
                coordRange: [categories.length/3, categories.length/2],
                yAxisIndex: 0
            }
            ]
            });
        }
     

        function getnewdataid(bar_id)
        {
            var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S");
            console.log("aa");
            first_flag = 1;
            //console.log({beginTime:parseTime(data.values.min), endTime:parseTime(data.values.max)});
            console.log(bar_id);
            console.log(selected_time_min);
            console.log(selected_time_max);
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_record_by_time_and_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:bar_id,beginTime:selected_time_min, endTime:selected_time_max}),
                success: function(data) {
                    console.log(data.res);
                    console.log(data.res.length);
                    var people=data.res;
                    for(var k = 0; k < people.length;k++)
                    {
                        var tmp = people[k];
                        //console.log(trans(tmp["beginTime"]));
                        var str1 = tmp["beginTime"];
                        str1=str1.replace(/-/g,"/")

                        var str2 = tmp["endTime"];
                        str2=str2.replace(/-/g,"/")

                        var str3 = selected_time_min;
                        str3 = str3.replace(/-/g,"/");

                        var tmp_begin_date = new Date(str1);
                        var tmp_end_date   = new Date(str2);
                        var tmp_base_time  = new Date(str3);
                        //console.log(tmp_begin_date);
                        //console.log(tmp_end_date);
                        if($.inArray(tmp["PERSONID"],categories) == -1)
                        {
                            categories.push(tmp["PERSONID"]);
                        }  
                        gantt_data.push({
                                name: types[0].name,
                                value: [
                                    categories.indexOf(tmp["PERSONID"]),
                                    (tmp_begin_date.getTime()),
                                    (tmp_end_date.getTime()),
                                    (tmp_end_date.getTime()-tmp_begin_date.getTime())                        
                                    ],
                                itemStyle: {
                                    normal: {
                                        color: types[0].color
                                    }
                                }
                            });
                        //console.log(typeof(data[k][beginTime]));
                    }
                    console.log(gantt_data);
                    console.log(categories);
            
            option = {
            tooltip: {
                formatter: function (params) {
                    console.log(params);
                    return categories[params.data.value[0]] + ': ' + params.value[3] + ' ms';
                }
            },  
            legend: {
                data: ['bar', 'error']
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: domheight-10,
                height: 5,
                borderColor: 'transparent',
                backgroundColor: '#e2e2e2',
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                handleSize: 10,
                handleStyle: {
                    shadowBlur: 6,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2,
                    shadowColor: '#aaa'
                },
                labelFormatter: ''
            }, {
                type: 'inside',
                filterMode: 'weakFilter'
            }],
            grid: {
                height:domheight - 50,
                top:10
            },
            xAxis: {
                min: tmp_base_time.getTime(),
                scale: true,
                axisLabel: {
                    formatter: function (val) {
                        return Math.max(0, val - tmp_base_time.getTime()) + ' ms';
                    },
                textStyle: {
                                color: 'white'
                            }
                },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
                }
            },
            yAxis: {
                data: categories,
                axisLabel:{
                textStyle: {
                                color: 'white'
                            }
                        },
                axisLine:{
                lineStyle:{
                    color:'white'
                }
                }
            },
            series: [{
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    normal: {
                        opacity: 0.8
                    }
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: gantt_data
                }]
            };
                myChart.setOption(option);
                myChart.dispatchAction({
                type: 'brush',
                areas: [
                {
                    brushType: 'lineY',
                    coordRange: [categories.length/3, categories.length/2],
                    yAxisIndex: 0
                }
                ]
                });
                //myChart.setOption(option);

        //Observer.fireEvent("problem3_timerange",data.res,Crime);
                },
                error: function(message) {
                   
                    console.log("查询失败");
                }
            });
        }




		//Observer.fireEvent("event_name",dataSend,Crime);
		crime.onMessage = function(message, data, from){
			if(message == "bar_selected_p3"){
				if(from == Barmap ){
					console.log(data);
                    categories = [];
                    gantt_data = [];
                    console.log("aa");
                    getnewdataid(data);
				}
			}

		};

		
		Observer.addView(crime);
		return crime;
	}
	
	
	window["Crime"] = Crime;
})();