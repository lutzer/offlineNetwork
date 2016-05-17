var socketio = require('socket.io');
var submissions = r_require('/models/submissions');

var appEvents = r_require('/utils/appEvents');

module.exports = function (http) {

	var io = socketio(http);

	io.on('connection', function(socket){

	    console.log('Socket: User connected');

	    // Server event handlers

	    function submissionAddedHandler(doc) {
	    	console.log('send submidssion:added');
		    socket.emit('submissions:added',{data: doc});
	    }
		appEvents.on('submissions:added', submissionAddedHandler);

		function submissionDeletedHandler(id) {
			socket.emit('submissions:deleted',{id: id});
		}
		appEvents.on('submissions:deleted', submissionDeletedHandler);

	    // Client event handlers

	    /*function onSubmissionList() {
	    	submissions.list(null,function(err,docs) {
		        socket.emit('submissions:list',{data: docs});
		    });
	    }
	    socket.on('submissions:list',onSubmissionList);

	    function onSubmissionGet(id) {
	    	submissions.get(id,function(err,doc) {
		        socket.emit('submissions:get',{data: doc});
		    });
	    };
	    socket.on('submissions:get', onSubmissionGet);*/

		socket.on('error', function(err) {
	    	console.log(err);
		});

	    // Clean up after disconnect

	    socket.on('disconnect', function(){
	        console.log('Socket: User disconnected');

	        //remove server events
	        appEvents.removeListener('submissions:added',submissionAddedHandler);
	        appEvents.removeListener('submissions:deleted',submissionDeletedHandler);
	    });

	});

};