


(function(){
	function Popview(Observer){
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
            .attr("font-family", "Courier New")
            .attr("fill", "white")
            .attr("font-size", "20px");
        svg0.append('circle')
            .attr('cx',160)
            .attr('cy',20)
            .attr('r',10)
            .attr('fill',color0[1]);
        svg0.append('text')
            .attr('x',180)
            .attr('y',25)
            .text('成年人')
            .attr("font-family", "Courier New")
            .attr("fill", "white")
            .attr("font-size", "20px");
        svg0.append('circle')
            .attr('cx',275)
            .attr('cy',20)
            .attr('r',10)
            .attr('fill',color[1]);
        svg0.append('text')
            .attr('x',295)
            .attr('y',25)
            .text('流动人口')
            .attr("font-family", "Courier New")
            .attr("fill", "white")
            .attr("font-size", "20px");
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
        var yScale2 = d3.scale.linear().domain([0,100]).range([height_svg-padding1,padding1]);
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
        var yScale3 = d3.scale.linear().domain([d3.min(duration),d3.max(duration)]).range([height_svg-padding1*2,0]);
        svg3.selectAll('.p4_3_0')
            .data(duration)
            .enter()
            .append('text')
            .text(function(d){return d;})
            .attr('x',function(d,i){return xScale3(i)+xScale3.rangeBand()/2;})
            .attr('y',height_svg-padding0)
            .attr("font-family", "Courier New")
            .attr("font-size", "20px")
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
            .attr("font-family", "Courier New")
            .attr("font-size", "11px")
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
            .attr("font-family", "Courier New")
            .attr("font-size", "11px")
            .attr("fill", "white")
            .attr("text-anchor", "middle")
            .attr('class','p4_3_2data');
            
            
        function update(id){
            //top3TODO
            $.ajax({
                type: "POST",
                url: "http://182.254.134.126:9494/get_province_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:333}),
                success: function(data) {
                    console.log(data.res);
                    if(data.status==0){return;}
                },
                error: function(message) {
                    console.log("fail");
                }
            });
            //饼图TODO
            $.ajax({
                type: "POST",
                url: "http://182.254.134.126:9494/get_province_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:333}),
                success: function(data) {
                    console.log(data.res);
                    if(data.status==0){return;}
                },
                error: function(message) {
                    console.log("fail");
                }
            });
            //折线图TODO
            $.ajax({
                type: "POST",
                url: "http://182.254.134.126:9494/get_province_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:333}),
                success: function(data) {
                    console.log(data.res);
                    if(data.status==0){return;}
                },
                error: function(message) {
                    console.log("fail");
                }
            });
            //柱状图TODO
            $.ajax({
                type: "POST",
                url: "http://182.254.134.126:9494/get_province_distributed_by_barid",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({id:333}),
                success: function(data) {
                    console.log(data.res);
                    if(data.status==0){return;}
                },
                error: function(message) {
                    console.log("fail");
                }
            }); 
            d3.json("test.json",function(error,data){
                var pie = d3.layout.pie().sort(null).value(function(d){return d;})(data[0]);
                d3.selectAll(".p4_0")
                    .data(pie)
                    .attr('d', function(d){
                        return arc(d);
                    })
                d3.selectAll(".p4_0t")
                    .data(pie)
                    .attr("transform",function(d){
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .text(function(d){
                        return d.data;
                    });
                var pie = d3.layout.pie().sort(null).value(function(d){return d;})(data[1]);
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
            });
        }
		
		popview.onMessage = function(message, data, from){
			if(message == "bar_dblclicked"){
				if(from == Barmap ){
                    $("#p4_pop").show();
					update(data);
				}
			}
		};

		
		Observer.addView(popview);
		return popview;
	}
	
	
	window["Popview"] = Popview;
})();