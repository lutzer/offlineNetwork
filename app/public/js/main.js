require.config({
	baseUrl: "js",
	paths: {
		backbone: 'libs/backbone-min',
		underscore: 'libs/underscore-min',
		marionette: 'libs/backbone.marionette.min',
		socket: 'libs/socket.io',
		PageableCollection : 'libs/backbone.paginator.min',
		text: 'libs/plugins/text',
		iframeTransport : 'libs/jquery.iframe-transport',
		localstorage: 'libs/backbone.localStorage-min',
		utils : 'utils/Utils',
		config: 'values/config'
	}
});

require(['app'], function(App){
	App.initialize();
});