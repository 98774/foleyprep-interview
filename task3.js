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
    //Define the possible types for the records
    //Determine initial counts for each user
    data.forEach(user => {
        user["Session"] = 0; 
        user["Mock"] = 0;

    })

    //Iterate through each session in the sessions data
    sessions.forEach((session) => {
        if(!session.hasOwnProperty("visits")){
            return; //No visitors so nothing to do
        }

        if(!session.hasOwnProperty("type")){
            console.error("Session has no type!");
            return; //Skip to next element of forEach
        }

        var sessionType = _sessionTypes[session.type];

        //Attempt to update counts; Handles errors where id is not defined
        session.visits.forEach((visitorID) => {
            try {
                var user = users.find(user => user._id === visitorID)[0];
                console.log("USER: ", user)
                user[sessionType] -= 1; //Decrement from the existing count
            } catch(e){
                console.error("Invalid")
            }
        })

    })
}

//Step 1: Get user and session data
//  1a: Process user data to more useful form
var users; //Final object to store _id, name, sessions, mocks
var users_raw = getJsonData('https://dev.foleyprep.com/interview/2023/november/task3/users')

var sessions = getJsonData('https://dev.foleyprep.com/interview/2023/november/task3/sessions')

//wait for all promises to complete
Promise.all([users_raw, sessions]).then(
    (values) => console.log(values)
)

//Step 2: Build User object with current counts for all users

//Step 2: Update user counts depending on session records


//Step 3: Print out the functions
//document.getElementById("records-remaining").innerHTML("")

