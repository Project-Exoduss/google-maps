const fs = require("fs");
const Airtable = require("airtable");
require("dotenv").config();

const base = new Airtable({ apiKey: process.env.APIKEY }).base(
	"appb47pyO7iVnORcl"
);
let title;
let url;
let address1;
let address2;
let startTime;
let endTime;
let day;
let email;
let latCoords;
let longCoords;
let placeID;
// base("Groups").find("rec3Rjhb6ybyhoA8V", function (err, record) {
// 	if (err) {
// 		console.error(err);
// 		return;
// 	} else {
// 		console.log(record);
// 	}
// 	console.log("Retrieved", record.id);
// });
base("Groups")
	.select({
		sort: [{ field: "CreatedDate/Time", direction: "desc" }],
		maxRecords: 1,
	})
	.firstPage((err, records) => {
		if (err) {
			console.error("Error fetching records:", err);
			return;
		}
		if (records.length > 0) {
			const mostRecentRecord = records[0];
			const fields = mostRecentRecord.fields;
			title = fields.GroupName;
			url = fields.logoLookup[0].url;
			address1 = fields.Location;
			address2 = fields.shortLocation;
			startTime = fields.startDate.slice(11, 16);
			endTime = fields.endDate.slice(11, 16);
			day = fields.Day;
			email = fields.contactEmail;
			latCoords = fields.LatCoords;
			longCoords = fields.LongCoords;
			placeID = fields.PlaceID;

			const rawData = fs.readFileSync("groupData.json");
			let jsonData = JSON.parse(rawData);
			// console.log(jsonData);
			jsonData.push({
				title: title,
				url: url,
				address1: address1,
				address2: address2,
				startTime: startTime,
				endTime: endTime,
				day: day,
				email: email,
				coords: { lat: parseInt(latCoords), lng: parseInt(longCoords) },
				placeId: placeID,
			});

			fs.writeFileSync("groupData.json", JSON.stringify(jsonData, null, 2));

			console.log(jsonData[jsonData.length - 1]);
		} else {
			console.log("No records found.");
		}
	});
