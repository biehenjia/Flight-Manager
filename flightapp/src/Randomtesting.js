const { getToken, flightOfferHelper, flightOffer, hotelOfferByCity } = require("./API_calls.mjs");

let currentToken = null;
let tokenExpiryTime = null;

// Function to initialize the token
async function initializeToken() {
    try {
        // Fetch the token from your function (assumes it's async)
        currentToken = await getToken();

        if (currentToken) {
            // Set the expiry time (typically expires_in is in seconds)
            tokenExpiryTime = Date.now() + currentToken.expires_in * 1000;
            console.log("Token successfully fetched:", currentToken.access_token);
            return currentToken;
        } else {
            console.error("Failed to fetch token.");
            return null;
        }
    } catch (error) {
        // Handle any errors that occur during the token fetch process
        console.error("Error in fetching token:", error.message || error);
        return null;
    }
}

// Function to get a valid token (if expired, re-fetch it)
async function getValidToken() {
    try {
        if (!currentToken || Date.now() >= tokenExpiryTime) {
            console.log("Token expired or not available, fetching a new one...");
            return await initializeToken();  // Re-fetch the token
        }
        return currentToken;
    } catch (error) {
        console.error("Error in getting a valid token:", error.message || error);
        return null;
    }
}




// debug Flight Offer
async function debugFlightOffer(token) {
    // Now proceed with making the flight offer request
    let locations1 = [["YYZ", "2025-11-01"], ["JFK", "2025-11-01"]];
    let peoples = [["1", "ADULT", null]];

    // Prepare the flight search data
    let flightJSON = flightOfferHelper(locations1, peoples);
    console.log(flightJSON)
    // Make the flight offer request
    const returnJSON = await flightOffer(flightJSON, token);

    if (!returnJSON) {
        console.error("No flight offers returned.");
        return;
    }
    debugger
    // Log the flight offers
    console.log("Flight offers:", JSON.toString(returnJSON));
}

// debug Hotel Offer
async function debughotelOfferByCity(cityCode) {
    // Now proceed with making the hotel offer request

    // Make the hotel offer request
    const returnJSON = await hotelOfferByCity(cityCode);

    if (!returnJSON) {
        console.error("No hotel offers returned.");
        return;
    }
    debugger
    // Log the Hotel offers
    console.log("Hotel offers:", JSON.toString(returnJSON));
}

// Main function to demonstrate the flow
async function main() {
    try {
        // Ensure the token is valid (or fetch a new one if necessary)
        const token = await getValidToken();

        if (!token) {
            console.error("Could not obtain a valid token.");
            return; // Exit if the token is not available
        }

<<<<<<< HEAD
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
        console.log(flightJSON)
        // Make the flight offer request
        const returnJSON = await flightOffer(flightJSON, token);

        if (!returnJSON) {
            console.error("No flight offers returned.");
            return;
        }
        debugger
        // Log the flight offers
        console.log("Flight offers:", JSON.toString(returnJSON));
=======
        debugFlightOffer(token)

        let cityCode = "PAR" // PAR for Paris
        debughotelOfferByCity(cityCode)
>>>>>>> 58ff9821cdcdb7e455bda2af2c1e877c03345a27

    } catch (error) {
        // Handle any errors in the main flow
        console.error("Error in main function:", error.message || error);
    }
}

// Run the main function
main();