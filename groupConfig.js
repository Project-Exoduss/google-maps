const groupData = fetch("./groupData.json");

export const CONFIGURATION = {
	locations: groupData,

	mapOptions: {
		center: { lat: 0, lng: 0 },
		gestureHandling: "cooperative",
		fullscreenControl: true,
		mapTypeControl: false,
		streetViewControl: false,
		zoom: 8,
		zoomControl: true,
		maxZoom: 80,
		mapId: "b9f5280014bac665",
	},

	mapsApiKey: fetchKey(),
	capabilities: {
		input: true,
		autocomplete: true,
		directions: true,
		distanceMatrix: true,
		details: true,
		actions: false,
	},
};
