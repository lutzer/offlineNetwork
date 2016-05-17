module.exports = {

	// builds mongodb query from backbone.paginator options
	buildPaginatorOptions: function(options) {

		options = options || {};
		var newOptions = {};

		options.order = options.order || 'asc';

		//build sort options
		if (options.sort_by) {
			newOptions['sort'] = {};
			newOptions.sort[options.sort_by] = options.order == 'asc' ? 1 : -1;
		}

		//build limit options
		if (options.page && options.per_page) {
			newOptions['skip'] = (parseInt(options.page) - 1) * parseInt(options.per_page);
			newOptions['limit'] = parseInt(options.per_page);
		}

		return newOptions;
	},

	handleError: function(err,res) {
		if(err) {
	        console.log('error occured: ' + err);

	        //if res defined, also give server answer
	        if (res)
	        	res.status(500).send(err);

	        throw(err);
	        
	        return true;
	    }
	    return false;
	}
}