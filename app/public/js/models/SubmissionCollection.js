define([
        'underscore',
        'backbone',
        'PageableCollection',
        'config',
        'models/SubmissionModel'
], function(_, backbone, PageableCollection, config, SubmissionModel){
	
	SubmissionCollection = PageableCollection.extend({
		
        	model: SubmissionModel,

        	url : config['web_service_url']+"submissions",

        parseState: function (resp, queryParams, state, options) {
        	return { totalRecords: resp.total_entries };
        },

        // get the actual records
        parseRecords: function (resp, options) {
        	return resp.docs;
	    },

        fetch: function(options) {
            var self = this;

            this.trigger('fetching');

            //pass to super class
            return PageableCollection.prototype.fetch.call(self,options);
            
        }
	});
	
	return SubmissionCollection;
});