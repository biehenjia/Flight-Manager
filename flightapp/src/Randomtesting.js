const { getToken, flightOfferHelper, flightOffer, hotelOfferByCity } = require("./API_calls.mjs");

let currentToken = null;
let tokenExpiryTime = null;

// Function to initialize the token
async function initializeToken() {
    try {
        // Fetch the token from your function (assumes it's async)
        currentToken = await getToken();

        if (currentToken) { tokenExpiryTime = Date.now() + currentToken.expires_in * 1000; return currentToken }
        return null
    } catch (error) {
        // Handle any errors that occur during the token fetch process
        console.error("Error in fetching token:", error.message || error);
        return null;
    }
}

// Function to get a valid token (if expired, re-fetch it)
async function getValidToken() {
    try {
        if (!currentToken || Date.now() >= tokenExpiryTime) return await initializeToken();
        return currentToken;
    } catch (error) {
        console.error("Error in getting a valid token:", error.message || error);
        return null;
    }
}

async function debugFlightOffer(token) {

    // Now proceed with making the flight offer request
    let locations1 = [["YYZ", "2025-11-12"], ["JFK", "2025-11-14"]];
    let peoples = [["1", "ADULT", null]];

    let flightTest = {
        "locations": locations1,
        "travelersInput": peoples,
        "currency": null,
        "sourcesValue": null,
        "maxPriceValue": null,
        "refundableFareValue": null,
        "noRestrictionFareValue": null,
        "noPenaltyFareValue": null,
        "excludedCarrierCodesValue": null,
        "includedCarrierCodesValue": null,
        "nonStopPreferredValue": null
    }

    // Prepare the flight search data
    let flightJSON = flightOfferHelper(flightTest);
    const returnJSON = await flightOffer(flightJSON, token);
    if (!returnJSON) return;
}

// debug Hotel Offer
async function debughotelOfferByCity(cityCode) {
    // Now proceed with making the hotel offer request

    // Make the hotel offer request
    const returnJSON = await hotelOfferByCity(cityCode);

    if (!returnJSON) return;
}

// Main function to demonstrate the flow
async function main() {
    try {
        // Ensure the token is valid (or fetch a new one if necessary)
        const token = await getValidToken();

        if (!token) return;

        debugFlightOffer(token)

        let cityCode = "PAR" // PAR for Paris
        debughotelOfferByCity(cityCode)

    } catch (error) {}
}

// Run the main function
main();