const http = require('http');
const fs = require('fs');
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const scraper = require('./scraper.js');
const firebase = require('firebase');
const events = require('events');
const nodemailer = require('nodemailer');

const hostname = '127.0.0.1';
const port = 8080;
let results;
let courses_to_scrape = new Array();
let em = new events.EventEmitter();

server.use(bodyParser.urlencoded({ extended: true })); 
server.use(cors({origin: 'http://localhost:3000'}));

// ------------------------
// FIREBASE
// ------------------------
// Gear icon in left sidebar > General > Add Firebase to your Web App
// Don't bother with config variable
// npm install firebase and import it
firebase.initializeApp({
  apiKey: "AIzaSyBI-v9SUhZ8NFZG5d1V46SHNnNu7zRSrsA",
  authDomain: "uwclasswatch.firebaseapp.com",
  databaseURL: "https://uwclasswatch.firebaseio.com",
  projectId: "uwclasswatch",
  storageBucket: "uwclasswatch.appspot.com",
  messagingSenderId: "968124232562"
});

// Reference to database, this is automatically the root
const tracked_courses = firebase.app().database().ref();

server.listen(port, () => console.log('Example server up on port 8080'));

//server.get('/', (req, res) => res.send('Hello World!'));
server.get('/', async (req, res) => {
	res.send("Welcome!")
})

server.post("/track", async (req, res) => {
	const sections = req.body.sections;
	const email = req.body.email;
	const name = req.body.course_name;
	const info = {name:name, sections:sections};
	let course_info = {email:email, info:info};
	console.log(course_info);
	tracked_courses.push(course_info);
});

/*
server.post("/remove", async (req, res) => {
	const course_code = req.body.course;
	const email = req.body.email;
	const subject = course_code.match(/[A-z]+/)[0].trim();
	const course_number = course_code.match(/\d+/)[0].trim();
	let course_info = {subject:subject, course_number:course_number, email:email};

	//let del_ref = admin.database().ref("")
});
*/

// uw.classwatch.notif@gmail.com
// UWclasswatch!

// ------------------------
// NODEMAILER
// ------------------------
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'uw.classwatch.notif@gmail.com',
		pass: 'UWclasswatch!'
	}
});

server.post('/scrape', async (req, res) => {
	const course_code = req.body.course;
	const subject = course_code.match(/[A-z]+/)[0].trim();
	const course_number = course_code.match(/\d+./)[0].trim();
	results = await scraper.go_to_page(1179, subject, course_number);
	em.emit("complete", null); //Emit the event that the get request is listening for
});

// When you get a request, call the Promise and send results when it's complete
server.get('/data', async (req, res) => {
	waitForEvent ( em, "complete" ).then( function() {
		res.send(results);
	});
});

// Given an eventEmitter and an eventType, this function returns a promise
// which resolves when the event happens
function waitForEvent( eventEmitter, eventType ) {
	return new Promise ( function( resolve ) {
		eventEmitter.once( eventType, resolve )
	})
};

function contains( elem, array ) {
	let len = array.length;
	for (var i = 0 ; i < len ; ++i) {
		if (array[i] === elem) {
			return true;
		}
	}
	return false;
}

function checkCourses() {
	courses_to_scrape = new Array();
	tracked_courses.once('value', async function(data) {	
		data.forEach(function(elem) {
			var course = {email:elem.val().email, name:elem.val().info.name, sections:elem.val().info.sections};
			courses_to_scrape.push(course);
		});
		var length = courses_to_scrape.length;
		
		for (var i = 0; i < length; ++i) {
			const subject = courses_to_scrape[i].name.match(/[A-z]+/)[0].trim();
			const course_number = courses_to_scrape[i].name.match(/\d+./)[0].trim();
			let temp_results = await scraper.go_to_page(1179, subject, course_number);

			// iterate through each element of results and check if sections contains it
			// this is more efficient since we only go through results one time and sections array is gonna be small so iterating through it a lot should be ok
			// gonna be bad if we're watching a lot of sections though
			var results_len = temp_results.length;
			for (var j = 0; j < results_len; ++j) {
				if (contains(temp_results[j].section, courses_to_scrape[i].sections)) {
					if (temp_results[j].reserve == null && (temp_results[j].enrol_total < temp_results[j].enrol_cap)) {
						const mailOptions = {
							from: 'uw.classwatch.notif@gmail.com',
							to: courses_to_scrape[i].email,
							subject: "There's space for you in " + courses_to_scrape[i].name + ": " + temp_results[j].section,
							text: 'Current capacity is: ' + temp_results[j].enrol_total + '/' + temp_results[j].enrol_cap
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('email sent');
							}
						});
					} else if (temp_results[j] != null && (temp_results[j].reserve_enrol_total < temp_results[j].reserve_enrol_cap)) {
						const mailOptions = {
							from: 'uw.classwatch.notif@gmail.com',
							to: courses_to_scrape[i].email,
							subject: "There's space for you in " + courses_to_scrape[i].name + ": " + temp_results[j].section,
							text: 'Current capacity is: ' + temp_results[j].reserve_enrol_total + '/' + temp_results[j].reserve_enrol_cap
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Sent an email to: ' + mailOptions.to);
							}
						});
					}
				}
			}
		}

	});
}

// now is set to the current date in milliseconds since some date
function customSchedule() {
	var now = Date.now();

	//  1,800,000 is 30 minutes in milliseconds, so if an interval of 30 minutes has passed since that date, we trigger
	if (now % 1800000 <= 60000) {
		//const scraper = require('./scraper.js');
		//scraper.go_to_page(1179, 'CS', 136);
		checkCourses();
		//checkCourses();
	}

	// fire the next time in 1min
	setTimeout(customSchedule, 1000 * 60);
}

customSchedule();