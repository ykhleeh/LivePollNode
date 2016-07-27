require(["jquery", "backbone","listjs", "./_layout"],
    function ($, Backbone) {


        
        var options2 = {
            valueNames: ['name', 'born']
        };

        var userList = new List('users', options2);
        var v = new ResultQcmView();

    }


  );

