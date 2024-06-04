const fs = require("fs");
const Airtable = require("airtable");
require("dotenv").config();

const API_KEY =
	"patD81Rz0YeB7GvKH.dbb58b694f38811445c012c8a4547135aae0efaa4ef5c7d8dc98090d8fe9d346";
const BASE_ID = "appb47pyO7iVnORcl"; // Update with your base ID
const TABLE_NAME = "Groups"; // Update with your table name

const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

base(TABLE_NAME)
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
			console.log("Most recent record:", mostRecentRecord.fields);

			const selectedFields = {
				title: mostRecentRecord.fields.GroupName,
				url: mostRecentRecord.fields.squareLogoLookup[0].url,
				address1: mostRecentRecord.fields.Location,
				address2: mostRecentRecord.fields.shortLocation,
				startTime: mostRecentRecord.fields.startDate.slice(11, 16),
				endTime: mostRecentRecord.fields.endDate.slice(11, 16),
				day: mostRecentRecord.fields.Day,
				email: mostRecentRecord.fields.contactEmail,
				coords: {
					lat: parseFloat(mostRecentRecord.fields.LatCoords),
					lng: parseFloat(mostRecentRecord.fields.LongCoords),
				},
				placeId: mostRecentRecord.fields.PlaceID,
			};
			// console.log(selectedFields);
			updateJSONFile(selectedFields);
		} else {
			console.log("No records found.");
		}
	});

function updateJSONFile(selectedFields) {
	// Read JSON file
	const rawData = fs.readFileSync("groupData.json");
	let jsonData = JSON.parse(rawData);

	// Update JSON content with the most recent record
	jsonData.push({ ...selectedFields });
	console.log(jsonData);

	// Write updated JSON content back to file
	fs.writeFileSync("groupData.json", JSON.stringify(jsonData, null, 2));
}
