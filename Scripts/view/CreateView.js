define([
    "jquery",
  "underscore",
  "backbone",
  "../model/PollModel",
  "../collection/ParticipantCollection",
  "../model/ParticipantModel",
  "../model/TemplateModel",

], function ($, underscore, Backbone, PollModel, ParticipantCollection, ParticipantModel, TemplateModel) {
    var currentPage = 2;
    var form = $("#createForm");
    var nbPage = $(".form_page").length;
    var choices = [];
    var isTemplate = false;
    var coll = new ParticipantCollection();
    var nbChoices = 0;
    var self;
    var CreateView = Backbone.View.extend({

        index: 1,
        el: "#createHtml",
        initialize: function () {
            if (this.model == null) this.model = new PollModel();
            this.collection = new ParticipantCollection();
            this.render();
            self = this;
        },
        render: function () {
            $("#page1").show();
            this.twitterTypeahead();
            if (!this.model.isNew()) {
                this.renderPage(this.model);
                this.renderParticipants(this.model.get("Participants"));
            }
        },
        events: {
            "click .next": "next",
            "click .back": "back",
            "click #submitPoll": "postPoll",
            "click #addChoice": "add",
            "click .removeButton": "remove",
            "click .IsTemplate": "showIsShared",
            "click .IsTemplateQcm": "showIsSharedQcm",
            "click .templatePoll": "loadPoll",
            "click .removePart": "removePart",
            "click .type": "selectType",
            "keypress #choice": "enterEventOnChoice",
            "click .removeTemplate": "removeTemplate"

        },
        removeTemplate: function (e) {
         
            if (confirm("Are you sure?")) {
                var id = $(e.currentTarget).attr("id");
                var template = new TemplateModel();
                template.set("PollId", id);
                template.destroy();
                $(e.currentTarget).closest("tr").remove();
            }
           
        }
        ,
        renderParticipants: function (participants) {

            for (var i = 0 ; i < participants.length; i++) {
                this.addParticipants({ name: participants[i].UserName });
            }
        }
        ,
        twitterTypeahead: function () {

            var usersInfo = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: "/api/UserInfo?st=%QUERY",
                    wildcard: "%QUERY",
                    filter: function (list) {
                        return $.map(list, function(user) {
                            return { name: user.UserName, NickName : user.NickName, Type : user.Type };
                        });
                    }
                }
            });

            $("#remote .typeahead").typeahead({
                

            }, {
                source: usersInfo,
                limit: 10,
                name: "user",
                displayKey: "name"
            }).on("typeahead:selected", function (obj, datum) {
                self.addParticipants(datum);
            });

        },
        addParticipants: function (datum) {
            var result = coll.where({ name: datum.name });
            if (result.length === 0) {
                var partMod = new ParticipantModel();
                partMod.set("name", datum.name);
                partMod.set("NickName", datum.NickName);
                partMod.set("Type", datum.Type);

                coll.add(partMod);
                $("#listParticipant").append("<li class='list-group-item' name='participants'  id=" + partMod.cid + "> " + datum.name + '<span class="pull-right"> <button class="removePart btn btn-xs btn-warning"><span class="glyphicon glyphicon-remove"></span></button></span>' + "</li>");
            } else {
                alert("already added");
            }
            $("#participantsError").hide();
            $("#typeahead").typeahead("val", "");

        }
        ,

        enterEventOnChoice: function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) {
                this.add();
            }

        }
        ,
        removePart: function (e) {
            var id = $(e.currentTarget).closest("li").attr("id");
            coll.remove(id);
            $(e.currentTarget).closest("li").remove();
        }
        ,
        selectType: function (e) {
            var type = $(e.currentTarget).context.value;
            this.model.set("Type", type);
            $("#page1").hide();
            $("#page2").show();
            if (type === "Free") {
                $("#showIsTemplate").show();
            }
        },
        showIsSharedQcm: function () {
            var value = $("#IsTemplateQcm").prop("checked");
            if (value) {
                $("#IsSharedQcmContainer").show();
            } else {
                $("#IsSharedQcmContainer").hide();
            }
        },
        containsName: function (data) {
            var result = this.collection.where({ name: data });
            return result.length;
        }
        ,
        loadPoll: function (e) {
            var idPoll = $(e.currentTarget).context.id;

            var template = new TemplateModel({ "PollId": idPoll });
            var l = template.fetch();
            var self = this;
            l.done(function () {
                isTemplate = true;
                self.renderPage(template);
            });

        },
        renderPage: function (m) {
            $("#Deadline").val(m.get("Deadline"));
            $("#Title").val(m.get("Title"));
            $("#Question").val(m.get("Question"));
            var tags = m.get("Tags");
            for (var t in tags) {
                $("#Tags").tagsinput("add", tags[t]);
            }

            this.model.set("Type", m.get("Type"));
            this.model.set("PollId", m.get("PollId"));

            if (m.get("Type") === "Qcm") {
                var choices = m.get("Choices");
                for (var x in choices) {
                    $("#choice").val(choices[x]);
                    this.add();
                }
            } else {
                $("#showIsTemplate").show();
            }
            $("#page1").hide();
            $("#page2").show();
        },
        showIsShared: function (e) {
            var value = $("#IsTemplate").prop("checked");
            if (value) {
                $("#IsSharedContainer").show();
            } else {
                $("#IsSharedContainer").hide();
            }
        },
        remove: function (e) {
            $(e.currentTarget).closest("tr").remove();
            nbChoices--;
        },
        add: function () {
            if ($("#choice").val().length > 0) {
                var c = $("#choice").val();
                choices.push(c);
                $("#tableChoice > tbody").append("<tr><td name = 'usa'>" + c + '</td><td><button type="button" id="lol" class="btn btn-default removeButton" aria-label="Left Align"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button></td></tr>');
                $("#choice").val("");
                $("#choiceError").hide();
                nbChoices++;
            }
        },
        next: function () {
            var nextPage;

            if (currentPage < nbPage && form.valid()) {
                if (currentPage === 3 && this.model.get("Type") === "Qcm" && $("#IsTemplateQcm").prop("checked")) {
                    this.saveTemplate();
                }
                if (currentPage === 2 && this.model.get("Type") === "Free" && $("#IsTemplate").prop("checked")) {
                    this.saveTemplate();
                }
                if (currentPage === 3) {
                    if (nbChoices < 2) {
                        $("#choiceError").show();
                        return false;
                    }
                }
                if (currentPage === 2 && this.model.get("Type") === "Free") {
                    nextPage = 4;
                } else {
                    nextPage = currentPage + 1;
                    $("#questionField").html('<h4>"' + $("#Question").val() + '"</h4>');
                }
                $("#page" + currentPage).hide();
                currentPage = nextPage;
                $("#page" + currentPage).show();
            }
        },
        saveTemplate: function () {
            var p = new TemplateModel();
            p.set("PollId", this.model.get("PollId"));
            p.set("IsTemplate", true);
            p.set("Title", $("#Title").val());
            p.set("Question", $("#Question").val());
            p.set("Deadline", $("#Deadline").val());
            p.set("IsAllowedBlankVote", $(".blankvote:checked").val());
            p.set("Type", this.model.get("Type"));
            if (p.get("Type") === "Free") {
                p.set("IsShared", $("#IsShared").prop("checked"));
            } else {
                p.set("IsShared", $("#IsSharedQcm").prop("checked"));
            }
            p.set("IsQrm", $(".qrm:checked").val());
            var qcmChoices = [];
            form.find("td[name='usa']").each(function (i, el) {
                qcmChoices.push($(el).html());
            });
            p.set("PollChoices", qcmChoices);
            p.set("Tags", $("#Tags").tagsinput("items"));

            p.save(null, {
                success: function () {
                    $("#alertSucessSaved").show();
                },
                error: function () {
                    $("#alertErrorSaved").show();
                }
            });
        },
        back: function () {
            var previousPage;
            if (currentPage >= 3) {
                if (currentPage === 4 && this.model.get("Type") === "Free") {
                    previousPage = 2;
                } else {
                    previousPage = currentPage - 1;
                }
                $("#page" + currentPage).hide();
                currentPage = previousPage;
                $("#page" + currentPage).show();
            }
        },
        postPoll: function () {
            var p = new PollModel();
            if (isTemplate) {
                this.model.unset("PollId");
            } else {
                p.set("PollId", this.model.get("PollId"));
            }

            p.set("Type", this.model.get("Type"));
            p.set("Participants", coll);
            p.set("Deadline", $("#Deadline").val());
            p.set("Question", $("#Question").val());
            p.set("Title", $("#Title").val());
            p.set("Statut", "open");
            p.set("Tags", $("#Tags").tagsinput("items"));
            p.set("IsTemplate", false);
            p.set("IsShared", $(".IsShared:checked").val());
            p.set("IsQrm", $(".qrm:checked").val());

            p.set("IsAllowedBlankVote", $(".blankvote:checked").val());
            var qcmChoices = [];
            form.find("td[name='usa']").each(function (i, el) {
                qcmChoices.push($(el).html());
            });
            p.set("PollChoices", qcmChoices);
            p.save(null, {
                success: function () {
                    window.location.href = "/";
                }
            });
        }
    });

    return CreateView;
});