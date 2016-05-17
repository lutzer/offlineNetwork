define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'utils',
	'models/QuestionModel',
	'models/SubmissionModel',
	'views/ActionElementView',
	'text!templates/questionTemplate.html'
], function($, _, Backbone, Marionette, Utils, QuestionModel, SubmissionModel, ActionElementView, template){
	
	var QuestionView = Marionette.CompositeView.extend({

		initialize: function(options) {

			this.model = new QuestionModel({id : options.id});
			this.model.fetch();

			this.submitEnabled = false;

		},

		childView : ActionElementView,

		childViewContainer: '#action-element-list',

		onBeforeAddChild: function(childView){
			var self = this;
    		childView.on('inputChanged', function() {
    			self.enableSubmit(true);
    		});
  		},

		template: _.template(template),
		
		className: 'page content-wrapper',

		modelEvents : {
			'sync' : '_onModelSync'
		},

		events: {
			'click #submitButton' : 'onSubmitButtonClicked'
		},

		_onModelSync : function() {

			this.collection = this.model.get('actions');
			this.render();
		},

		enableSubmit: function(enable) {

			this.submitEnabled = enable;
			if (enable)
				this.$('#submitButton').removeClass('pure-button-disabled')
			else
				this.$('#submitButton').addClass('pure-button-disabled')
		},

		onSubmitButtonClicked : function() {
			event.preventDefault();

			if (!this.submitEnabled)
				return;

			var results = [];
			var file = false;

			// collect results
			var results = this.collection.each(function(model) {

				//update App Settings
				model.updateSettings(Backbone.settings);

				results.push({
					type: model.get('type'),
					result: model.get('result'),
				});
				if (model.get('type') == 'image' && model.get('result')) {
					file = model.get('file');
					model.set({ file: 'true' });
				}
			});

			var data = { 
				results : results, 
				questionId : this.model.get('id')
			};
			var submission = new SubmissionModel(data);

			var options = {
				success: function(model,response) {
					if (response.error !== undefined)
						onError(response.error.message);
					else
						onSuccess();
				},
				error: function(model,response) {
					console.log(response);
					onError(response);
				}
			}

			// send files if there are any, currently it can only send one file
			if (file) {
				options.iframe = true;
				options.files = file;
				options.data = Utils.serializeObject(data);
				processData = false;
			}

			//submit data
			submission.save(submission.attributes,options);

			//open upload dialog
			Backbone.trigger('dialog:open', {
				title: "Sending Data", 
				text: "Depending on the submission size, this may take a few seconds...", 
				type: 'progress'
			});

			function onError(message) {
				Backbone.trigger('dialog:open', {
					title: "Error uploading", 
					text: message, 
					type: 'message'
				});
			}
			
			function onSuccess() {
				Backbone.trigger('dialog:open', {
					title: "Data submitted", 
					text: "Thank you! Your Post got submitted.", 
					type: 'message',
					callback: function() {
						window.location.href = "#";
					}
				});
			}
		}
	});
	
	return QuestionView;
	
});