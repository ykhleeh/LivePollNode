define([
    "jquery",
  "underscore",
  "backbone"

], function ($, underscore, Backbone) {

    var ResultQcmView = Backbone.View.extend({
        el: "",
        index: 1,
        initialize: function () {
            this.render();
        },
        render: function () {

            var data = JSON.parse(window.livePoll.chartData);
            $("#chart_div").highcharts({
                chart: {
                    type: "column"
                },
                title: {
                    text: $("#Title").val() + " : " + $("#Question").val()
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Pourcentage(%)'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: ' <b>{point.drilldown}{point.y:.1f} %</b>'
                },
                series: [{
                    name: "",
                    colorByPoint: true,
                    data: data

                }]
            });



        },
        events: {
            "click #noAnswer": "noAnswer"
        },
        noAnswer: function () {
            if (confirm("Are you sure??")) {
                $.ajax({
                    url: "/api/FreeAnswerPoll/saveNoAnswer/" + $("#PollId").val(),
                    method: "POST"
                }).success(function () {
                    window.location.href = "/";
                });
            }

        }
    });

    return ResultQcmView;

});