define([
  "underscore",
  "backbone"
], function (underscore, Backbone) {

    var PollModel = Backbone.Model.extend({
        urlRoot: "/api/poll",
        idAttribute: "PollId"
    });

    return PollModel;
});