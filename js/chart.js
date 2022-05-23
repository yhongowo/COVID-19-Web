var dates = [];
var domestic_series = [];
var global_series = [];

$.ajax({
    // url: "http://111.231.75.86:8000/api/countries/CHN/daily/",
    url:"../static/statistic.json",
    data: {},
    type: "GET",
    success: function (data) {
        //每天更新20条以上的数据，在这里进行对数据进行去重
        for(index=0;index<=data.length;index+=20){
            //插入并保留字符串的前10位数 "2020-04-30T01:12:33Z" ->"2020-04-30"
            dates.push(data[index].modifyTime.substr(0,10));
            domestic_series.push(data[index].domesticStatistics.confirmedCount);
            global_series.push(data[index].globalStatistics.confirmedCount);
            //去重
            if(dates[dates.length-2] && dates[dates.length-1] && dates[dates.length-2] == dates[dates.length-1]){
                dates.pop();
                domestic_series.pop();
                global_series.pop();
            }
        }

        dates.reverse();
        domestic_series.reverse();
        global_series.reverse();

        console.log(dates);
        console.log(domestic_series);

        var domestic_chart = echarts.init(document.getElementById("domestic-charts"));
        domestic_chart.setOption({
            title: {
                text: "累计感染",
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend:{
                data:['确诊人数']
            },
            grid:{
                left:'14%',
                right:'10%'
            },
            xAxis: {
                type: "category",
                data: dates,
                axisPointer: {

                    label:{
                        show: true
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: "人数",
            },
            dataZoom: [{
                type: "inside",
            },{
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    type: "line",
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    smooth: "true",
                    data: domestic_series,
                    sampling: 'average',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    hoverAnimation: "true"
                },
            ],
        });

        var global_chart = echarts.init(document.getElementById("global-charts"));
        global_chart.setOption({
            title: {
                text: "累计感染",
            },
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend:{
                data:['确诊人数']
            },
            grid:{
                left:'14%',
                right:'10%'
            },
            xAxis: {
                type: "category",
                data: dates,
                axisPointer: {

                    label:{
                        show: true
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: "人数",
            },
            dataZoom: [{
                type: "inside",
            },{
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    type: "line",
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    smooth: "true",
                    data: domestic_series,
                    sampling: 'average',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    hoverAnimation: "true"
                },
            ],
        });

        window.addEventListener("resize", function(){
            domestic_chart.resize();
            global_chart.resize();
        })

        // 当Echarts绘制图表计算宽度的时候，由于echart在tab页内，父容器display: none，所以无法获取到width，
        // 而 parseInt(stl.width, 10)) 将width: 100%;转为100，所以计算出的图表宽度为100px，此时手动resize可以解决问题
        $("#pills-global-tab").click(function () { 
            setInterval(global_chart.resize,100)                
        });
        $("pills-domestic-tab").click(function (e) { 
            setInterval(domestic_chart.resize,100)   
        });
    },
});


// 显示标题，图例和空的坐标轴
