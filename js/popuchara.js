


(function(){
    function Popuchara(Observer){
        var popuchara={};
        /*
        code here
        */
        var width = 600;
        var height = 450;
        var svg = d3.select("#china_map").append("svg")
               .attr("width",width)
               .attr("height",height);

        var provinces = [];

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
            function setavgtime(time) {
                this.avgtime = time;
            }
            function equal(namestr) {
                return (namestr == this.name);
            }
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
                DrawRect(min, max);
                DrawChinaMap();
            });
        });
        
        
        function DrawRect(min, max) {
            var defs = svg.append("defs");  
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

            var colorRect = svg.append("rect")  
                .attr("x", 30)  
                .attr("y", 380)  
                .attr("width", 100)  
                .attr("height", 20)  
                .style("fill","url(#" + linearGradient.attr("id") + ")");
            var minValueText = svg.append("text")
                    .attr("class","text")
                    .attr("x", 25)
                    .attr("y", 410)
                    .attr("fill", "white")
                    .attr("font-size", 12)
                    .text(""+min);

            var maxValueText = svg.append("text")
                    .attr("class","text")
                    .attr("x", 120)
                    .attr("y", 410)
                    .attr("fill", "white")
                    .attr("font-size", 12)
                    .text(""+max);
        }


        function DrawChinaMap() {
            var projection = d3.geo.mercator()
                .center([107, 31])
                .scale(450)
                .translate([width/2, height/2+60]);
            var path = d3.geo.path()  
                .projection(projection);
            var selectname = "";

            d3.json("china.json", function(error, root) {
                if (error) 
                    return console.error(error);
                svg.selectAll("path")
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

                        var tips = svg.append("g")
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
                        else
                            d3.select(this).attr("fill", "#f6b26b")
                        d3.selectAll('.tips').remove();
                    })
                    .on("click", function(d,i){
                        if(d3.select(this).attr("select") == 0) {
                            var index = d3.select(this).attr("provinceindex");
                            if(index == -1) {
                                alert("there is no data for this province");
                                return;
                            }
                            if(selectname!="") {
                                d3.select("#" + selectname).attr("fill", d3.select("#" + selectname).attr("color"));
                                d3.select("#" + selectname).attr("select", 0);
                            }
                            d3.select(this).attr("fill", "#f6b26b");
                            d3.select(this).attr("select", 1);
                            selectname = d.properties.name;
                            
                        } else {
                            d3.select(this).attr("select", 0);
                            d3.select(this).attr("fill", d3.select(this).attr("color"));
                            selectname = "";
                        }
                        SendMessage(selectname);
                    })
            });
    
        }

        function SendMessage(name) {
            var Senddata = [];
            var index = checkhasdata(name);
            if(index != -1) {
                var id = provinces[index].code;
                $.ajax({
                    type: "POST",
                    url: "http://182.254.134.126:9494/get_personnums_distributed_by_provinceid",
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    data:JSON.stringify({provinceID:id}),
                    success: function(data) {
                        Senddata = data.res;
                        //console.log(Senddata);
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
                    console.log(data);
                }
            }
        };

        
        Observer.addView(popuchara);
        return popuchara;
    }
    
    
    window["Popuchara"] = Popuchara;
})();