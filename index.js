const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.listen(5000, () => console.log('listening at 5000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();
/*database.insert({name: 'Subham' , status: 'pissed'});
database.insert({name: 'Delphic' , status: 'asleep'});*/

app.get('/api', (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
});

app.post('/api', (request, response) => {
	console.log('I got a request!');
	console.log(request.body);
	
	const timestamp = Date.now();
	request.body.timestamp = timestamp;
	database.insert(request.body);
	
	response.json(request.body);
});

app.get('/weather/:statenum', async (request, response) => {
	const statenum = request.params.statenum;
	console.log(statenum);
	const api_url = 'https://api.covid19india.org/data.json';
	const fetch_response = await fetch(api_url);
	const json = await fetch_response.json();
	response.json(json.statewise[statenum]);
});	