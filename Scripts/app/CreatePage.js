require(["jquery", "backbone", "bloodhound", "../collection/ParticipantCollection", "../model/PollModel","../view/CreateView", "jquery-ui", "typeahead", "tagsinput", "moment", "jquery.validate", "datetimepicker", "./_layout", "listjs", "../model/ParticipantModel"],
    function ($, Backbone, Bloodhound, ParticipantCollection, PollModel, CreateView) {

        //set datetimepicker
        $("#Deadline").datetimepicker({
            format: "YYYY-MM-DD HH:mm "
        });

        //source for labels for search or create labels
        var labelList = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: "/api/Labels?st=%QUERY",
                wildcard: "%QUERY",
                cache: false
            }
        });

        // tagsinput && typeahead for labels
        $("#Tags").tagsinput({
            typeaheadjs:[ {
                hint: false,
                highlight: false,
                minLength: 1,
                limit: 5
            }, {
                source: labelList,
                name: "labels"
                }
            ],
            maxTags: 3,
            freeInput: true
        });

        //set search input and sort for poll templates
        var options = {
            valueNames: ["Title", "Question", "Type", "CreatedDate", "Labels"]
        }
        var searchable = new List("searchload", options);

        //validation
        $.validator.addMethod("enddate", function (value) {
            return moment(value, "YYYY-MM-DD HH:mm") > moment();
        }, "");


        $("#createForm").validate({
            rules: {
                Title: {
                    required: true
                },
                Question: {
                    required: true
                },
                Deadline: {
                    enddate: true,
                    required: true
                },
                Tags: {
                    //  checkTags: true,
                    required: true
                }
               
            },
            messages: {
                Title: "You must specify a title",
                Question: "You must specify a question",
                Deadline: "you must specify a date for the deadline in the future"
            }
        });


        var val = $("#PollId").val();
       if (val > 0) {
           var p = new PollModel({ "PollId": val });
           var l = p.fetch(null,{error : function() {
               location.href = "/";
           }});
           l.done(function () {
             new CreateView({ model: p });
           });
       } else {
           new CreateView();
       }
       


    });




