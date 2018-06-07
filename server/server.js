const http = require('http');
const fs = require('fs');
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const scraper = require('./scraper.js');

const hostname = '127.0.0.1';
const port = 8080;
const tracked_courses = [];

server.use(bodyParser.urlencoded({ extended: true })); 
server.use(cors({origin: 'http://localhost:3000'}));

server.get('/', (req, res) => res.send('Hello World!'));

server.get('/data', (req, res) => res.send("❤"));
// when the server receives a POST request to /scrape, execute the code

server.post('/scrape', async (req, res) => {
	const course_code = req.body.course;
	const subject = course_code.match(/[A-z]+/)[0].trim();
	const course_number = course_code.match(/\d+/)[0].trim();
	const results = await scraper.go_to_page(1179, subject, course_number);
	console.log(results);
});

server.post("/track", async (req, res) => {
	const course_code = req.body.course;
	const email = req.body.email;
	const subject = course_code.match(/[A-z]+/)[0].trim();
	const course_number = course_code.match(/\d+/)[0].trim();
	let course_info = {subject:subject, course_number:course_number, email:email};
	tracked_courses.push(course_info);
});

server.post("/remove", async (req, res) => {
	const course_code = req.body.course;
	const email = req.body.email;
	const subject = course_code.match(/[A-z]+/)[0].trim();
	const course_number = course_code.match(/\d+/)[0].trim();
	let course_info = {subject:subject, course_number:course_number, email:email};

	const len = tracked_courses.length();
	for (let i = 0; i < len; i++) {
		if (isEqual(tracked_courses[i], course_info)) {
			tracked_courses.splice(i, 1);
		}
	}
});

function isEqual(a, b) {
	try {
		if ((a.subject == b.subject) && (a.course_number == b.course_number) && (a.email == b.email)) {
			return true;
		} else {
			return false;
		}
	} catch (var e) {

	};
}

server.listen(port, () => console.log('Example server up on port 8080'));

// now is set to the current date in milliseconds since some date
function customSchedule() {
	var now = Date.now();

	//  1,800,000 is 30 minutes in milliseconds, so if an interval of 30 minutes has passed since that date, we trigger
	if (now % 1800000 <= 60000) {
		//const scraper = require('./scraper.js');
		//scraper.go_to_page(1179, 'CS', 136);
		console.log("trigger");
	}

	// fire the next time in 1min
	setTimeout(customSchedule, 1000 * 60);
}

customSchedule();