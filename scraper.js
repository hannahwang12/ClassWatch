const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const cheerio = require('cheerio');
const request = require('request');
const Promise = require('bluebird');

const go_to_page = async function(term, subject, course_number) {
	const headers = {
		Origin: 'http://www.adm.uwaterloo.ca',
		'Content-Type': 'application/x-www-form-urlencoded',
		Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
	}
	const form = {
		level: 'under',
		sess: term,
		subject: subject,
		cournum: course_number,
	};
	const body = await Promise.fromCallback((cb) => request.post({
		url: 'http://www.adm.uwaterloo.ca/cgi-bin/cgiwrap/infocour/salook.pl', 
		form,
		headers, 
	}, (err, res, body) => cb(null, body)));
	// const body = await nightmare
	// 	.goto('http://www.adm.uwaterloo.ca/infocour/CIR/SA/under.html')
	// 	.select('form > select', term)
	// 	.select('form > p:nth-child(13) > select', subject)
	// 	.type('form > p:nth-child(14) > input', course_number)
	// 	.click('form input[type="submit"]:nth-child(1)')
	// 	.wait('body > p:nth-child(4) > table')
	// 	.evaluate(() => {
	// 		return document.body.innerHTML;
	// 	});
	// if (/sorry, but your query had no matches/i.test(body)) {
	// 	return [{
	// 		course_code: `${subject} ${course_number}`,
	// 		term,
	// 	}];
	// }
	const $ = cheerio.load(body, { lowerCaseTags: true});
	return scrape_data($, term, subject, course_number);
}

const scrape_data = async function($, term, subject, course_number) {
	const course_title = $('body > p:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(4)').text();
	let first_result = true;
	const classes = $('table table:first-of-type > tbody > tr')
		.slice(1)
		.filter((index, row) => {
			const section = $(row)
				.find(':nth-child(2)')
				.text()
				.trim();
			if (section == 'Comp Sec') {
				first_result = false;
			}
			const type = section.substring(0, 3);
			return /*(type != 'TST') &&*/ first_result;
		})
		.map((index, row) => {
			if ($(row).find('i').text().indexOf('Reserve') >= 0) {
				const reserve = $(row).find('i').text();
				const reserve_enrol_cap = $(row)
					.find(':nth-child(2)')
					.text()
					.trim();
				const reserve_enrol_total = $(row)
					.find(':nth-child(3)')
					.text()
					.trim();
				let section;
				let i = 0;
				while (!(/[A-Z]{3} \d{3}/.test(section))) {
					section = $(`table table > tbody > tr:nth-child(${index + 1 - i})`)
						.find(':nth-child(2)')
						.text()
						.trim();
					i++;
				}
				const instructor_lastname = $(row)
					.find(':nth-child(8)')
					.text()
					.split(',')[0]
					.trim();
				let instructor_firstname = '';
				if (instructor_lastname != '') {
					instructor_firstname = $(row)
						.find(':nth-child(8)')
						.text()
						.split(',')[1]
						.trim();
				}
				console.log(instructor_firstname);
				const time_and_days = $(row)
					.find(':nth-child(6)')
					.text()
					.trim();
				const time = time_and_days.substring(0, 11);
				const days = time_and_days
					.substring(11)
					.match(/([A-Z][a-z]*)/g);
				const date = time_and_days.match(/\d\d\/\d\d/);
				return {
					section: `${section} RES${i}`,
					reserve,
					reserve_enrol_cap,
					reserve_enrol_total,
					instructor: `${instructor_firstname} ${instructor_lastname}`,
					time,
					days,
					date,
				};
			}
			const section = $(row)
				.find(':nth-child(2)')
				.text()
				.trim();
			const type = section.substring(0, 3);
			const instructor_lastname = $(row)
				.find(':nth-child(13)')
				.text()
				.split(',')[0]
				.trim();
			let instructor_firstname = '';
			if (instructor_lastname != '') {
				instructor_firstname = $(row)
					.find(':nth-child(13)')
					.text()
					.split(',')[1]
					.trim();
			}
			const enrol_cap = $(row)
				.find(':nth-child(7)')
				.text()
				.trim();
			const enrol_total = $(row)
				.find(':nth-child(8)')
				.text()
				.trim();
			const wait_cap = $(row)
				.find(':nth-child(9)')
				.text()
				.trim();
			const wait_total = $(row)
				.find(':nth-child(10)')
				.text()
				.trim();
			const campus = $(row)
				.find(':nth-child(3)')
				.text()
				.trim();
			const location = $(row)
				.find(':nth-child(12)')
				.text()
				.trim();
			const time_and_days = $(row)
				.find(':nth-child(11)')
				.text()
				.trim();
			const time = time_and_days.substring(0, 11);
			const days = time_and_days
				.substring(11)
				.match(/([A-Z][a-z]*)/g);
			const date = time_and_days.match(/\d\d\/\d\d/);
			return {
				course_code: `${subject} ${course_number}`,
				course_title,
				section,
				type,
				instructor: `${instructor_firstname} ${instructor_lastname}`,
				enrol_cap,
				enrol_total,
				location,
				time,
				days,
				date,
				term,
			};
		})
		.toArray();
	return classes;
}

exports.go_to_page = go_to_page;
exports.scrape_data = scrape_data;
