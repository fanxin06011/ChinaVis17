


(function(){
	function Crime(Observer){
		var crime={};
		/*
		code here
		*/
        var selected_time_min;
        var selected_time_max;
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
			//反馈时间的地方我在这里写了一个console.Log···但是不知道怎么用端口
			var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S");
            selected_time_min = parseTime(data.values.min);
            selected_time_max = parseTime(data.values.max);
			console.log({beginTime:parseTime(data.values.min), endTime:parseTime(data.values.max)});
			$.ajax({
				type: "POST",
				url: "http://182.254.134.126:9494/get_siteId_and_itscount_by_time",
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
        var categories = ['categoryA', 'categoryB', 'categoryC','categoryD','categoryE','categoryF','categoryG','categoryH','categoryI'];
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

        function trans(a)
        {
            a[4]='\\';
            a[7]='\\';
            console.log(a);
            return a;
        }

        function getnewdataid(bar_id)
        {
            var parseTime = d3.time.format("%Y-%m-%d %H:%M:%S");
            console.log("aa");
            //console.log({beginTime:parseTime(data.values.min), endTime:parseTime(data.values.max)});
            console.log(bar_id);
            console.log(selected_time_min);
            console.log(selected_time_max);
            $.ajax({
                type: "POST",
                url: "http://182.254.134.126:9494/get_record_by_time_and_barid",
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
                        var tmp_begin_date = new Date((tmp["beginTime"]));
                        var tmp_end_date   = new Date((tmp["endTime"]));
                        console.log(tmp_begin_date);
                        categories.push(tmp["PERSONID"]);
                        gantt_data.push({
                                name: types[0],
                                value: [
                                    k,
                                    tmp_begin_date.getTime(),
                                    tmp_end_date.getTime(),
                                    tmp_begin_date.getTime()-tmp_end_date.getTime()
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
                    myChart.setOption(option);
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