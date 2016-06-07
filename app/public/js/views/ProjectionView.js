define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'config',
	'views/BaseView',
	'models/SubmissionModel',
	'models/SubmissionCollection',
	'models/QuestionCollection',
	'text!templates/projectionItemTemplate.html'
], function($, _, Backbone, Marionette, config, BaseView, SubmissionModel, SubmissionCollection, QuestionCollection, itemTemplate){
	
	var ProjectionView = Marionette.CollectionView.extend({
		
		className: 'projection',

		childView : BaseView.extend({
			className: 'projection-item',
			template: _.template(itemTemplate),
			templateHelpers: function() {
				return {
					path : config.upload_directory+this.model.get('_id')+'/',
					image : this.model.getImage(),
					name : this.model.getName(),
					place : this.model.getPlace(),
					text : this.model.getText(),
					label : this.model.getLabel()
				};
			},
		}),

		initialize: function() {
			var self = this;

			this.questions = new QuestionCollection();
			this.questions.fetch();

			//this.model = new QuestionModel();

			this.collection = new SubmissionCollection();
			this.collection.setSorting('_id', -1); //ascending
			this.collection.setPageSize(1, { first: true });

			//bind model add event
			this.listenTo(Backbone,'submissions:added', function(data) {
				self.startPageTimer(true);
			});

			this.startPageTimer();

		},

		onBeforeAddChild: function(childView){

			//add question title
			var questionModel = this.questions.get(childView.model.get('questionId'));
			if (questionModel)
				childView.model.set({ question : questionModel.get('title') });
  		},

		startPageTimer: function(showNewestPage) {
			showNewestPage = showNewestPage || false;

			var self = this;

			//clear old timer, if there is one present
			if (this.timer)
				clearTimeout(this.timer);

			//display next page
			if (showNewestPage)
				self.collection.getLastPage();
			else if (self.collection.state.currentPage >= self.collection.state.totalPages)
				self.collection.getFirstPage();
			else
				self.collection.getNextPage();

			// start loop
			this.timer = setTimeout(function() {
				self.startPageTimer();
			},config.projection_submission_interval);

		}
	});
	
	return ProjectionView;
	
});