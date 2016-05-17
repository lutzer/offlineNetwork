define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'Controller'
], function($, _, Backbone, Marionette, Controller) {
	
	var App = new Backbone.Marionette.Application();

	var initialize = function(){
		
		App.addInitializer(function(options){
			  Backbone.history.start();
			  
			  // support cross origin sharing
			  $.support.cors=true;
			  
			  Marionette.Behaviors.behaviorsLookup = function() {
			      return window.Behaviors;
			  }
			  
		});
		
		App.Router = new Marionette.AppRouter({
			controller: new Controller(App),
			appRoutes: {
				'questions/:id' : 'showQuestion',
				'questions' : 'listQuestions',
				'submissions' : 'listSubmissions',
				'projection' : 'showProjection',
				'*actions': 'default'
			}
		});
		
		App.start();
		
	};

	return {
		initialize: initialize,
	};
	
});