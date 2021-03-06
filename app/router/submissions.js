var express = require('express');
var _ = require('underscore');
var multer  = require('multer');
var htmlspecialchars = require('htmlspecialchars');


var config = r_require('/config.js');
var submissions = r_require('/models/submissions');
var appEvents = r_require('/utils/appEvents.js');
var utils = r_require('/utils/utils');

var router = express.Router();

//configure multer upload
var upload = multer({ dest: 'tmp/' });

/*
 * GET /api/submissions/
 */ 
router.get('/',function(req,res){

    var options = utils.buildPaginatorOptions(req.query);

    submissions.list(options,function(err,docs) {

        if (utils.handleError(err,res))
            return;

        submissions.count(function(err, count) {

            if (utils.handleError(err,res))
                return;

            res.send({
                docs : docs,
                total_entries : count
            });
        });
    });
});

/*
 * GET /api/submissions/:id
 */ 
router.get('/:id',function(req,res){
    submissions.get(req.params.id, function(err,doc) {
        utils.handleError(err);
        res.send(doc);
    });
});

/*
 * GET /api/submissions/delete/:id
 * requires auth
 */ 
router.get('/delete/:id',function(req,res){
    submissions.remove({_id : req.params.id},function(err,result) {
        utils.handleError(err);
        if (result > 0) {
            appEvents.emit('submissions:deleted',req.params.id);
            res.send({message: 'Document with id '+req.params.id+' removed.'});
        } else
            res.send({message: 'There is no document with the id: '+req.params.id+'.'});
    });

});

/*
 * POST /api/submissions/
 */ 
router.post('/', upload.single('file'), function (req, res) {

    console.log('Received new Submission');

    //deserialize data, if multipart form
    if (typeof(req.body.results) == 'string')
        req.body.results = JSON.parse(req.body.results);
    if (typeof(req.body.questionId) == 'string')
        req.body.questionId = JSON.parse(req.body.questionId);

    //create submission data
    var data = {
        results : req.body.results,
        questionId : req.body.questionId
    }

    //clean htmlspecialchars
    _.each(data.results, function(val) {
        if (val.result)
            val.result = htmlspecialchars(val.result);
    });

    if (req.file) {
        //insert filepath to data object
        var index = _.findIndex(data.results, {type : 'image'});
        data.results[index].file = req.file.originalname;
    }

    //insert data
    submissions.create(data, function(err, docs) {

        utils.handleError(err);

        console.log('Submission added to database');

        object = docs[0];
        var objectId = object._id;

        // copy file to submissions folder
        if (req.file)
            submissions.saveFile(objectId,req.file);

        // trigger socket event
        appEvents.emit('submissions:added',object)

        // send answer
        res.send(object);

    });
    
});

/* LETTERBOX POST on /api/submissions/letterbox/ */
router.post('/letterbox/', upload.single('file'), function (req, res) {

    console.log("Received Submission from letterbox");

    //create submission data
    var data = {
        results : [{
            id: 'picture',
            type: 'image',
            label: req.body.message,
            file: '',
            length: 50,
            result: true
        }],
        questionId : -1
    }

    _.each(data.results, function(val) {
        if (val.result)
            val.result = htmlspecialchars(val.result);
    });

    if (req.file) {
        //insert filepath to data object
        var index = _.findIndex(data.results, {type : 'image'});
        data.results[index].file = req.file.originalname;
    }

    submissions.create(data, function(err, docs) {
        utils.handleError(err);

        console.log('Submission added to database');

        object = docs[0];
        var objectId = object._id;

        // copy file to submissions folder
        if (req.file)
            submissions.saveFile(objectId,req.file);

        // trigger socket event
        appEvents.emit('submissions:added',object)

        // send answer
        res.send(object);

    });

});

module.exports = router;