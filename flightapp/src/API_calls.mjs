const api_key = process.env.FLIGHT_API_KEY
const api_secret = process.env.API_SECRET
const base_url = process.env.BASE_URL 
/*
Before we can make API calls we must must get the access tokens
Our access tokens are located in API.env please make sure your launch.json files 
and packages.json files are updated appropriately 

* @param {null} - No arguments are provided to this function the api key/secret 
                  and base URL are taken directly from the global variables that 
                  source from the .env file

* @return {Promise<Object|null>} Token response JSON or null if failed.
*/
export async function get_Token(
) {
    //POST request for access token

    try {
        const response = await fetch(`${base_url}/v1/security/oauth2/token`, {
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
        return (token)

    } catch (error) {
        console.error("Failed to fetch token", error)
        return null
    }
}