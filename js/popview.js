


(function(){
	function Popview(Observer){
        var provinceID = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",51:"四川",51:"重庆",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆"};
		var bars = [];
        function bar(id, siteid) {
            this.id = id;
            this.siteid = siteid;
            this.tran = 0;
            this.teen = 0;
            this.done = 0;
        }
        d3.csv("data/id_siteid.csv", function(error, data1) {
            if(error) console.log(error);
            for(var i=0; i<data1.length; i++) {
                var nb = new bar(data1[i]["id"], data1[i]["siteid"]);
                var id = nb.id;
                var siteid = nb.siteid;
                bars.push(nb);
            }
            console.log(bars);
        });
        var popview={};
		var width = 500;
        var height = 600;
        var padding0 = 5;
        var padding1 = 20;
        var width_svg = width-2*padding0;
        var height_svg = (height-2*padding0)/3;
        var color0 = ['#FFCC99',"#CCCCFF"];
        var color = ['#FFCC99','#66CCFF'];
        var color2 = ['#FF99CC','#FFFF99','#99CC66'];
        //svg0
        var svg0 = d3.select('#p4_pop').append('svg').attr('width',width_svg).attr('height',35);
        svg0.append('circle')
            .attr('cx',30)
            .attr('cy',20)
            .attr('r',10)
            .attr('fill',color0[0]);
        svg0.append('text')
            .attr('x',50)
            .attr('y',25)
            .text('未成年人')
            .attr("class","p4text")
            .attr("fill", "white");
        svg0.append('circle')
            .attr('cx',160)
            .attr('cy',20)
            .attr('r',10)
            .attr('fill',color0[1]);
        svg0.append('text')
            .attr('x',180)
            .attr('y',25)
            .text('成年人')
            .attr("class","p4text")
            .attr("fill", "white");
        svg0.append('circle')
            .attr('cx',275)
            .attr('cy',20)
            .attr('r',10)
            .attr('fill',color[1]);
        svg0.append('text')
            .attr('x',295)
            .attr('y',25)
            .text('流动人口')
            .attr("class","p4text")
            .attr("fill", "white");
        //svg1用于显示饼图
        var svg1 = d3.select('#p4_pop').append('svg').attr('width',width_svg).attr('height',height_svg);
        var p4_1 = svg1.append('g').attr('transform', "translate(" + width_svg/4 + ',' + height_svg/2 + ')');
        var dataset = [900,300];
        var pie = d3.layout.pie().sort(null).value(function(d){return d;})(dataset);
        var radius = (d3.min([width_svg,height_svg])-padding1)/2;
        var arc = d3.svg.arc().innerRadius(0).outerRadius(radius);
        var arcs = p4_1.selectAll('g')
            .data(pie)
            .enter()
            .append('g')
            .attr('class', "p4_1g");
        arcs.append('path')
            .attr('fill', function(d, i){
                return color0[i];
            })
            .attr('d', function(d){
                return arc(d);
            })
            .attr('class', "p4_1");
        arcs.append("text")
            .attr("transform",function(d){
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor","middle")
            .attr("fill", "white")
            .text(function(d){
                return d.data;
            })
            .attr("class","p4_1t");
            
        var p4_0 = svg1.append('g').attr('transform', "translate(" + width_svg*3/4 + ',' + height_svg/2 + ')');
        var dataset = [1,2,3];
        var pie = d3.layout.pie().sort(null).value(function(d){return d;})(dataset);
        var radius = (d3.min([width_svg,height_svg])-padding1)/2;
        var arc = d3.svg.arc().innerRadius(0).outerRadius(radius);
        var arcs = p4_0.selectAll('g')
            .data(pie)
            .enter()
            .append('g')
            .attr('class', "p4_0g");
        arcs.append('path')
            .attr('fill', function(d, i){
                return color2[i];
            })
            .attr('d', function(d){
                return arc(d);
            })
            .attr('class', "p4_0");
        arcs.append("text")
            .attr("transform",function(d){
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor","middle")
            .attr("fill", "white")
            .text(function(d){
                return d.data;
            })
            .attr("class","p4_0t");
            
        

        //svg2用于显示上网高峰折线图
        var svg2 = d3.select('#p4_pop').append('svg').attr('width',width_svg).attr('height',height_svg+10);
        temp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xScale2 = d3.scale.linear().domain([0,23]).range([padding1*3,width_svg-padding1]);
        var yScale2 = d3.scale.linear().domain([0,1]).range([height_svg-padding1,padding1]);
        var yAxis2 = d3.svg.axis().scale(yScale2).orient('left');
        var xAxis2 = d3.svg.axis().scale(xScale2).orient('bottom');
        svg2.selectAll(".p4_2_1")
            .data(temp)
            .enter()
            .append("line")
            .attr("x1", function(d,i){
                if(i>0) return xScale2(i-1);
                else return xScale2(0);
            })
            .attr("y1",function(d,i){
                if(i>0) return yScale2(temp[i-1]);
                else return yScale2(temp[i]);
            })
            .attr("x2",function(d,i){
                return xScale2(i);
            })
            .attr("y2",function(d,i){
                return yScale2(temp[i]);
            })
            .attr("stroke",function(d,i){return color[0];})
            .attr("stroke-width",2)
            .attr('class','p4_2_1')
            .attr("transform", "translate(" + -padding1 + ",0)");
        svg2.selectAll(".p4_2_2")
            .data(temp)
            .enter()
            .append("line")
            .attr("x1", function(d,i){
                if(i>0) return xScale2(i-1);
                else return xScale2(0);
            })
            .attr("y1",function(d,i){
                if(i>0) return yScale2(temp[i-1]);
                else return yScale2(temp[i]);
            })
            .attr("x2",function(d,i){
                return xScale2(i);
            })
            .attr("y2",function(d,i){
                return yScale2(temp[i]);
            })
            .attr("stroke",function(d,i){return color[1];})
            .attr("stroke-width",2)
            .attr('class','p4_2_2')
            .attr("transform", "translate(" + -padding1 + ",0)");
        svg2.append('g')
            .attr('class','p4_axis')
            .attr("transform", "translate(" + padding1*2 + ",0)")
            .call(yAxis2);
        svg2.append('g')
            .attr('class','p4_axis')
            .attr("transform", "translate("+-padding1+","+(height_svg-padding1)+")")
            .call(xAxis2);
        //svg3用于显示上网时长柱状图
        var svg3 = d3.select('#p4_pop').append('svg').attr('width',width_svg).attr('height',height_svg);
        duration = [1,2,3,4,5,6,7];
        var xScale3 = d3.scale.ordinal().domain(d3.range(duration.length)).rangeRoundBands([0,width_svg],0.15);
        var yScale3 = d3.scale.linear().domain([0,1]).range([height_svg-padding1,20]);
        svg3.selectAll('.p4_3_0')
            .data(duration)
            .enter()
            .append('text')
            .text(function(d){return d;})
            .attr('x',function(d,i){return xScale3(i)+xScale3.rangeBand()/2;})
            .attr('y',height_svg-padding0)
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('class','p4_3_0');
        svg3.selectAll('.p4_3_1')
            .data(duration)
            .enter()
            .append('rect')
            .attr('x',function(d,i){return xScale3(i);})
            .attr('y',function(d){return yScale3(d);})
            .attr('width',xScale3.rangeBand()/2)
            .attr('height',function(d){return height_svg-yScale3(d)-padding1;})
            .attr('fill',function(d){return color[0];})
            .attr('class','p4_3_1');
        svg3.selectAll('.p4_3_2')
            .data(duration)
            .enter()
            .append('rect')
            .attr('x',function(d,i){return xScale3(i)+xScale3.rangeBand()/2;})
            .attr('y',function(d){return yScale3(d);})
            .attr('width',xScale3.rangeBand()/2)
            .attr('height',function(d){return height_svg-yScale3(d)-padding1;})
            .attr('fill',function(d){return color[1];})
            .attr('class','p4_3_2');
        svg3.selectAll('.p4_3_1data')
            .data(duration)
            .enter()
            .append('text')
            .text(function(d){return d;})
            .attr('x',function(d,i){return xScale3(i)+xScale3.rangeBand()/4;})
            .attr('y',function(d){return yScale3(d)+padding1*0.7;})
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('class','p4_3_1data');  
        svg3.selectAll('.p4_3_2data')
            .data(duration)
            .enter()
            .append('text')
            .text(function(d){return d;})
            .attr('x',function(d,i){return xScale3(i)+xScale3.rangeBand()*3/4;})
            .attr('y',function(d){return yScale3(d)+padding1*0.7;})
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('class','p4_3_2data');
            
        function findindexbyid(id) {
            for(var i=0; i<bars.length; i++) {
                if(bars[i].id == id) return i;
            }
            return -1;
        }
        function findteenofbar(id,siteid,index) {
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_num_of_teenagers_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({siteid:siteid}),
                success: function(data) {
                    if(data.status==0){return;}
                    //console.log(data.res);
                    bars[index].teen = data.res[0]["COUNT( * )"];
                    bars[index].done += 1;
                    update2(id,siteid,bars[index].tran,bars[index].teen);
                },
                error: function(message) {
                    console.log("fail");
                }
            });
        }
        function findtranofbar(id,siteid,index) {
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_record_num_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:id}),
                success: function(data) {
                    bars[index].tran = (data.res[0]).record_num;
                    bars[index].done += 1;
                    findteenofbar(id, siteid, index);
                },
                error: function(message) {
                    console.log("查询失败");
                }
            });
        }

        function update2(id, siteid, tran, teen) {
            //top3
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_province_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:id}),
                success: function(data) {
                    if(data.status==0){return;}
                    //console.log(data.res);
                    var pie = d3.layout.pie().sort(null).value(function(d){return d["nums"];})(data.res);
                    d3.selectAll(".p4_0")
                        .data(pie)
                        .attr('d', function(d){
                            return arc(d);
                        });
                    d3.selectAll(".p4_0t")
                        .data(pie)
                        .attr("transform",function(d){
                            return "translate(" + arc.centroid(d) + ")";
                        })
                        .text(function(d,i){
                            return provinceID[d.data["provinceID"]]+": "+d.data["nums"];
                        });
                },
                error: function(message) {
                    console.log("fail");
                }
            });

            //饼图(trannum = all)
            var drawdata = [teen, tran-teen];
            var pie = d3.layout.pie().sort(null).value(function(d){return d;})(drawdata);
            d3.selectAll(".p4_1")
                .data(pie)
                .attr('d', function(d){
                    return arc(d);
                });
            d3.selectAll(".p4_1t")
                .data(pie)
                .attr("transform",function(d){
                    return "translate(" + arc.centroid(d) + ")";
                })
                .text(function(d,i){
                    return d.data;
                });
            //在这天或者这个时间段上网的人的比例
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_time_of_teenagers_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({siteid:siteid}),
                success: function(data) {
                    if(data.status==0){return;}
                    //console.log(data);
                    var counthour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    var countday = [0,0,0,0,0,0,0];
                    for(var i=0; i<data.res.length; i++) {
                        var starthour = data.res[i].starthour;
                        var startday = data.res[i].startweekday;
                        for(var j=0; j<=data.res[i].lasthour; j++) {
                            counthour[(starthour+j)%24] += 1; 
                        }
                        for(var j=0; j<=data.res[i].lastweekday; j++) {
                            countday[(startday+j)%7] += 1; 
                        }
                    }
                    if(teen != 0) {
                        for(var i=0; i<24; i++)
                            counthour[i] = counthour[i] / teen;
                        for(var i=0; i<7; i++)
                            countday[i] = (countday[i] / teen).toFixed(2);
                    }
                    console.log(counthour);
                    console.log(countday);
                    d3.selectAll(".p4_2_1")
                        .data(counthour)
                        .attr("x1", function(d,i){
                            return xScale2(i);
                        })
                        .attr("y1",function(d,i){
                            return yScale2(counthour[i])
                        })
                        .attr("x2",function(d,i){
                            return xScale2(i+1);
                        })
                        .attr("y2",function(d,i){
                            return yScale2(counthour[i+1]);
                        });
                    svg3.selectAll('.p4_3_1')
                        .data(countday)
                        .attr('y',function(d){return yScale3(d);})
                        .attr('height',function(d){return height_svg-yScale3(d)-padding1;});
                    svg3.selectAll('.p4_3_1data')
                        .data(countday)
                        .text(function(d){return d;})
                        .attr('y',function(d){return yScale3(d)+padding1*0.7-15;});
                },
                error: function(message) {
                    console.log("查询失败");
                }
            });
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:9494/get_time_of_transients_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({siteid:siteid}),
                success: function(data) {
                    if(data.status==0){return;}
                    //console.log(data);
                    var counthour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                    var countday = [0,0,0,0,0,0,0];
                    for(var i=0; i<data.res.length; i++) {
                        var starthour = data.res[i].starthour;
                        var startday = data.res[i].startweekday;
                        for(var j=0; j<=data.res[i].lasthour; j++) {
                            counthour[(starthour+j)%24] += 1; 
                        }
                        for(var j=0; j<=data.res[i].lastweekday; j++) {
                            countday[(startday+j)%7] += 1; 
                        }
                    }
                    if(tran != 0) {
                        for(var i=0; i<24; i++)
                            counthour[i] = counthour[i] / tran;
                        for(var i=0; i<7; i++)
                            countday[i] = (countday[i] / tran).toFixed(2);
                    }
                    console.log(counthour);
                    console.log(countday);
                    d3.selectAll(".p4_2_2")
                        .data(counthour)
                        .attr("x1", function(d,i){
                            return xScale2(i);
                        })
                        .attr("y1",function(d,i){
                            return yScale2(counthour[i])
                        })
                        .attr("x2",function(d,i){
                            return xScale2(i+1);
                        })
                        .attr("y2",function(d,i){
                            return yScale2(counthour[i+1]);
                        });
                    svg3.selectAll('.p4_3_2')
                        .data(countday)
                        .attr('y',function(d){return yScale3(d);})
                        .attr('height',function(d){return height_svg-yScale3(d)-padding1;});

                    svg3.selectAll('.p4_3_2data')
                        .data(countday)
                        .text(function(d){return d;})
                        .attr('y',function(d){return yScale3(d)+padding1*0.7-15;});
                },
                error: function(message) {
                    console.log("查询失败");
                }
            });

            /*d3.json("test.json",function(error,data){
                var pie = d3.layout.pie().sort(null).value(function(d){return d;})(data[1]);
                d3.selectAll(".p4_1")
                    .data(pie)
                    .attr('d', function(d){
                        return arc(d);
                    })
                d3.selectAll(".p4_1t")
                    .data(pie)
                    .attr("transform",function(d){
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .text(function(d){
                        return d.data;
                    });
                
                d3.selectAll(".p4_2_1")
                    .data(data[2][0])
                    .attr("x1", function(d,i){
                        if(i>0) return xScale2(i-1);
                        else return xScale2(0);
                    })
                    .attr("y1",function(d,i){
                        if(i>0) return yScale2(data[2][0][i-1]);
                        else return yScale2(data[2][0][i]);
                    })
                    .attr("x2",function(d,i){
                        return xScale2(i);
                    })
                    .attr("y2",function(d,i){
                        return yScale2(data[2][0][i]);
                    });
                d3.selectAll(".p4_2_2")
                    .data(data[2][1])
                    .attr("x1", function(d,i){
                        if(i>0) return xScale2(i-1);
                        else return xScale2(0);
                    })
                    .attr("y1",function(d,i){
                        if(i>0) return yScale2(data[2][1][i-1]);
                        else return yScale2(data[2][1][i]);
                    })
                    .attr("x2",function(d,i){
                        return xScale2(i);
                    })
                    .attr("y2",function(d,i){
                        return yScale2(data[2][1][i]);
                    });
                svg3.selectAll('.p4_3_1')
                    .data(data[3][0])
                    .attr('y',function(d){return yScale3(d);})
                    .attr('height',function(d){return height_svg-yScale3(d)-padding1;});
                svg3.selectAll('.p4_3_2')
                    .data(data[3][1])
                    .attr('y',function(d){return yScale3(d);})
                    .attr('height',function(d){return height_svg-yScale3(d)-padding1;});
                svg3.selectAll('.p4_3_1data')
                    .data(data[3][0])
                    .text(function(d){return d;})
                    .attr('y',function(d){return yScale3(d)+padding1*0.7;});
                svg3.selectAll('.p4_3_2data')
                    .data(data[3][1])
                    .text(function(d){return d;})
                    .attr('y',function(d){return yScale3(d)+padding1*0.7;});
            });*/
        }

        function update(id){
            var index = findindexbyid(id);
            if(index == -1) return;
            var id = bars[index].id;
            var siteid = bars[index].siteid;
            if((bars[index].done) != 2){
                findtranofbar(id, siteid, index);
                return;
            }
            var tran = bars[index].tran;
            var teen = bars[index].teen;
            update2(id, siteid, tran, teen);
        }
		
		popview.onMessage = function(message, data, from){
			if(message == "bar_dblclicked"){
				if(from == Barmap ){
                    $("#p4_pop").show();
                    console.log(data);
					update(data);
				}
			}
		};

		
		Observer.addView(popview);
		return popview;
	}
	
	
	window["Popview"] = Popview;
})();