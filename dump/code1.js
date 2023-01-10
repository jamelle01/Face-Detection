// First, we define an object with the login information that we will send to the Omada Controller.
// The "name" field contains the value of the constant OPERATOR_USER, which represents the user name to use for login.
// The "password" field contains the value of the constant OPERATOR_PASSWORD, which represents the password to use for login.
const loginInfo = {
    name: OPERATOR_USER,
    password: OPERATOR_PASSWORD
};

// Next, we define an object with the HTTP headers that we will send with the login request.
// The "Content-Type" header specifies the content type as "application/json", and the "Accept" header specifies that we accept a response with the content type of "application/json".
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
};

// We create a new XMLHttpRequest object using the XMLHttpRequest constructor.
const xhr = new XMLHttpRequest();

// We set the "rejectUnauthorized" option of the XMLHttpRequest object to false.
// This tells the XMLHttpRequest object to allow self-signed SSL certificates.
xhr.rejectUnauthorized = false;

// We set up an event listener for the "load" event, which is fired when the request is complete.
xhr.addEventListener("load", () => {
    // We decode the JSON response from the Omada Controller using JSON.parse().
    // This creates a JavaScript object that we can access using dot notation (e.g. resObj.errorCode).
    const resObj = JSON.parse(xhr.responseText);

    // If the login was successful (indicated by an errorCode of 0), we call the setCSRFToken() function with the token from the response as an argument.
    // This function writes the token to a file specified by the constant TOKEN_FILE_PATH.
    if (resObj.errorCode === 0) {
        setCSRFToken(resObj.result.token);
    }
});

// We open the login API endpoint of the Omada Controller using the open() method, specifying the HTTP method as "POST" and the endpoint URL.
// The endpoint URL is specified using the constants CONTROLLER, PORT, and CONTROLLER_ID.
xhr.open("POST", `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`);

// We set the request headers using the setRequestHeader() method.
Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));

// We send the login request using the send() method, passing the JSON-encoded loginInfo object as the request body.
xhr.send(JSON.stringify(loginInfo));

// The setCSRFToken() function takes a single argument, which is the CSRF token to save to a file.
function setCSRFToken(token) {
    // We create a new FileSystem object using the FileSystem constructor.
    const fs = new FileSystem();

    // We open the file specified by the constant TOKEN_FILE_PATH using the openFile() method.
    // If the file cannot be opened, we print an error message and exit the function.
    const file = fs.openFile(TOKEN_FILE_PATH, { create: true });
    if (!file) {
        console.error("Unable to open file!");
        return;
    }

    // We write the token to the file using the write() method.
    file.write(token);

    // We close the file using the close() method.
    file.close();

    // We return the token as the function result.
    return token;
}

// This code is used to log in to the Omada Controller, a wireless network management system made by TP-Link, and save the CSRF token that is returned in the login response to a file. The CSRF token is used to prevent cross-site request forgery attacks, which is a type of web security vulnerability that allows an attacker to send unauthorized requests to a web application on behalf of a user. By including the CSRF token in the HTTP header of subsequent requests to the Omada Controller, we can verify that the requests are coming from an authenticated user.

// To use this code, you will need to define the constants OPERATOR_USER, OPERATOR_PASSWORD, CONTROLLER, PORT, and CONTROLLER_ID with the appropriate values for your Omada Controller. You will also need to specify the path to the file where you want to save the CSRF token using the constant TOKEN_FILE_PATH.