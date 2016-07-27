define([
    "jquery",
  "underscore",
  "backbone",
  "../model/PollModel",
  "../collection/ParticipantCollection",
  "../model/ParticipantModel",
  "../model/TemplateModel",

], function ($, underscore, Backbone) {

    var EditView = Backbone.View.extend({

        el: "#editPollView",

        events: {
            "click #editButton": "editButton"
        },
        editButton: function (e) {
            var val = $("#Statut").val();
            if (val === "open") {
                return true;
            } else if (val === "closed") {
                alert("you must first reopen the poll before editing");
                return false;
            }
            return false;
        }
        ,
        initialize: function () {
            this.render();

        },
        render: function () {

        }

    });

    return EditView;
});