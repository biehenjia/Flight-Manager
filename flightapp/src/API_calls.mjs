const api_key = import.meta.env.VITE_FLIGHT_API_KEY
const api_secret = import.meta.env.VITE_API_SECRET
const base_url = import.meta.env.VITE_BASE_URL
const flight_version = import.meta.env.VITE_VERSION_FLIGHT
const hotel_version = import.meta.env.VITE_VERSION_HOTEL

/*
Before we can make API calls we must must get the access tokens
Our access keys are located in API.env please make sure your launch.json files 
and packages.json files are updated appropriately 

* @param {null} - No arguments are provided to this function the api key/secret 
                  and base URL are taken directly from the global variables that 
                  source from the .env file

* @return {Promise<Object|null>} Token response JSON or null if failed.
*/
export async function getToken(

) {
    const token_extension = '/v1/security/oauth2/token'
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

@params - None

@returns - boolean that indicates if the value is un
*/
function isNotNullNorUndefined(
    value
) {
    return value !== null && value !== undefined
}

/* 
This is the helper function associcated with the flight offer API call
The purpose of this function is to properly formate the json object to feed into the flight_offer function

@params Takes a single JSON object with the following 

    {
    locations*
    travelersInput*
    currency
    sourcesValue
    maxPriceValue
    refundableFareValue
    noRestrictionFareValue
    noPenaltyFareValue
    excludedCarrierCodesValue
    includedCarrierCodesValue
    nonStopPreferredValue
    }

    VALUES WITH * ARE REQURED OTHER INPUTS HAVE DEFAULT ARGUMENTS PROVIDED

    currency: str - The currency code, as defined in ISO 4217, to reflect the currency in which this amount is expressed.
                    By default USD is assumed

    locations: list[tuple[destination: str ,arrival_date: str] 
            - A list of destinations in the order you will visit them the first value should be the start of your entire journey
              The location strings are specified in IATA Airline and Airport Code specifications 
              ex) Lester B. Pearson Internation has the code "YYZ" 
              A full list of codes can be found https://www.iata.org/en/publications/directories/code-search/
              Dates are strings formatted "YYYY-MM-DD""
              But im giving the algorithm a 3 day window to look for flights 
              if we want to arrive at the new destination on july 3rd the departure date from the previous location will
              be july 3 but the query will find all flights from july 1 to july 3 that can get us to our destination on july 3rd
    
    travelersInput: list[tuple[id: str ,type: int, adultId: "str"]] - the number of travelers on this trip must be between 1-18. 
                                                                THE TYPE MUST BE ONE OF THE FOLLOWING
                                                                CHILD < 12y, HELD_INFANT < 2y, SEATED_INFANT < 2y, SENIOR >=60y, else ADULT
                                                                There cannot be more then 9 infants as each one must be accompanied by an adult
                                                                if the traveler is an infant the adultId parameter can be specified with 
                                                                the id value of an adult traveler to allow the infant to sit in the same seat as the adult
                                                                otherwise leave adultId as null

    sources: str - I have no idea what this is or what is does but this is an required parameter so im setting it to 'GDS' 
                                               
    maxPriceValue: int - The max price of a flight I have it set to 999999 by default

    refundableFareValue: bool  - If true, returns the flight-offers with refundable fares only

    noRestrictionFareValue: bool - If true, returns the flight-offers with no restriction fares only
     
    noPenaltyFareValue: bool - If true, returns the flight-offers with no penalty fares only

    excludedCarrierCodesValue: list[str] - This option ensures that the system will only consider these airlines.
                                           MAX length 99 
                                           Uses IATA codes to specify airlines
                                           A full list of codes can be found https://www.iata.org/en/publications/directories/code-search/

    includedCarrierCodesValue: list[str] - This option ensures that the system will only consider these airlines.
                                           MAX length 99 
                                           Uses IATA codes to specify airlines
                                           A full list of codes can be found https://www.iata.org/en/publications/directories/code-search/

    nonStopPreferredValue: bool - When this option is requested, recommendations made of Non-Stop flights only are favoured by the search, 
                                  on the whole itinerary, with a weight of 75%.

@returns
*/
export function flightOfferHelper(
    /*
    locations,
    travelersInput,
    currency = "USD",
    sourcesValue = ["GDS"],
    //searchCriteria
    maxPriceValue = 999999,
    //pricingOptions
    refundableFareValue = null,
    noRestrictionFareValue = null,
    noPenaltyFareValue = null,
    //flightFilters
    excludedCarrierCodesValue = null,
    includedCarrierCodesValue = null,
    nonStopPreferredValue = null
    */
   flightInfo
) {
    let flight_json
    let pricingOptionsIncluded = false
    let flightFiltersIncluded = false
    let connectionRestrictionIncluded = false
    let money = "USD"
    let source = ["GDS"]
    let maxPrice = 999999
    //REQUIRED VALUES SECTION

    //GENERATES THE TRIP LOCATION INPUT

    let homeAirport = flightInfo.locations[0]
    let tripItinerary = []
    //Handles the first location in the trip
    let firstFlight = {
        "id": '1',
        "originLocationCode": flightInfo.locations[0][0],
        "destinationLocationCode": flightInfo.locations[1][0],
        "arrivalDateTimeRange": {
            "date": flightInfo.locations[1][1],
            "dateWindow": "I3D"
        }
    }
    //Add flight from home airport to first destination
    tripItinerary.push(firstFlight)

    for (let i = 2; i < flightInfo.locations.length; i++) {
        let locationData = {
            "id": String(i),
            "originLocationCode": String(flightInfo.locations[i - 1][0]),
            "destinationLocationCode": String(flightInfo.locations[i][0]),
            "arrivalDateTimeRange": {
                "date": flightInfo.locations[i][1],
                "dateWindow": "I3D"
            }
        }
        tripItinerary.push(locationData)

    }

    //GENERATES TRAVELERS LIST INPUT
    let travelersList = []

    for (let person of flightInfo.travelersInput) {
        let individual
        let idValue = person[0]
        let type = person[1]
        let assAdultId = person[2]
        //debugger
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

    //OPTIONAL VALUES

    //GENERATES CURRENCY DEFAULTS TO USD
    if (isNotNullNorUndefined(flightInfo.currency)) {
        money = flightInfo.currency
    }
    //GENERATES SOURCES DEFAULTS TO ['GSD']
    if (isNotNullNorUndefined(flightInfo.sourcesValue)) {
        source = flightInfo.sourcesValue
    }
    //GENERATES MAX PRICE
    if (isNotNullNorUndefined(flightInfo.maxPriceValue)) {
        maxPrice = flightInfo.maxPriceValue
    }

    //Sets values in JSON obj
    flight_json = {
        "currencyCode": money,
        "originDestinations": tripItinerary,
        "travelers": travelersList,
        "sources": source,
        "searchCriteria": {
            "maxPrice": maxPrice,
        }
    }

    let pricingOptionsJSON = {}
    if (isNotNullNorUndefined(flightInfo.refundableFareValue)) {
        pricingOptionsJSON.refundableFare = refundableFareValue
        pricingOptionsIncluded = true
    }

    if (isNotNullNorUndefined(flightInfo.noRestrictionFareValue)) {
        pricingOptionsJSON.noRestrictionFare = noRestrictionFareValue
        pricingOptionsIncluded = true
    }

    if (isNotNullNorUndefined(flightInfo.noPenaltyFareValue)) {
        pricingOptionsJSON.noPenaltyFare = noPenaltyFareValue
        pricingOptionsIncluded = true
    }

    if (pricingOptionsIncluded) {
        flight_json.newkey = pricingOptions
        flight_json.searchCriteria.pricingOptions = pricingOptionsJSON
    }


    let carrierRestrictionsJSON = {}
    if (isNotNullNorUndefined(flightInfo.excludedCarrierCodesValue)) {
        carrierRestrictionsJSON.excludedCarrierCodes = excludedCarrierCodesValue
        flightFiltersIncluded = true
    }

    if (isNotNullNorUndefined(flightInfo.includedCarrierCodesValue)) {
        carrierRestrictionsJSON.includedCarrierCodes = includedCarrierCodesValue
        flightFiltersIncluded = true
    }

    if (flightFiltersIncluded) {
        flight_json.searchCriteria.flightFilters.carrierRestrictions = carrierRestrictionsJSON
    }

    let connectionRestrictionJSON = {}
    if (isNotNullNorUndefined(flightInfo.nonStopPreferredValue)) {
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
export async function flightOffer(flightSearchJSON, token) {
    const postExtension = "/shopping/flight-offers";
    try {
        const response = await fetch(`${base_url}${flight_version}${postExtension}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.access_token}`,
            },
            body: JSON.stringify(flightSearchJSON),
        });

        // Check if the response is OK (status 2xx)
        if (!response.ok) {
            // Log the status and the response text to get more context on the error
            const errorText = await response.text();
            throw new Error(`Failed to fetch flight offers, status: ${response.status}, message: ${errorText}`);
        }

        // Parse the response as JSON
        const flightOffers = await response.json();
        // console.log('Flight Offers:', flightOffers);
        return flightOffers;

    } catch (error) {
        // Log the error with the detailed message
        console.error("Failed to get the flight offers:", error.message || error);
        return null;  // Return null if the request fails
    }
}

/*
This is the function called to get hotel offers by city code

@params 

@returns
*/


// IMPORTANT NOTE FOR HOTEL SEARCH: !!!!!!!!
// basically you need to first search to discover an area or hotel by chain (which is more cumbersone)
// abd then you get a list of valid hotels by id that you can find
// idk why this is the case but amadeus chose to do it like this
export async function hotelOfferByCity(cityCode) {
    try {
        const token = await getToken()
        if (!token) return []

        const discoveryUrl = `${base_url}/v1/reference-data/locations/hotels/by-city?cityCode=${encodeURIComponent(cityCode)}&radius=5&radiusUnit=KM&hotelSource=ALL`
        const resp = await fetch(discoveryUrl, { headers: { Authorization: `Bearer ${token.access_token}` } })
        if (!resp.ok) return []
        const json = await resp.json().catch(() => null)
        const candidates = (json && (json.data || json.hotels || json.results || json)) || []
        return Array.isArray(candidates)
            ? candidates.map(i => i?.hotel?.hotelId || i?.hotelId || i?.id).filter(Boolean)
            : []
    } catch (e) {
        return []
    }
}

export async function hotelsSearch({ location, checkIn, checkOut, adults = 1, max = 10 }) {
    try {
        if (!location || !checkIn || !checkOut) throw new Error('location, checkIn, checkOut required')
        const token = await getToken()
        if (!token) throw new Error('Failed to get token')

        const cityCode = /^[A-Za-z]{3}$/.test(location) ? location.toUpperCase() : null
        if (!cityCode) throw new Error('Only 3-letter city codes supported (e.g. PAR)')

        // discovery
        const discoveryUrl = `${base_url}/v1/reference-data/locations/hotels/by-city?cityCode=${encodeURIComponent(cityCode)}&radius=5&radiusUnit=KM&hotelSource=ALL`;
        const discResp = await fetch(discoveryUrl, { headers: { Authorization: `Bearer ${token.access_token}` } });
        const discText = await discResp.text();
        let discJson = null;
        try { discJson = discText ? JSON.parse(discText) : null } catch { discJson = discText }
        if (!discResp.ok) {
            throw new Error(`Discovery failed: ${discResp.status} ${discText}`)
        }

        const candidates = discJson && (discJson.data || discJson.hotels || discJson.results || discJson) || []
        const hotelIds = Array.isArray(candidates)
            ? candidates.map(item => (item?.hotel?.hotelId || item?.hotelId || item?.id)).filter(Boolean)
            : []

        if (!hotelIds.length) return { data: [] }

        // always cap to 10 results
        const limit = Math.min(10, Math.max(1, Number(max || 10)))
        const idsToUse = hotelIds.slice(0, Math.min(hotelIds.length, limit))
        const hotelIdsParam = idsToUse.join(',')

        const q = new URLSearchParams({ hotelIds: hotelIdsParam, checkInDate: checkIn, checkOutDate: checkOut, adults: String(adults) })
        q.set('page[limit]', String(limit))
        const v3Url = `${base_url}/v3/shopping/hotel-offers?${q.toString()}`
        const v3Resp = await fetch(v3Url, { headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' } })
        if (!v3Resp.ok) return { data: [] }
        const v3Json = await v3Resp.json().catch(() => null)
        if (v3Json && Array.isArray(v3Json.data)) v3Json.data = v3Json.data.slice(0, limit)
        return v3Json || { data: [] }
    } catch (err) {
        return { data: [] }
    }
}