define([
        'underscore',
        'backbone',
        'config'
], function(_, Backbone, config){

	var SubmissionModel = Backbone.Model.extend({

		urlRoot : config['web_service_url']+"submissions",

		defaults: {
			_id : -1,
			results: [],
			questionId : false
		},

		getImage : function() {

			var image = _.findWhere(this.get('results'),{type: 'image'});

			if (image && image.result == 'true')
				return image;
			else
				return false
		},

		getName : function() {
			var author = _.findWhere(this.get('results'),{id: 'name'});

			if (author && author.result != 'false')
				return author.result;
			else
				return ""
		},

		getPlace: function() {
			var place = _.findWhere(this.get('results'),{id: 'place'});

			if (place && place.result != 'false')
				return place.result;
			else
				return ""
		},

		getText: function() {
			var text = _.findWhere(this.get('results'),{type: 'text'});

			if (text && text.result != 'false')
				return text.result;
			else
				return ""
		},

		getLabel : function() {
			var text = this.get('results')[0];

			if (text && text.label != 'false')
				return text.label;
			else
				return ""
		},
	});

	// Return the model for the module
	return SubmissionModel;

});