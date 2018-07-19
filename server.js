const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const scraper = require('./scraper.js');
const firebase = require('firebase');
const events = require('events');
const nodemailer = require('nodemailer');
const moment = require('moment');

const url = "http://classwatch.ca-central-1.elasticbeanstalk.com";

const port = process.env.PORT || 8080;
let em = new events.EventEmitter();

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
const tracked_courses = firebase.app().database().ref().child("tracked_courses");
const verify_links = firebase.app().database().ref().child("verify_links");

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

// Heroku deployment
server.use(bodyParser.urlencoded({ extended: true })); 
server.use(cors({origin: 'http://localhost:3000'}));
server.listen(port);

server.post("/track", async (req, res) => {
	const sections = req.body.sections;
	const len = sections.length;
	const email = req.body.email;
	const name = req.body.course_name;
	const min = 10000000000000;
	const max = 99999999999999;
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	// Gonna have a problem if two of the same keys are ever generated


	for (var i = 0; i < len; ++i) {
		verify_links.child(num).child(name).child(sections[i]).push(email);
	// tracked_courses.child("custom_key").setValue("custom value")
	}

	let sectionStr = "";
	for (var i = 0; i < len; ++i) {
		sectionStr += (sections[i] + ", ");
	}

	send_verification(email, name, sectionStr.slice(0, -2), num);
	/*
	const sections = req.body.sections;
	const len = sections.length;
	const email = req.body.email;
	const name = req.body.course_name;

	for (var i = 0; i < len; ++i) {
		tracked_courses.child(name).child(sections[i]).push(email);
	}
	*/
	res.sendStatus(200);
});

server.post("/remove", async (req, res) => {
	let remove_info = req.body.code.split('|');
	let del_ref = firebase.app().database().ref().child(remove_info[1]).child(remove_info[2]).child(remove_info[0]);	
	del_ref.remove();
	res.sendStatus(200);
});

server.post('/scrape', async (req, res) => {
	const term = req.body.term;
	const course_code = req.body.course;
	const subject = course_code.match(/[A-z]+/) ? course_code.match(/[A-z]+/)[0].trim() : null;
	const course_number = course_code.match(/\d+./) ? course_code.match(/\d+./)[0].trim() : null;
	const results = await scraper.go_to_page(term, subject, course_number);
	em.emit("complete", results); //Emit the event that the get request is listening for
	// this event is global, causing the search conflicts
	res.sendStatus(200);
});

// When you get a request, call the Promise and send results when it's complete
server.get('/data', async (req, res) => {
	/*
	waitForEvent ( em, "complete" ).then( function( results ) {
		res.send(results);
	});
	*/
	em.once("complete", function( results ) {res.send(results)});
});

server.get('/verify', async (req, res) => {
	verify_links.once('value', async function(data) {
		waiting_links = Object.keys(data.val());

		if (contains_elem(req.query.hash, waiting_links) != -1) {
			moveFbRecord(verify_links.child(req.query.hash), tracked_courses);
		}
	})
});

server.use(express.static(path.join(__dirname, 'client/build')));
server.use(favicon(path.join(__dirname, 'client/public/favicon.ico')));

// Given an eventEmitter and an eventType, this function returns a promise
// which resolves when the event happens
/*
function waitForEvent( eventEmitter, eventType ) {
	return new Promise ( function( resolve ) {
		eventEmitter.once( eventType, resolve(results) )
	});
};
*/

