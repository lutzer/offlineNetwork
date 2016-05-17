var express = require('express');
var fs = require('fs');
var _ = require('underscore');

var config = r_require('/config.js');

var router = express.Router();

var data = require(config.questionFilePath);
/*
 * GET /api/submissions/
 */ 
router.get('/',function(req,res){

	var questions = _.filter(data, function(question) {
		return question.visible;
	})
	res.send(questions);
});

/*
 * GET /api/submissions/:id
 */ 
router.get('/:id',function(req,res){
	var question = _.findWhere(data, {id: parseInt(req.params.id)});
	if (question)
    	res.send(question);
    else
    	res.send({});
});

module.exports = router;