define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'config',
	'models/SubmissionCollection',
	'views/BaseView',
	'text!templates/submissionListTemplate.html',
	'text!templates/submissionItemTemplate.html'
], function($, _, Backbone, Marionette, config, SubmissionCollection, BaseView, template, itemTemplate){
	
	var SubmissionListView = Marionette.CompositeView.extend({
		
		className: 'page',

		template : _.template(template),
		
		childViewContainer: '#submission-list',

		childView : BaseView.extend({
			className: 'item',
			template: _.template(itemTemplate),
			templateHelpers: function() {
				return {
					path : config.upload_directory+this.model.get('_id')+'/'
				};
			}
		}),

		collectionEvents: {
			'sync' : 'hideSpinner',
			'fetching' : 'showSpinner'
		},

		initialize: function(options) {

			var self = this;
			
			this.collection = new SubmissionCollection();
			
			//paginate options
			//this.collection.switchMode('infinite');
			this.collection.setSorting('_id', 1); //descending
			this.collection.setPageSize(config.submissions_per_page, { first: true });
			//this.collection.getFirstPage();

			//bind scroll handler
			var throttledScroll = _.throttle(function() {
				self.onWindowScroll(self);
			},500);
			$(window).on('scroll',throttledScroll);

			//bind model add event
			this.listenTo(Backbone,'submissions:added', function(data) {
				self.collection.add(data.data,{ at : 0 });
			});
		},
		
		onWindowScroll: function(self) {
			
			var scrollPos = $(window).scrollTop();
			var triggerPos =  $(document).height() - $(window).height() * 1.2;

			if (scrollPos > triggerPos && this.collection.state.currentPage < this.collection.state.totalPages) {
				this.collection.getNextPage({remove: false});
			}
			else if (scrollPos < $(window).height()* 0.25 && this.collection.state.currentPage > 1)
				this.collection.getFirstPage();
			
		},

		showSpinner: function() {
			this.$('#spinner').removeClass('gone');
		},
		hideSpinner: function() {
			this.$('#spinner').addClass('gone');
		}


	});
	
	return SubmissionListView;
	
});