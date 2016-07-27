define([
  "underscore",
  "backbone",
  "../model/ParticipantModel"
], function (underscore, Backbone, ParticipantModel) {
    var ParticipantCollection = Backbone.Collection.extend({
        model: ParticipantModel
    });
    return ParticipantCollection;
});