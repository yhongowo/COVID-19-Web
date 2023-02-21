var domestic_yesterday_Incr = [];
var global_series = [];
var domestic_current_confirmed = [];
var global_series2 = [];
var domestic_chart;
var global_chart;
var domestic_chart_map;
var domestic_map = [];


$(document).ready(function () {
  //get overall data
  $.getJSON(
    "http://175.178.174.246:12560/api/overall",
    function (data, status) {
      //修改statistics_domestic里card的数据
      $("#card-domestic-01 p").text(data.currentConfirmedIncr);
      $("#card-domestic-02 p").text(data.currentConfirmedCount);
      $("#card-domestic-03 p").text(data.confirmedCount);
      $("#card-domestic-11 p").text(data.suspectedCount);
      $("#card-domestic-12 p").text(data.curedCount);
      $("#card-domestic-13 p").text(data.deadCount);
      //修改statistics_global里card的数据
      $("#card-global-01 p").text(data.foreignStatistics.currentConfirmedIncr);
      $("#card-global-02 p").text(data.foreignStatistics.currentConfirmedCount);
      $("#card-global-03 p").text(data.foreignStatistics.confirmedCount);
      $("#card-global-11 p").text(data.foreignStatistics.deadIncr);
      $("#card-global-12 p").text(data.foreignStatistics.curedCount);
      $("#card-global-13 p").text(data.foreignStatistics.deadCount);
    }
  );

  $.getJSON(
    "http://175.178.174.246:12560/api/timeline",
    function (data, status) {
      for (let i = 0; i < data.length; i++) {
        appendNewsCard(
          data[i].title,
          data[i].summary,
          data[i].sourceUrl,
          data[i].pubDateStr
        );
      }
    }
  );

  //get province's data
  $.getJSON(
    "http://175.178.174.246:12560/api/area/province",
    function (data, status) {
      data.sort(sortByProperty("currentConfirmedCount"));
      for (let i = 0; i < data.length; i++) {
        let row = data[i];
        let $tr = $("<tr></tr>");
        let provinceName = $("<th>" + row.provinceName + "</th>");
        let currentConfirmedCount = $(
          "<td>" + row.currentConfirmedCount + "</td>"
        );
        let suspectedCount = $("<td>" + row.suspectedCount + "</td>");
        let confirmedCount = $("<td>" + row.confirmedCount + "</td>");
        $tr
          .append(provinceName)
          .append(currentConfirmedCount)
          .append(suspectedCount)
          .append(confirmedCount);
        $("#domestic-table tbody").append($tr);
      }
      for (let i = 0; i < data.length; i++) {
        var temp = {
          "name":data[i].provinceShortName,
          "value":data[i].currentConfirmedCount
        }
        domestic_map.push(temp)  
      }
      initDomesticMap(domestic_map)
    }
  );
  //get international data
  $.getJSON(
    "http://175.178.174.246:12560/api/area/abroad",
    function (data, status) {
      //append data to tbody
      data.sort(sortByProperty("currentConfirmedCount"));
      for (let i = 0; i < data.length; i++) {
        //创建元素，装填数据
        let row = data[i];
        let $tr = $("<tr></tr>");
        let countryName = $("<th>" + row.provinceName + "</th>");
        let currentConfirmedCount = $(
          "<td>" + row.currentConfirmedCount + "</td>"
        );
        let deadRate = $("<td>" + row.deadRate + "</td>");
        let confirmedCount = $("<td>" + row.confirmedCount + "</td>");
        $tr
          .append(countryName)
          .append(currentConfirmedCount)
          .append(confirmedCount)
          .append(deadRate);
        //将元素插入html
        $("#global-table tbody").append($tr);
      }
    }
  );
  //get chart data
  $.getJSON(
    "http://175.178.174.246:12560/api/overall/list",
    function (data, status) {
      initDomesticChart(data);
      initGlobalChart(data);
    }
  );

  //将新闻数据装填到card标签中，再插入html
  function appendNewsCard(title, summary, sourceUrl, pubDateStr) {
    //结构：
    // <a class="news-a" href="#">
    //     <div class="card shadow-sm p-3 mb-3" >
    //     <div class="card-body">
    //       <h5 class="card-title">Special title treatment</h5>
    //       <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    //       <p class="card-text text-start">With supporting text below as a natural lead-in to additional content.</p>
    //     </div>
    //   </div>
    // </a>

    //变量命名规则：let 'labelname'_'classname'
    //装填数据
    let h5_card_title = $(
      '<h5 class="card-title" style="color: blue">' + title + "</h5>"
    );
    let h6_card_subtitle = $(
      '<h6 class="card-subtitle mb-2 text-muted">' + pubDateStr + "</h6>"
    );
    let p_card_text = $('<p class="card-text text-start">' + summary + "</p>");
    //建立dom元素
    let div_card_body = $('<div class="card-body"></div>');
    let div_card = $('<div class="card shadow p-3 mb-3" ></div>');
    let a_news = $('<a class="news-a" href=' + sourceUrl + "></a>");
    //dom元素嵌套
    div_card_body
      .append(h5_card_title)
      .append(h6_card_subtitle)
      .append(p_card_text);
    div_card.append(div_card_body);
    a_news.append(div_card);
    //插入html
    $("#news").append(a_news);
  }
  //整理数据，初始化图表
  function initDomesticChart(data) {
    var dates = [];
    for (var i = 0; i < data.length; i += 1) {
      dates.push(formatDate(data[i].updateTime));
      domestic_yesterday_Incr.push(data[i].yesterdayConfirmedCountIncr);
      domestic_current_confirmed.push(data[i].currentConfirmedCount);
    }

    var domestic_chart = echarts.init(
      document.getElementById("domestic-charts")
    );
    domestic_chart.setOption({
      title: {},
      tooltip: {
        trigger: "axis",
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          var obj = { top: 60 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        },
      },
      legend: {
        orient:'vertical',
        right:12,
      },
      grid: {
        left: "3%",
        right: "3%",
        top: "5%",
        bottom: "17%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisPointer: {
          label: {
            show: true,
          },
        },
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        name: "累计感染人数",
        axisLabel: {
          fontSize: 10,
          inside: true,
        },
      },
      dataZoom: [
        {
          type: "inside",
        },
        {
          start: 0,
          end: 10,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "80%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 3,
            shadowColor: "rgba(0, 0, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
      series: [
        {
          type: "line",
          name: "昨日新增",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          smooth: "true",
          data: domestic_yesterday_Incr,
          sampling: "average",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)",
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)",
              },
            ]),
          },
          hoverAnimation: "true",
        },
        {
          type: "line",
          name: "现有感染",
          smooth: "true",
          data: domestic_current_confirmed,
          stack: "Total",
          sampling: "average",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
        },
      ],
    });

    // 当Echarts绘制图表计算宽度的时候，由于echart在tab页内，父容器display: none，所以无法获取到width，
    // 而 parseInt(stl.width, 10)) 将width: 100%;转为100，所以计算出的图表宽度为100px，此时手动resize可以解决问题
    $("#pills-domestic-tab").click(function (e) {
      setInterval(domestic_chart.resize, 200);
    });
  }
  function initDomesticMap(data) {
    domestic_chart_map = echarts.init(document.getElementById('domestic-charts-map'));
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '中国新冠疫情实时数据地图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['中国新冠疫情实时数据地图']
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 10000, max: 1000000, label: '确诊大于等于10000人', color: '#372a28' },
          { min: 5000, max: 9999, label: '确诊5000-9999人', color: '#4e160f' },
          { min: 1000, max: 4999, label: '确诊1000-4999人', color: '#974236' },
          { min: 100, max: 999, label: '确诊100-999人', color: '#ee7263' },
          { min: 1, max: 99, label: '确诊1-99人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      roamController: {
        show: true,
        left: 'right',
        mapTypeControl: {
          'china': true
        }
      },
      series: [
        {
          name: '确诊数',
          type: 'map',
          mapType: 'china',
          roam: false,
          label: {
            show: true,
            color: 'rgb(249, 249, 249)'
          },
          data: domestic_map
        }
      ]
    };
    domestic_chart_map.setOption(option);
  }
  function initGlobalChart(data) {
    var dates = [];
    for (var i = 0; i < data.length; i++) {
      dates.push(formatDate(data[i].updateTime));
      global_series.push(data[i].globalStatistics.confirmedIncr);
      global_series2.push(data[i].currentConfirmedCount);
    }
    var global_chart = echarts.init(document.getElementById("global-charts"));
    global_chart.setOption({
      title: {},
      tooltip: {
        trigger: "axis",
        position: function (pos, params, dom, rect, size) {
          // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
          var obj = { top: 60 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
          return obj;
        },
      },
      legend: {
        orient:'vertical',
        right:12,
      },
      grid: {
        left: "2%",
        right: "2%",
        top: "5%",
        bottom: "17%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisPointer: {
          label: {
            show: true,
          },
        },
        axisLabel: {
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        name: "累计感染人数",
        axisLabel: {
          fontSize: 10,
          inside: true,
        },
      },
      dataZoom: [
        {
          type: "inside",
        },
        {
          start: 0,
          end: 10,
          handleIcon:
            "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "80%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 3,
            shadowColor: "rgba(0, 0, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
        },
      ],
      series: [
        {
          type: "line",
          name: "累计感染",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          smooth: "true",
          data: global_series,
          sampling: "average",
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 158, 68)",
              },
              {
                offset: 1,
                color: "rgb(255, 70, 131)",
              },
            ]),
          },
          hoverAnimation: "true",
        },
        {
          type: "line",
          name: "现有感染",
          stack: "Total",
          sampling: "average",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: global_series2,
          hoverAnimation: "true",
        },
      ],
    });

    window.addEventListener("resize", () =>{
      if(domestic_chart){
        domestic_chart.resize();
      }
      if(domestic_chart_map){
        domestic_chart_map.resize();
      }
      if(global_chart) {
        global_chart.resize();
      }
    });

    $("#pills-global-tab").click(function () {
      setInterval(global_chart.resize, 200);
    });
  }
});


function formatDate(timestamp) {
  let date = new Date(timestamp);
  let year = date.getFullYear();
  let month = date.getMonth() +1;
  let day = date.getDate();
  return year + "-" + month + "-" + day;
}
// 降序排序
function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;
    else return 0;
  };
}
