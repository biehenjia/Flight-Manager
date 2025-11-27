import { v4 as uuidv4 } from 'uuid';
export class end_user {
    //This class stores info about each end user and their flight history and associated flights
    //properties of this class
        // uuid: A string that uniquely identifies the customer
        // fname: A string of the first name of customer
        // lname: A string fo the last name of customer
        // flight_history: A list of JSON objects of past flights
        // hotel_history: A list of JSON objects of past hotel stays
    constructor(first_name, last_name) {
        this.uuid = uuidv4()
        this.fname = first_name
        this.lname = last_name
        this.flight_history = []
        this.hotel_history = []
    }

    /*
    Updates this.flight_history with a new value

    @params 
        {
            start: the airport code of the starting airport
            end: the airport code of the end airport
            date: the date of the flight
            price: the cost of this flight
        }    

    @returns - None
    */
    append_flight(flight_JSON) {

        let new_len_flight = this.flight_history.length + 1

        try {
            if (this.flight_history.push(flight_JSON) == new_len_flight) {
                //pass
            } else {
                throw new Error(f`Failed to append ${JSON.stringify(flight_JSON)}`)
            }
        } catch (error) {
            console.error(error)
        }

        this.save_file()
    }

    /*
    Updates this.hotel_history with a new value
    */
    append_hotel(hotel_JSON) {
        let new_len_hotel = this.hotel_history.length + 1

        try {
            if (this.hotel_history.push(hotel_JSON) == new_len_hotel) {
                //pass
            } else {
                throw new Error(f`Failed to append ${JSON.stringify(hotel_JSON)}`)
            }
        } catch(error) {
            console.error(error)
        }

        this.save_file()
    }
    /*
    This method searching for a txt file that has the UUID matching that of the current obj and overwrites it with updated info
    */ 
    save_file() {

    }
} 