define([
        'underscore',
        'backbone',
        'localstorage'
], function(_, Backbone, localstorage){

	var AppModel = Backbone.Model.extend({

		localStorage: new Backbone.LocalStorage("AppModel"),

		defaults: {
			name : false,
			place : false
		},

		setField: function(name,value) {
			var params = {};
			params[name] = value
			this.set(params);
		}
	
	});

	// Return the model for the module
	return AppModel;

});