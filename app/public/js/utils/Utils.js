define([
	'underscore'
], function(_){
	
	return {
		
		serializeObject: function(obj) {
			return _.mapObject(obj, function(val) {
				return JSON.stringify(val);
			});
		}
	}
	
});