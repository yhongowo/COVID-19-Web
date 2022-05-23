$.getJSON("DXYOverall.json",
    function (data, textStatus, jqXHR) {
        
    }
);

$.ajax({
    type: "GET",
    url: "DXYOverall.json",
    data: {},
    dataType: "json",
    success: function (response) {
        $.each(response, function (index, item) {
            if(item[infectSource] != undefined)
                delete item[infectSource];
            if(item[passWay] != undefined)
                delete item[passWay];
            if(item[dailyPic]!= undefined)
                delete item[dailyPic];
            if(item[dailyPic]!= undefined)
                delete item[dailyPics];
            if(item[summary]!= undefined)
                delete item[summary];
            if(item[countRemark]!= undefined)
                delete item[countRemark];
            if(item[virus]!= undefined)
                delete item[virus];
            if(item[remark1]!= undefined)
                delete item[remark1];
            if(item[remark2]!= undefined)
                delete item[remark2];
            if(item[remark3]!= undefined)
                delete item[remark3];
            if(item[remark4]!= undefined)
                delete item[remark4];
            if(item[remark5]!= undefined)
                delete item[remark5];
            if(item[note1]!= undefined)
                delete item[note1];
            if(item[note2]!= undefined)
                delete item[note2];
            if(item[note3]!= undefined)
                delete item[note3];
            if(item[generalRemark]!= undefined)
                delete item[generalRemark];
            if(item[abroadRemark]!= undefined)
                delete item[abroadRemark];
            if(item[marquee]!= undefined)
                delete item[marquee];
            if(item[quanguoTrendChart]!= undefined)
                delete item[quanguoTrendChart];
            if(item[hbFeiHbTrendChart]!= undefined)
                delete item[hbFeiHbTrendChart];
            if(item[foreignTrendChart]!= undefined)
                delete item[foreignTrendChart];
            if(item[importantForeignTrendChart]!= undefined)
                delete item[importantForeignTrendChart];
            if(item[foreignTrendChartGlobal]!= undefined)
                delete item[foreignTrendChartGlobal];
            if(item[importantForeignTrendChartGlobal]!= undefined)
                delete item[importantForeignTrendChartGlobal];
            if(item[globalOtherTrendChartData]!= undefined)
                delete item[globalOtherTrendChartData];
            if(item[highDangerCount]!= undefined)
                delete item[highDangerCount];
            if(item[midDangerCount]!= undefined)
                delete item[midDangerCount];
        });
        localStorage.setItem('myStorage', JSON.stringify(data));
    }
});
