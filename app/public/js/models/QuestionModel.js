define([
        'underscore',
        'backbone',
        'config',
        'models/ActionCollection'
], function(_, Backbone, config, ActionCollection){

	var QuestionModel = Backbone.Model.extend({

		urlRoot : config['web_service_url']+"questions",

		defaults : {
			title : '',
			text: '',
			actions : [],
			color: "green"
		},

		set: function(attributes, options) {
		    if (attributes.actions !== undefined && attributes.actions instanceof Array) {
		        attributes.actions = new ActionCollection(attributes.actions);
		    }
		    return Backbone.Model.prototype.set.call(this, attributes, options);
		},

		onSubmit: function(event) {
			
			event.preventDefault();

			var values = {};

			var model = new SubmissionModel(values);
			
			var options = {
				success: function(model,response) {
					if (response.error !== undefined)
						onError(response.error.message);
					else
						onSuccess();
				},
				error: function(model,response) {
					console.log(response);
					onError(response.responseJSON.error.message);
				}
			}

			//upload file if file is selected
			if (this.fileSelected) {
				options.iframe = true;
				options.files = this.$('#fileChooser');
				options.data = values;
			}
			
			// send data
			model.save(values, options);
			
			//open upload dialog
			Vent.trigger('dialog:open', {
				title: "Sending Data", 
				text: "Depending on the submission size, this may take a few seconds...", 
				type: 'progress'
			});
			
			function onError(message) {
				Vent.trigger('dialog:open', {
					title: "Error uploading", 
					text: message, 
					type: 'message'
				});
			};
			
			function onSuccess() {
				Vent.trigger('dialog:open', {
					title: "Data submitted", 
					text: "Thank you! Your Post got submitted.", 
					type: 'message',
					callback: function() {
						window.location.href = "#";
					}
				});
			};
		},
	
	});

	// Return the model for the module
	return QuestionModel;

});