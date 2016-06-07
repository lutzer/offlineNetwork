define([], function(){
	var config = {

		/*
		 *  server settings 
		 */
		"web_service_url": "api/",

		"web_socket_url": "http://localhost:8080",
		
		"upload_directory": "uploads/",

		"submissions_per_page" : 6,

		"projection_submission_interval" : 5000 // in ms
			
	};
	return config;
});