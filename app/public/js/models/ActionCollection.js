define([
        'underscore',
        'backbone',
        'models/ActionModel'
], function(_, Backbone, ActionModel){
	
	ActionCollection = Backbone.Collection.extend({
		
		model: ActionModel
	
	});
	
	return ActionCollection;
});