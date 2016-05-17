define([
        'underscore',
        'backbone',
        'models/QuestionModel',
        'config'
], function(_, Backbone, QuestionModel, config){
	
	QuestionCollection = Backbone.Collection.extend({
		
		model: QuestionModel,

		url : config['web_service_url']+"questions"
	
	});
	
	return QuestionCollection;
});