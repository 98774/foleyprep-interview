//Part 1: Function to fetch data from the Data Endpoints
/*
    Parameters:
        url: The url to fetch data from
            type: String
*/
async function getJsonData(url){
    var data = await fetch(url)
    .then(response => response.json());
    return data;
};

//Part 2: Function to calculate remain sessions and mocks 
/*
    Parameters:
        users: A list of user objects 
            type: Array[Object]
        sessions: A list of session objects 
            type: Array[Object]
    
    Returns: An object containing user ids, and session and mock counts
        type: Array[Object]

 */
function calculateRemaining(users, sessions){
    //Define the possible types for the records; this guarentees we only look for valid types
    const _session_types = Object.freeze({"Session":"sessions", "Mock":"mocks"})
    //Initialize user counts
    users.forEach(user => {
        user["sessions"] = 0; 
        user["mocks"] = 0;
        user["purchased"].forEach((purchase) => {
            if("sessions" in purchase){
                user["sessions"] += purchase["sessions"]
            }
            if("mocks" in purchase){
                user["mocks"] += purchase["mocks"]
            }
        })
    })

    //Iterate through each session in the sessions data
    sessions.forEach((session) => {
        if(!("visits" in session)){
            return; //No visitors so nothing to do
        }

        if(!("type" in session)){
            console.error("Session has no type!");
            return; //Skip to next element of forEach
        }

        //Attempt to update counts; Handles errors where id is not defined
        var sessionType = _session_types[session.type];
        session.visits.forEach((visitorID) => {
            try {
                var user = users.find(user => user._id === visitorID);
                //Validate the user has enough to decrement
                if(user[sessionType] > 0){
                    user[sessionType] -= 1; //Decrement from the existing count
                } else {
                    console.log("User " + user.name + " has no " + session.type + "s left!");
                }
            } catch(e){
                console.error("Invalid")
            }
        })
    })

    return true; //Potential success/failure modes
}


//Code to demonstrate functions
//asyncronously get data
var users, sessions;
var users_promise = getJsonData('https://dev.foleyprep.com/interview/2023/november/task3/users')
var sessions_promise = getJsonData('https://dev.foleyprep.com/interview/2023/november/task3/sessions')

//wait for all promises to complete
Promise.all([users_promise, sessions_promise])
    .then((values) => {
        users = values[0]["users"];
        sessions = values[1]["sessions"]
        //Update users structure to contain session and mock counts
        calculateRemaining(users, sessions)    
        users.forEach((user) => { 
            var countString = `<div>User ${user.name} has ${user.sessions} sessions and ${user.mocks} mocks remaining</div>`;
            document.getElementById("remaining-counts").innerHTML += countString; 
        })
    })

