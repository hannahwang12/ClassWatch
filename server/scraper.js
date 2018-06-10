const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const cheerio = require('cheerio');

const go_to_page = async function(term, subject, course_number) {
	const body = await nightmare
		.goto('http://www.adm.uwaterloo.ca/infocour/CIR/SA/under.html')
		.select('form > p:nth-child(13) > select', subject)
		.wait(3000)
		.type('form > p:nth-child(14) > input', course_number)
		.click('form input[type="submit"]:nth-child(1)')
		.wait('body > p:nth-child(4) > table')
		.evaluate(() => {
			return document.body.innerHTML;
		});
	const $ = cheerio.load(body, { lowerCaseTags: true});
	return scrape_data($, subject, course_number);
}

const scrape_data = async function($, subject, course_number) {
	const course_title = $('body > p:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(4)').text();
	const classes = $('table table > tbody > tr')
		.slice(1)
		.filter((index, row) => {
			const section = $(row)
				.find(':nth-child(2)')
				.text()
				.trim();
			const type = section.substring(0, 3);
			return (type != 'TST');
		})
		.map((index, row) => {
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
			};
		})
		.toArray();
	return classes;
}

exports.go_to_page = go_to_page;
exports.scrape_data = scrape_data;
