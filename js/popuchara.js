


(function(){
    function Popuchara(Observer){
        var popuchara={};
        /*
        code here
        */
        var width1 = 500;
        var width2 = 500;
        var height1 = 330;
        var height2 = 130;
        var padding2 = {top:10,right:10,bottom:30,left:50};

        var svg1 = d3.select("#china_map").append("svg")
                 .attr("width",width1)
                 .attr("height",height1);
        var svg2 = d3.select("#province_line").append("svg")
                 .attr("width",width2)
                 .attr("height",height2);

        var provinces = [];

        var color = ["#FFDDAA", "#FFBB66", "#FFAA33", "#FF8800", "#CC6600", "#FF5511"];
        var selectData = [];
        for(var i=0; i<6; i++)
            selectData.push(-1);

        var colorlinear;
        var a = d3.rgb(199,223,251);    //less  
        var b = d3.rgb(91,101,114);    //more
        var compute = d3.interpolate(a,b);


        function province(name, code, num) {
            this.name = name;
            this.code = code;
            this.num = num;
            this.setavgtime = setavgtime;
            this.equal = equal;
            this.settimeperhour = settimeperhour;
            this.timeperhour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            function setavgtime(time) {
                this.avgtime = time;
            }
            function equal(namestr) {
                return (namestr == this.name);
            }
            function settimeperhour(data) {
                this.timeperhour = data;
            }
        }
  
        function choosecolor() {
            for(var i=0; i<selectData.length; ++i) {
                if(selectData[i] == -1)
                    return i;
            }
            alert("You can choose at most 6 colors");
            return -1;
        }

        function checkhasdata(str) {
            for(var i=0; i<provinces.length; i++)
                if(provinces[i].equal(str))
                    return i;
            return -1;
        }

        d3.csv("data/province_num.csv", function(error, csvdata) {
            if(error) console.log(error);
            for(var i=0;i<csvdata.length;i++) {
                if(csvdata[i]["name"] == "") continue;
                var p = new province(csvdata[i]["name"], csvdata[i]["province"], csvdata[i]["count"]);
                provinces.push(p);
            }
            d3.csv("data/province_avg_time.csv", function(error, timedata) {
                if(error) console.log(error);
                var allavgtime = [];
                for(var i=0; i<timedata.length; i++) {
                    var j;
                    for(j=0; j<provinces.length; j++)
                        if(provinces[j].code == timedata[i]["province"]) break;
                    if(j<provinces.length) {
                        var time = parseFloat(timedata[i]["avg(T1.DURATION)"]);
                        time = time.toFixed(2);
                        provinces[j].setavgtime(time);
                        allavgtime.push(time);
                    }
                }
                var max = Math.max.apply(null, allavgtime);
                var min = Math.min.apply(null, allavgtime);
                colorlinear = d3.scale.linear()  
                                .domain([min,max])
                                .range([0,1]);
                //console.log(allavgtime);
                

                //this data is just for test
                /*for(var i=0; i<provinces.length; i++)
                    provinces[i].settimeperhour([0,10,20,10,50,60,0,10,20,10,50,60,0,10,20,10,50,60,0,10,20,10,50,60]);*/
                //and should replaced by the following(if the columns are province,0,1,2,...23)
                d3.csv("data/province_time.csv", function(error, timedata2) {
                    if(error) console.log(error);
                    for(var i=0; i<timedata2.length; i++) {
                        var j;
                        for(j=0; j<provinces.length; j++)
                            if(provinces[j].code == timedata2[i]["province"]) break;
                        if(j<provinces.length) {
                            var timeperhour = [];
                            for(var k=0; k<24; k++)
                                timeperhour.push(timedata2[i][""+k] / provinces[j].num);
                            //console.log(provinces[j].code);
                            //console.log(timeperhour);
                            provinces[j].settimeperhour(timeperhour);
                        }
                    }
                    console.log(provinces);
                }); 
                

                DrawRect(min, max);
                DrawChinaMap();
                DrawProvinceLine()
            });
        });
        
        
        function DrawRect(min, max) {
            var defs = svg1.append("defs");  
            var linearGradient = defs.append("linearGradient")  
                        .attr("id","linearColor")  
                        .attr("x1","0%")  
                        .attr("y1","0%")  
                        .attr("x2","100%")  
                        .attr("y2","0%");  
  
            var stop1 = linearGradient.append("stop")  
                .attr("offset","0%")  
                .style("stop-color",a.toString());  
  
            var stop2 = linearGradient.append("stop")  
                .attr("offset","100%")  
                .style("stop-color",b.toString());

            var colorRect = svg1.append("rect")  
                .attr("x", 30)  
                .attr("y", 250)  
                .attr("width", 100)  
                .attr("height", 20)  
                .style("fill","url(#" + linearGradient.attr("id") + ")");
            var minValueText = svg1.append("text")
                    .attr("class","text")
                    .attr("x", 25)
                    .attr("y", 240)
                    .attr("fill", "white")
                    .attr("font-size", 12)
                    .text(""+min);

            var maxValueText = svg1.append("text")
                    .attr("class","text")
                    .attr("x", 120)
                    .attr("y", 240)
                    .attr("fill", "white")
                    .attr("font-size", 12)
                    .text(""+max);
        }


        function DrawChinaMap() {
            var projection = d3.geo.mercator()
                .center([107, 31])
                .scale(300)
                .translate([width1/2+20, height1/2+40]);
            var path = d3.geo.path()  
                .projection(projection);
            var selectname = "";

            d3.json("china.json", function(error, root) {
                if (error) 
                    return console.error(error);
                svg1.selectAll("path")
                    .data( root.features )
                    .enter()
                    .append("path")
                    .attr("stroke","#111")
                    .attr("stroke-width",0.5)
                    .attr("color", function(d,i) {
                        var index = checkhasdata(d.properties.name);
                        if(index == -1) return "#323c48";
                        else {
                            return compute(colorlinear(provinces[index].avgtime));
                        }
                    })
                    .attr("id", function(d, i) {
                        return d.properties.name;
                    })
                    .attr("fill", function(d, i) {
                        return d3.select(this).attr("color");
                    })
                    .attr("d", path )
                    .attr("select", 0)
                    .attr("provinceindex", function(d,i) {
                        return checkhasdata(d.properties.name);
                    })
                    .on("mouseover",function(d,i){
                        var mousePos = d3.mouse(d3.select("#china_map").node());
                        d3.select(this).attr("fill","#2a333d");

                        var tips = svg1.append("g")
                                .attr("class", "tips");
                        var tipText = tips.append("text")
                                .attr("class", "tips")
                                .attr("x", mousePos[0]+10)
                                .attr("y", mousePos[1]+10)
                                .attr("fill", "white")
                                .attr("font-size", 12);
                        tipText.append("tspan")
                                .attr("x",tipText.attr("x"))
                                .attr("dy","1em")
                                .text(d.properties.name);
                        var population = "population:";
                        var avgTimeOnLine = "avgTimeOnLine:";
                        if(d3.select(this).attr("provinceindex") == -1) {
                            population += "0";
                            avgTimeOnLine += "0";
                        }
                        else {
                            population += provinces[d3.select(this).attr("provinceindex")].num;
                            avgTimeOnLine += provinces[d3.select(this).attr("provinceindex")].avgtime;
                        }

                        tipText.append("tspan")
                                .attr("x",tipText.attr("x"))
                                .attr("dy","1em")
                                .text(population);
                        tipText.append("tspan")
                                .attr("x",tipText.attr("x"))
                                .attr("dy","1em")
                                .text(avgTimeOnLine);
                    })
                    .on("mouseout",function(d,i){
                        if(d3.select(this).attr("select") == 0) {
                            d3.select(this).attr("fill", d3.select(this).attr("color"));
                        }
                        else {
                            var co = d3.select(this).attr("select")-1;
                            d3.select(this).attr("fill", color[co]);
                        }
                        d3.selectAll('.tips').remove();
                    })
                    .on("click", function(d,i){
                        if(d3.select(this).attr("select") == 0) {
                            var index = d3.select(this).attr("provinceindex");
                            if(index == -1) {
                                alert("there is no data for this province");
                                return;
                            }
                            var ci = choosecolor();
                            if(ci != -1) {
                                d3.select(this).attr("select", ci+1);
                                d3.select(this).attr("fill", color[ci]);
                                selectData[ci] = index;
                            }
                            selectname = d.properties.name;
                        } else {
                            d3.select(this).attr("select", 0);
                            d3.select(this).attr("fill", d3.select(this).attr("color"));
                            selectname = "";
                            var index = d3.select(this).attr("provinceindex");
                            for(var j=0; j<selectData.length; j++) {
                                if(selectData[j] == index)
                                    selectData[j] = -1;
                            }
                        }
                        DrawProvinceLine();
                        //SendMessage(selectname);
                    })
            });
    
        }

        function DrawProvinceLine() {
            console.log(selectData);
            d3.select("#province_line").select("#yaxis").remove();
            d3.select("#province_line").select("#xaxis").remove();
            d3.select("#province_line").selectAll("circle").remove();
            d3.select("#province_line").selectAll("path").remove();
            d3.select("#province_line").selectAll("text").remove();
  
            var DrawData = [];
            var DrawColor = [];
            var DrawProvince = [];

            for (var i=0; i<selectData.length; i++) {
                if(selectData[i] != -1) {
                    DrawData.push(provinces[selectData[i]].timeperhour);
                    DrawColor.push(color[i]);
                    DrawProvince.push(provinces[selectData[i]].name);
                }
            }

            var mindataset = [];
            var maxdataset = [];
            for(var i=0; i<DrawData.length; ++i) {
                mindataset.push(Math.min.apply(null, DrawData[i]));
                maxdataset.push(Math.max.apply(null, DrawData[i]));
            }

            var maxdata = Math.max.apply(null, maxdataset);
            var mindata = Math.min.apply(null, mindataset);


            var xScale = d3.scale.linear()
                    .domain([0,23])
                    .range([padding2.left,width2-padding2.right]);
            var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")
                    .ticks(24)
            var xBar = svg2.append("g")
                    .attr("id", "xaxis")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (height2 - padding2.bottom) + ")")
                    .call(xAxis);
            var yScale = d3.scale.linear()
                    .domain([mindata,maxdata])
                    .range([height2-padding2.bottom,padding2.top]);
            var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(6);
            var yBar = svg2.append("g")
                    .attr("id","yaxis")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding2.left + ",0)")
                    .call(yAxis);

            var allcircle = [];
            var paths = [];

            for(var j=0; j<DrawData.length; j++) {
                var data = DrawData[j];
                var colorname = DrawColor[j];
                var proname = DrawProvince[j];

                var circleLoc = [];
                for(var k=0; k<24; ++k) {
                    circleLoc.push([xScale(k),yScale(parseFloat(data[k]))]);
                    allcircle.push([xScale(k),yScale(parseFloat(data[k]))]);
                }

                var linePath = d3.svg.line();
                paths.push(linePath(circleLoc));
                //console.log(paths);
                svg2.append("path")
                    .attr("d",linePath(circleLoc))
                    .attr("stroke",colorname)
                    .attr("stroke-width","1px")
                    .attr("fill","none")
                    .on("mouseover", function(d, i) {
                        var mousePos = d3.mouse(d3.select("#province_line").node());
                        var tips = svg2.append("g")
                                    .attr("class", "tips");
                        var tipText = tips.append("text")
                                    .attr("class", "tips")
                                    .text(DrawProvince[j])
                                    .attr("x", mousePos[0] + 10)
                                    .attr("y", mousePos[1] + 10)
                                    .attr("fill", "white")
                                    .attr("font-size", 12);
                    })
                    .on("mouseout", function(d, i) {
                        d3.selectAll(".tips").remove();
                    });
            }

            svg2.selectAll("circle")
                    .data(allcircle)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d, i) {
                        return d[0];
                    })
                    .attr("cy", function(d, i) {
                        return d[1];
                    })
                    .attr("r",3)
                    .attr("fill", function(d,i) {
                        var cindex = parseInt(i / 24);
                        return DrawColor[cindex];
                    })
                    .on("mouseover", function(d, i) {
                        str = "" + DrawData[parseInt(i / 24)][i-parseInt(i / 24)*24].toFixed(2);
                        var tx = parseFloat(d3.select(this).attr("cx"));
                        var ty = parseFloat(d3.select(this).attr("cy"));
                        var tips = svg2.append("g")
                                      .attr("class", "tips");
                        var tipText = tips.append("text")
                                      .attr("class", "tips")
                                      .text(str)
                                      .attr("x", tx + 10)
                                      .attr("y", ty)
                                      .attr("fill", "white")
                                      .attr("font-size", 12);
                    })
                    .on("mouseout", function(d, i) {
                        d3.selectAll(".tips").remove();
                    });
        }

        function SendMessage(name) {
            var Senddata = [];
            var index = checkhasdata(name);
            if(index != -1) {
                var id = provinces[index].code;
                $.ajax({
                    type: "POST",
                    url: "http://127.0.0.1:9494/get_personnums_distributed_by_provinceid",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data:JSON.stringify({provinceID:id}),
                    success: function(data) {
                        Senddata = data.res;
                        console.log(Senddata);
                        Observer.fireEvent("problem2",Senddata,Popuchara);
                    },
                    error: function(message) {
                        alert("查询失败");
                    }
                });
            } else {
                //console.log(Senddata);
                Observer.fireEvent("problem2",Senddata,Popuchara);
            }
        }
        
        
        popuchara.onMessage = function(message, data, from){
            if(message == "bar_selected"){
                if(from == Barmap ){
                    //console.log(data);
                }
            }
        };

        
        Observer.addView(popuchara);
        return popuchara;
    }
    
    
    window["Popuchara"] = Popuchara;
})();