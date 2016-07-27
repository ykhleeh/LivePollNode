require(["jquery", "backbone", "jquery.validate", "./_layout"],
    function ($, Backbone) {
        var mySyncFunction = function (method, model, option) {
            option.url = "/api/FreeAnswerPoll/" + $("#PollId").val();
            return Backbone.sync(method, model, option);
        };

        var Collection = Backbone.Collection.extend({
            sync: mySyncFunction,
            save: function () {
                Backbone.sync("create", this, {
                    success: function () {
                        window.location.href = "/";
                    },
                    url: "/api/FreeAnswerPoll/SaveAnswers/" + $("#PollId").val()
                });
            }
        });
        var co = new Collection();
        var RespondView = Backbone.View.extend({
            el: "#participateForm",
            initialize: function () {
                this.listenTo(co, "sync update", this.render, this);
                this.render();
            },
            render: function () {
                $("#listeDesReponses").html("");
                co.each(function (poll) {
                    $("#listeDesReponses").append("<li class='list-group-item' id='" + poll.cid + "'>" + poll.get("ResponseText") + " <a href='' class='removeAnswer pull-right'><span class='glyphicon glyphicon-remove'></span></a></li>");
                });

            },
            events: {
                "click  #addAnswer": "addAnswer",
                "click #send": "send",
                "click .removeAnswer ": "removeAnswer",
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
            ,
            removeAnswer: function (e) {
                var id = $(e.currentTarget).closest("li").attr("id");
                co.remove(id);
                e.preventDefault();
            }
            ,
            send: function () {
                if ($("#IsQrm").val() === "False") {
                    if ($("#userAnswer").val().length > 0) {
                        co.add({ ResponseText: $("#userAnswer").val(), PollId: $("#PollId").val() });
                        co.save(null, {
                            success: function () {
                                window.location.href = "/";
                            }
                        });
                    } else {
                        $("#errorMessage").show();
                    }
                } else if ($("#IsQrm").val() === "True") {
                    if (co.length > 0) {
                        co.save(null, {
                            success: function () {
                                window.location.href = "/";
                            }
                        });
                    } else {
                        $("#errorMessage").show();
                    }
                }
            },
            addAnswer: function () {
                if ($("#IsQrm").val() === "True") {
                    if ($("#userAnswer").val().length > 0) {
                        co.add({ ResponseText: $("#userAnswer").val(), PollId: $("#PollId").val() });
                        $("#userAnswer").val("");
                        $("#errorMessage").hide();
                    } else {
                        $("#errorMessage").show();
                    }
                }
            }

        });

        var v = new RespondView({
        });
    }
  );