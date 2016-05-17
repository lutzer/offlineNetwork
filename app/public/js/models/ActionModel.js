define([
        'underscore',
        'backbone'
], function(_, Backbone){

	var ActionModel = Backbone.Model.extend({

		defaults: {
			id : 'none',
			type : false,
			label: '',
			result : false,
			length : 50 //default length for text inputs
		},

		updateSettings: function(settings) {
			var id = this.get('id');

			if (Backbone.settings.has(id)) {
				Backbone.settings.setField(id,this.get('result'));
				Backbone.settings.save();
			}
		}
	
	});

	// Return the model for the module
	return ActionModel;

});