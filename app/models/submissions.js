var fs = require('fs');

var Database = r_require('/models/database');
var config = r_require('/config');
var utils = r_require('/utils/utils');

var Submission = {

	create : function(data,callback) {
		
		var db = new Database();
		db.submissions.insert(data,callback)
	},

	get : function(id,callback) {

		var db = new Database();
		db.submissions.findOne({ _id : id }, callback);
	},

	list : function(options,callback) {

		var db = new Database();
		db.submissions.find({}, function(err, cursor) {
			
			if (err) {
				callback(err);
				return;
			}

			//apply options
			if (options.sort)
				cursor = cursor.sort(options.sort);
			if (options.skip)
				cursor = cursor.skip(options.skip);
			if (options.limit)
				cursor = cursor.limit(options.limit);

			//send data and count
			cursor.toArray(function(err,docs) {
				callback(err,docs,0);
			});
		});
	},

	count : function(callback) {
		var db = new Database();
		db.submissions.find({}).count(callback);
	},

	remove : function(id,callback) {
		
		var db = new Database();
		db.submissions.remove({_id: id},callback);
	},

	saveFile: function(id, file) {

		 //create directory in upload folder
        var targetDir = config.uploadPath + '/' + id;
        var exists = fs.existsSync(targetDir);
        if (!exists)
            fs.mkdirSync(targetDir);

        //copy file to uploads folder
        var targetPath = targetDir + '/' + file.originalname;
        fs.renameSync(file.path,targetPath);
	},

}

module.exports = Submission;