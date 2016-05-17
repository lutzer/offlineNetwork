define([
        'jquery',
        'backbone',
        'marionette',
        'socket',
        'config',
        'views/dialogs/ModalDialogView',
        'views/BaseView',
        'views/QuestionView',
        'views/SubmissionListView',
        'views/ProjectionView',
        'models/QuestionCollection',
        'models/AppModel',
        'text!templates/homeTemplate.html',
        'text!templates/questionListTemplate.html'
], function($, Backbone, Marionette, io, config, ModalDialogView, BaseView, QuestionView, SubmissionListView, ProjectionView, QuestionCollection, AppModel, homeTemplate, questionListTemplate){
	
	var Controller = Marionette.Controller.extend({
		
		initialize: function(app) {
			this.app = app;
			
			app.addRegions({
				contentRegion: "#content",
				modalRegion: "#modal-container"
			});
			
			//register client events
			Backbone.on('dialog:open', this.openDialog, this);
			Backbone.on('dialog:close', this.closeDialog, this);

			//register socket events
			var socket = io(config.web_socket_url);
            socket.on('submissions:added', function(data) {
                Backbone.trigger('submissions:added',data);
            });

            //fetch settings
            Backbone.settings = new AppModel({id: 1});
            Backbone.settings.fetch();
		},
			
		/* ROUTES */

		showQuestion: function(id) {
			this.app.contentRegion.show(new QuestionView({id : id}));
		},

		listQuestions: function() {

			var questions = new QuestionCollection();
			questions.fetch();

			this.app.contentRegion.show(new BaseView({ 
				template : _.template(questionListTemplate),
				collection : questions
			}));
		},

		listSubmissions: function() {
			this.app.contentRegion.show(new SubmissionListView());
		},

		showProjection: function() {
			this.app.contentRegion.show(new ProjectionView());
		},
	
		default: function() {
			this.app.contentRegion.show(new BaseView({ 
				template : _.template(homeTemplate) 
			}));
		},
		
		/* DIALOGS */
		
		openDialog: function(options) {
			this.app.modalRegion.show(new ModalDialogView(options));
		},
		
		closeDialog: function() {
			if (this.app.modalRegion.hasView())
				this.app.modalRegion.reset();
		}
		
	});
	
	return Controller;
});