function moveFbRecord(oldRef, newRef) {    
     oldRef.once('value', function(snap)  {
          newRef.update( snap.val(), function(error) {
               if( !error ) {  oldRef.remove(); }
               else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}

function send_verification( email, name, sections, num ) {
	const link = "http://localhost:8080/verify?hash=" + num;
	const mailOptions = {
								from: 'uw.classwatch.notif@gmail.com',
								to: email,
								subject: "Verify your choice!",
								html: `<p style="font-size: 16px">You have requested to watch the following sections of ` + name + `: ` + sections + `</p>
									  <p style="font-size: 15px">Please <a href=` + link + `>click on the link</a> to verify your email.</p>
									  <p><a href='http://classwatch.ca-central-1.elasticbeanstalk.com/'>ClassWatch</a> works by scraping UWaterloo's publicly available enrolment numbers, which are updated every half hour between 8:00am and 8:00pm. This application is entirely student-run and continuously being updated so please send us your
									  feedback by replying to this email.</p>`,
							};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		}
	});
}


function contains_elem( elem, array ) {
	let len = array.length;
	for (var i = 0 ; i < len ; ++i) {
		if (array[i] === elem) {
			return i;
		}
	}
	return -1;
}

function checkCourses() {
	var course_names = new Array();
	var course_info = new Array();
	tracked_courses.once('value', async function(data) {
		course_names = Object.keys(data.val());
		// returns an array of all keys
		data.forEach(function(elem) {
			course_info.push(elem.val());
		});
		var num_courses = course_names.length;

		// For each course you have to scrape
		for (var i = 0; i < num_courses; ++i) {
			const subject = course_names[i].match(/[A-z]+/)[0].trim();
			const course_number = course_names[i].match(/\d+./)[0].trim();
			let temp_results = await scraper.go_to_page(1179, subject, course_number);
			var num_sections = temp_results.length;

			// The section names are the keys of the course object
			var sections_to_check = Object.keys(course_info[i]);

			// For each section in the course you scraped
			for (var j = 0; j < num_sections; ++j) {
				var contains = contains_elem(temp_results[j].section, sections_to_check);
				// If the section in the course exists in the array of sections that are being watched
				if (contains != -1) {
					var remove_codes = new Array();
					var emails = new Array();

					// Construct two arrays, one with the keys (removal codes), and one with the emails
					Object.keys(course_info[i][ sections_to_check[contains].toString() ]).forEach(function (key) {
						remove_codes.push(key);
						emails.push(course_info[i][ sections_to_check[contains].toString() ][ key.toString() ]);
					})

					var emails_len = emails.length;
					if (temp_results[j].reserve == null && (temp_results[j].enrol_total < temp_results[j].enrol_cap)) {
						for (var n = 0; n < emails_len; ++n) {
							const mailOptions = {
								from: 'uw.classwatch.notif@gmail.com',
								to: emails[n],
								subject: "There's space for you in " + course_names[i] + ": " + sections_to_check[contains] + "!",
								html: `<p style="font-size: 16px">The enrolment capacity for this class is currently ` + temp_results[j].enrol_total + `/` + temp_results[j].enrol_cap + `.
									  \nTo stop receiving notifications about this class, enter your removal code at http://classwatch.ca-central-1.elasticbeanstalk.com/.</p>
									  <p style="font-size: 15px">Your code for this class is: ` + remove_codes[n] + `|` + course_names[i] + `|` + sections_to_check[contains] + `</p>
									  <p><a href='http://classwatch.ca-central-1.elasticbeanstalk.com/'>ClassWatch</a> works by scraping UWaterloo's publicly available enrolment numbers, which are updated every half hour between 8:00am and 8:00pm. This application is entirely student-run and continuously being updated so please send us your
									  feedback by replying to this email.</p>`,
							};

							transporter.sendMail(mailOptions, function(error, info){
								if (error) {
									console.log(error);
								}
							});

						}
					} else if (temp_results[j] != null && (temp_results[j].reserve_enrol_total < temp_results[j].reserve_enrol_cap)) {
						for (var n = 0; n < emails_len; ++n) {
							const mailOptions = {
								from: 'uw.classwatch.notif@gmail.com',
								to: emails[n],
								subject: "There's space for you in " + course_names[i] + ": " + sections_to_check[contains],
								html: `<p style="font-size: 16px">The enrolment capacity for this class is currently ` +  temp_results[j].reserve_enrol_total + `/` + temp_results[j].reserve_enrol_cap + `.
									  \nTo stop receiving notifications about this class, enter your removal code at http://classwatch.ca-central-1.elasticbeanstalk.com/.</p>
									  <p style="font-size: 15px">Your code for this class is: ` + remove_codes[n] + `|` + course_names[i] + `|` + sections_to_check[contains] + `</p>
									  <p><a href='http://classwatch.ca-central-1.elasticbeanstalk.com/'>ClassWatch</a> works by scraping UWaterloo's publicly available enrolment numbers, which are updated every half hour between 8:00am and 8:00pm. This application is entirely student-run and continuously being updated so please send us your
									  feedback by replying to this email.</p>`,
							};

							transporter.sendMail(mailOptions, function(error, info){
								if (error) {
									console.log(error);
								}
							});
						}
					}
				}
			}
		}
	});
}

// now is set to the current date in milliseconds since some date
function customSchedule() {
	let hours = moment().hours();
	let minutes = moment().minutes();

	//  1,800,000 is 30 minutes in milliseconds, so if an interval of 30 minutes has passed since that date, we trigger
	if (hours >= 8 && hours <= 20 && minutes % 30 <= 1) {
		checkCourses();
	}

	// Fire the next time in 1min
	// setTimeout(customSchedule, 1000 * 60);
}

setInterval(customSchedule, 1000 * 60);


/*
server.post("/track", async (req, res) => {
	/*
	const sections = req.body.sections;
	const email = req.body.email;
	const name = req.body.course_name;
	const info = {name:name, sections:sections};
	let course_info = {email:email, info:info};
	tracked_courses.push(course_info);
	// tracked_courses.child("custom_key").setValue("custom value")
})

function checkCourses() {
	courses_to_scrape = new Array();
	keys = new Array();
	tracked_courses.once('value', async function(data) {	
		data.forEach(function(elem) {
			var course = {email:elem.val().email, name:elem.val().info.name, sections:elem.val().info.sections};
			courses_to_scrape.push(course);
			var temp_arr = data.val();
			keys = Object.keys(temp_arr);
			console.log(keys);
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
							text: 'Current capacity is: ' + temp_results[j].enrol_total + '/' + temp_results[j].enrol_cap + '. Your removal code is: ' + keys[i] + '|' + courses_to_scrape[i] + '|' + temp_results[j].section
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
							text: 'Current capacity is: ' + temp_results[j].reserve_enrol_total + '/' + temp_results[j].reserve_enrol_cap + '. Your removal code is: ' + keys[i] + '|' + courses_to_scrape[i] + '|' + temp_results[j].section
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
*/