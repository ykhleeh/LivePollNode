var require = {
    baseUrl: "/Scripts/app",
    paths: {
        jquery: "../lib/jquery-1.10.2",
        backbone: "../lib/backbone",
        "jquery.validate": "../lib/jquery.validate.min",
        underscore: "../lib/underscore",
        bootstrap: "../lib/bootstrap",
        "jquery-steps": "../lib/jquery.steps.min",
        bloodhound: "../lib/bloodhound",
        typeahead: "../lib/typeahead.jquery",
        moment: "../lib/moment",
        datetimepicker: "../lib/bootstrap-datetimepicker.min",
        tagsinput: "../lib/bootstrap-tagsinput.min",
        "jquery-ui": "../lib/jquery-ui-1.11.4",
        listjs: "../lib/list",
        highcharts: "../lib/highcharts",
        pagination: "../lib/jquery.easyPaginate",
        timezone: "../lib/moment-timezone",
        listPagination : "../lib/list.pagination.min"
       

    },
    shim: {
        'jquery.validate': {
            deps: ["jquery"],
            exports: "$.validator"
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "jquery-steps": {
            deps: ["jquery"]
        },
        tagsinput: {
            deps: ["bootstrap", "typeahead"]
        },
        highcharts: {
            exports: "Highcharts"
        },
        "bloodhound": {
            deps: ["jquery"],
            exports: "Bloodhound"
        },
        "pagination": {
            deps: ["jquery"]
        }

    }
};