const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log('Starting server at ' + port);
});	
app.use(express .static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

/*app.get('/cookie_test', (req, res) => {
	res.cookie('userid','32345');
	res.cookie('userid2','26845');
	res.cookie('userid3','19321');
	res.send('cookie set...');
});	

app.get('/cookie_check', (req, res) => {
	res.send({'userid1' : req.cookies.userid1,
			  'userid2' : req.cookies.userid2,
			  'userid3' : req.cookies.userid3
	});
	console.log(req.cookies);
});*/

const database = new Datastore('database.db');
database.loadDatabase();
/*database.insert({name: 'Subham' , status: 'pissed'});
database.insert({name: 'Delphic' , status: 'asleep'});*/

app.get('/api', (request, response) => {
	var userid1 = request.cookies.userid1;
	var userid2 = request.cookies.userid2;
	
	database.find({ userid1: userid1, userid2: userid2 }, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
});

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
app.post('/api', (request, response) => {
	console.log('I got a request!');
	console.log(request.body);
	
	var userid1 = request.cookies.userid1;
	var userid2 = request.cookies.userid2;
	if(!(userid1 && userid2)){
		userid1 = makeid(10);
		userid2 = makeid(10);
		response.cookie('userid1',userid1);		
		response.cookie('userid2',userid2);		
	}	
	console.log(userid1);
	console.log(userid2);
	
	const timestamp = Date.now();
	request.body.timestamp = timestamp;
	request.body.userid1 = userid1;
	request.body.userid2 = userid2;
	database.insert(request.body);
	
	response.json(request.body);
});

app.get('/stwisedet/:statenum', async (request, response) => {
	const statenum = request.params.statenum;
	console.log(statenum);
	const api_url = 'https://api.covid19india.org/data.json';
	const fetch_response = await fetch(api_url);
	const json = await fetch_response.json();
	response.json(json.statewise[statenum]);
});	