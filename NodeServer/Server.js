// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb');
var latLongSchemaModel;

var imageSource = "data:image/png;base64,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";
var regSuccess = {"status":"regSuccess"},
	msgSuccess = {"status":"msgSuccess"},
	imgSuccess = {"status":"imgSuccess"},
	alertSuccess = {"status":"alertSuccess"},
	deleteProfile = {"status":"profileDeleted"},
	updateProfile = {"status":"profileUpdated"},
	alertCancelSuccess = {"status":"alertCancelSuccess"},
	error ={"status":"error"};

// configure app to use bodyParser()
// this will let us get the data from a POST

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('db connection was successfull...');
	var latLongSchema = mongoose.Schema({
		image:String,
		name:String,
		phone: String,
		gender:String,
		lat:String,
		lon:String,
		message:String,
		senterName:String,
		senterId : String,
		alertFrom : String
	});
	var alertSchema = mongoose.Schema({
		name:String,
		phone: String,
		gender:String
	});
	latLongSchemaModel = mongoose.model('latLongSchemaModel', latLongSchema);
	alertSchemaModel = mongoose.model('alertSchemaModel', alertSchema);

});

//app.use(bodyParser());
app.use(bodyParser({limit: '50mb'}));

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

router.post('/message.fmb', function(req, res) {
	var from_id = req.body.from,
		to_id = req.body.to,
		from_name = req.body.fromName,
		user_message = req.body.message;
	latLongSchemaModel.update({_id:to_id},{message:user_message,senterName:from_name,senterId:from_id},function(err,success){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(msgSuccess);
	});
		
});

router.post('/alertreq.fmb', function(req, res) {
	var id = req.body.id;
	var phone = req.body.phone;
	latLongSchemaModel.find({_id:id},function(err,success){
		alertSchemaModel.create({_id:id,name:success.name,phone:phone,gender:success.gender}, function (err, success) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.json(alertSuccess);
		});
		
	});
		
});

router.post('/alertreqCancel.fmb', function(req, res) {
	var id = req.body.id;
	alertSchemaModel.remove({_id:id}, function (err, success) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(alertCancelSuccess);
	});
		
});

router.post('/uploadimage.fmb', function(req, res) {

	var my_id = req.body.id,
		imageSrc = req.body.image;
	latLongSchemaModel.update({_id:my_id},{image:imageSrc},function(err,success){
		latLongSchemaModel.find({_id:my_id},function (err, userDetails) {
			//if (err) console.log(err);
			var data={"status":"imgSuccess","userDetails":userDetails};
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.json(data);
			
		});
	});
});

router.post('/deleteprofile.fmb', function(req, res) {

	var id = req.body.id;
	latLongSchemaModel.remove({_id:id}, function (err, success) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(deleteProfile);
	});

});

router.post('/updateprofile.fmb', function(req, res) {

	var id = req.body.id;
	var name = req.body.name;
	var phone = req.body.phone;
	latLongSchemaModel.update({_id:id},{name:name,phone:phone},function(err,success){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(updateProfile);
	});

});

router.post('/afo.fmb', function(req, res) {

	var my_id = req.body.id,
		to_id = req.body.to_id;
	latLongSchemaModel.update({_id:my_id},{alertFrom:to_id},function(err,success){
		if (err) console.log(err);
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.json(alertSuccess);
	});
});

router.post('/api.fmb', function(req, res) {
	var id = req.body.id,
		lat = req.body.lat,
		lon = req.body.lon;
		latLongSchemaModel.update({_id:id},{lat:lat,lon:lon},function(err,success){
			data = {"status":"updateGeoSuccess"};
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.json(data);
		});
	//});
	
		
});


router.post('/getbuddys.fmb', function(req, res) {
	var id = req.body.id,
		phoneNumbers  = req.body.phoneNumbers,
		alertPersons = null;
	alertSchemaModel.find({$or:phoneNumbers},function(err,success){
		//if(!err)
			alertPersons = success;
				latLongSchemaModel.find({$or:phoneNumbers},function (err, userDetails) {
				//if (err) return console.log(err);
				//if(alertPersons)
					data = {"alertPersons":alertPersons,"userDetails":userDetails};
					res.header("Access-Control-Allow-Origin", "*");
					res.header("Access-Control-Allow-Headers", "X-Requested-With");
					res.json(data);
					latLongSchemaModel.update({_id:id},{message:null,alertFrom:null},function(err,success){});
				});
			
	});
	
		
});


router.post('/register.fmb', function(req, res) {
	var reqname = req.body.name,
		reqphone = req.body.phone,
		reqgender = req.body.gender;
	
	latLongSchemaModel.create({name:reqname,phone:reqphone,gender:reqgender,lat:0,lon:0}, function (err, success) {
		if (err) res.json(error);
			regSuccess.id=success._id;
			regSuccess.name=success.name;
			regSuccess.phone=success.phone;
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.json(regSuccess);
		});

		
});

router.get(/^(.+)$/, function(req, res) {
 res.sendfile('public/www/' + req.params[0]);
 });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);
app.use('/api.fmb', router);
app.use('/register.fmb', router);
app.use('/uploadimage.fmb', router);
app.use('/alertreq.fmb', router);
app.use('/afo.fmb', router);
app.use('/alertreqCancel.fmb', router);
app.use('/message.fmb', router);
app.use('/updateprofile.fmb', router);
app.use('/deleteprofile.fmb', router);
app.use('/getbuddys.fmb', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Track My Buddy Server Starts at : ' + port);