const api_key = process.env.FLIGHT_API_KEY
const api_secret = process.env.API_SECRET
const base_url = process.env.BASE_URL 
/*
Before we can make API calls we must must get the access tokens
Our access keys are located in API.env please make sure your launch.json files 
and packages.json files are updated appropriately 

* @param {null} - No arguments are provided to this function the api key/secret 
                  and base URL are taken directly from the global variables that 
                  source from the .env file

* @return {Promise<Object|null>} Token response JSON or null if failed.
*/
export async function get_Token(

) {
    const token_extension = '/v1/security/oauth2/token`'
    //POST request for access token
    try {
        
        const response = await fetch(`${base_url}${token_extension}`, {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${api_key}&client_secret=${api_secret}`,
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const token = await response.json()
        console.log(token)
        return (token)

    } catch (error) {
        console.error("Failed to fetch token", error)
        return null
    }
}

/*
Function that checks if a value is null or undefined
*/
function isNotNullNorUndefined(
    value
) {
    return typeof value == "undefined" &&
        (typeof value == "object" || value == null)
}

/* 
This is the helper function associcated with the flight offer API call
The purpose of this function is to properly formate the json object to feed into the flight_offer function

@params
    currency: str - The currency code, as defined in ISO 4217, to reflect the currency in which this amount is expressed.
                    By default USD is assumed

    locations: list[tuple[destination: str ,arrival_date: str] 
            - A list of destinations in the order you will visit them the first value should be the start of your entire journey
              The location strings are specified in IATA Airline and Airport Code specifications 
              ex) Lester B. Pearson Internation has the code "YYZ" 
              A full list of codes can be found https://www.iata.org/en/publications/directories/code-search/
              Dates are strings formatted "YYYY-MM-DD""
              The departure day of the previous destination will be the same as the arival date of the new 
              But im giving the algorithm a 2 day window to look for flights so if we say we depart on july 3rd it will look for flights from july 1st to july 3rd that 
              get us to the destination on july 3rd
    
    travelersInput: list[tuple[id: str ,type: int, adultId: "str"]] - the number of travelers on this trip must be between 1-18. 
                                                                CHILD < 12y, HELD_INFANT < 2y, SEATED_INFANT < 2y, SENIOR >=60y, else adult
                                                                There cannot be more then 9 infants as each one must be accompanied by an adult
                                                                if the traveler is an infant the adultId parameter can be specified with 
                                                                the id value of an adult traveler to allow the infant to sit in the same seat as the adult
                                                                otherwise leave adultId as null

    sources: str - I have no idea what this is or what is does but this is an required parameter so im setting it to 'GDS' 

    origin: str - The airport you will start your trip at should be in a airport in the IATA Airline and Airport Code specifications 
                  ex) Lester B. Pearson Internation has the code "YYZ" 
                  A full list of codes can be found https://www.iata.org/en/publications/directories/code-search/
                                               
    arrival_flex: int - The flexablity of the arrival times this allows for a range of up to +/- X days around the arrival date (max 3)
                        This helps expand the number of flights that can be offered in case the dates cannot be lined up exactly

     


@returns
*/
export function flight_offer_helper(
    currency = "USD",
    locations,
    travelersInput,
    sourcesValue = ["GDS"],
    //searchCriteria
    maxPriceValue = 999999
    //pricingOptions
    refundableFareValue = null
    noRestrictionFareValue = null
    noPenaltyFareValue = null
    //flightFilters
    excludedCarrierCodesValue = null
    includedCarrierCodesValue = null
    nonStopPreferredValue = null
) {
    let flight_json
    let pricingOptionsIncluded = false
    let flightFiltersIncluded = false
    let connectionRestrictionIncluded = false
    //REQUIRED VALUES SECTION

    let homeAirport = locations[0]
    let tripItinerary = []
    //Handles the first location in the trip
    firstFlight = {
        "id": '1',
        "originLocationCode": locations[0][0],
        "destinationLocationCode": location[1][0],
        "departureDateTimeRange": {
            "date": locations[0][1],
            "dateWindow": "M2D"
        },
        "arrivalDateTimeRange": {
            "date": location[1][1]
        }
    }
    //Add flight from home airport to first destination
    tripItinerary.push(firstFlight)

    for (let i = 2; i < locations.length; i++) {
        let locationData = {
            "id": String(i),
            "originLocationCode": String(locations[i - 1][0]),
            "destinationLocationCode": String(locations[i][0]),
            "departureDateTimeRange": {
                "date": locations[i][1],
                "dateWindow": "M2D"
            },
            "arrivalDateTimeRange": {
                "date": location[i][1]
            }
        }
        tripItinerary.push(locationData)

    }

    let travelersList = []

    for (person in travelersInput) {
        let individual
        let idValue = person[0]
        let type = person[1]
        let assAdultId = person[2]

        if (isNotNullNorUndefined(assAdultId)) {
            individual = {
                "id": String(idValue),
                "travelerType": String(type),
                "associatedAdultId": String(assAdultId)
            }
        } else {
            individual = {
                "id": String(idValue),
                "travelerType": String(type)
            }
        }
        travelersList.push(individual)
    }

    flight_json = {
        "currencyCode": currency,
        "originDestinations": tripItinerary,
        "travelers": travelersList,
        "sources": sourcesValue,
        "searchCriteria": {
            "maxPrice": maxPriceValue,
        }
    }

    //OPTIONAL VALUES
    let pricingOptionsJSON = {}
    if (isNotNullNorUndefined(refundableFareValue)) {
        pricingOptionsJSON.refundableFare = refundableFareValue
        pricingOptionsIncluded = true
    }

    if (isNotNullNorUndefined(noRestrictionFareValue)) {
        pricingOptionsJSON.noRestrictionFare = noRestrictionFareValue
        pricingOptionsIncluded = true
    }

    if (isNotNullNorUndefined(noPenaltyFareValue)) {
        pricingOptionsJSON.noPenaltyFare = noPenaltyFareValue
        pricingOptionsIncluded = true
    }

    if (pricingOptionsIncluded) {
        flight_json.newkey = pricingOptions
        flight_json.searchCriteria.pricingOptions = pricingOptionsJSON
    }


    let carrierRestrictionsJSON = {}
    if (isNotNullNorUndefined(excludedCarrierCodesValue)) {
        carrierRestrictionsJSON.excludedCarrierCodes = excludedCarrierCodesValue
        flightFiltersIncluded = true
    }

    if (isNotNullNorUndefined(includedCarrierCodesValue)) {
        carrierRestrictionsJSON.includedCarrierCodes = includedCarrierCodesValue
        flightFiltersIncluded = true
    }

    if (flightFiltersIncluded) {
        flight_json.searchCriteria.flightFilters.carrierRestrictions = carrierRestrictionsJSON
    }

    let connectionRestrictionJSON = {}
    if (isNotNullNorUndefined(nonStopPreferredValue)) {
        connectionRestrictionJSON.nonStopPreferred = nonStopPreferredValue
        connectionRestrictionIncluded = true
    }

    if (connectionRestrictionIncluded) {
        flight_json.searchCriteria.flightFilters.connectionRestriction = connectionRestrictionJSON
    }

    return flight_json
}
/*
This is the function called to get flight offers

@params 

@returns
*/
export async function flight_offer(
    flightSearchJSON, 
) {
    const post_extension = "/shopping/flight-offers"
    try {
        const response = await fetch(`${base_url}${post_extension}`, {
            method: "POST",
            headers: "GET",
            body: JSON.stringify(flightSearchJSON),
        })
    } catch (error) {
        console.error("Failed to get the thing sorry", error)
        return null
    }
}

export async function choice_Predict(

) {

}