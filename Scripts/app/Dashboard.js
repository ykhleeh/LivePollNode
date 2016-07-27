require(["jquery", "listPagination", "./_layout", "listjs"],
    function ($, ListPagination) {
        //$(".showParticipateButton").show();
        $(".disabledLink").on("click", function(e) {
            e.preventDefault();
        });



        

        var options = {
            valueNames: ["Title", "Question", "Labels", "Statut", "Deadline","Creator"]
           
          
        }
        var userList = new List("initiatedPagination", options);
        var userList2 = new List("invitedPagination", options);
        $(".main-search").on("keyup", function () {
            userList.search($(".main-search").val());
            userList2.search($(".main-search").val());
        });
      
        var options = {
            valueNames: ["Title", "Question", "Labels", "Statut", "Deadline","Creator"],
            page: 10,
            plugins: [
              ListPagination({})
            ]
        };

        var listPollInvited = new List("invitedPagination", options);


        var options2 = {
            valueNames: ["Title", "Question", "Labels", "Statut", "Deadline", "Creator"],
            page: 10,
            plugins: [
              ListPagination({})
            ]
        };

        var listPollInitiated = new List("initiatedPagination", options2);

        $(".disabledLink").on("click", function (e) {
            e.preventDefault();
        });

    }
  );
