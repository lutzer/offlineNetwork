/* CONFIG FILE */

var Config = {
	
	uploadPath : __dirname + "/public/uploads", //chmod this path 777
	uploadTmpPath : __dirname + "/tmp", //chmod this path 777
	
	databaseFile : __dirname + "/data", //chmod this path 777

	questionFilePath : __dirname + "/data/questions.json",

	baseUrl : '/', // with trailing /
	servePublicDir : true,
	hostname : false, // 127.0.0.1 = private, false = public
	port : '8080'

};

module.exports = Config;