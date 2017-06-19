


(function(){
	function Crime(Observer){
		var crime={};
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
        //反馈时间的地方我在这里写了一个console.Log···但是不知道怎么用端口
        });

        /*
        这里上面是设定的那个滑动的进度条
        */


        var myChart = echarts.init(document.getElementById('Chart'));
        var domheight = 200;
        var data = [];
        var dataCount = 10;
        var startTime = +new Date();
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
                data.push({
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
                data: data
            }]
        };

        myChart.setOption(option);






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