var express = require('express');
var router = express.Router();
var fs = require('fs');
var AWS = require('aws-sdk');
var async = require('async');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var image, imageName;
var bucketName = "riturajcse";

AWS.config.loadFromPath('config.json');
const s3 = new AWS.S3({region: 'us-west-2'})

router.get('/images', function(req, res, next) {
	var params = { 
	 Bucket: bucketName,
	 Delimiter: '/'
	}

	s3.listObjects(params, function (err, data) {
	 if(err)
	 	throw err;
	 res.json(data);
	});
});

router.post('/upload', multipartMiddleware, function(req, res, next) {
	var tmp_path = req.files.file.path;
 	image = fs.createReadStream(tmp_path);
    imageName = req.files.file.name;
    async.series([
        createS3Bucket,
        putObjectInBucket
        ], function (err, result) {
        if(err)
          return res.send(err)
        else
          return res.redirect('/') 
    })

})

function createS3Bucket(callback) {
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : bucketName
	};                    
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	   	console.log("ErrorHeadBucket", err)
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   	console.log("Error", err)
			      callback(err, null)
			   } else {
			      callback(null, data)
			   }
			});
	   } else {
	      callback(null, data)
	   }
	})                             
}

function putObjectInBucket(callback) {
  const params = { 
        Bucket: bucketName, 
        Key: imageName, 
        ACL: 'public-read',
        Body:image
    };
	s3.putObject(params, function (err, data) {
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null)
	    } else {
	    	console.log("Successfully uploaded image on S3", data);
	    	callback(null, data)
	    }
	})  
}



module.exports = router;