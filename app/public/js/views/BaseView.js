define([
	'jquery',
	'underscore',
	'backbone',
	'marionette'
], function($, _, Backbone, Marionette){
	
	var BaseView = Marionette.ItemView.extend({
		
		className: 'page',

		collectionEvents : {
			'sync' : 'render'
		},

		/*modelEvents : {
			'sync' : 'render'
		}*/
	});
	
	return BaseView;
	
});