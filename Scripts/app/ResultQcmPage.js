require(["jquery", "backbone", "../view/ResultQcmView","highcharts","listjs", "./_layout"],
    function ($, Backbone, ResultQcmView) {


      
        var options2 = {
            valueNames: ['name', 'born']
        };

        var userList = new List('users', options2);
        var v = new ResultQcmView();

    }


  );

