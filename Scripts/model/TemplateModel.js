define([
  "underscore",
  "backbone",
  "./PollModel"
], function (underscore, Backbone,PollModel) {

    var TemplateModel = PollModel.extend({
        urlRoot: "/api/Template",
        idAttribute : "PollId"
    });

    return TemplateModel;
});