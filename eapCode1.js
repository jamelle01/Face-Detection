async function authorize(clientMac, apMac, ssidName, radioId, milliseconds) {
  // define authorization info
  const authInfo = {
    clientMac: clientMac,
    apMac: apMac,
    ssidName: ssidName,
    radioId: radioId,
    time: milliseconds,
    authType: 4
  };

  // get CSRF token
  const csrfToken = getCSRFToken();

  // define headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Csrf-Token": csrfToken
  };

  // define fetch options
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(authInfo),
    credentials: "include"
  };

  // make HTTP request using fetch function
  const res = await fetch(
    `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`,
    options
  );

  // parse response as JSON
  const resObj = await res.json();

  // check if authorization was successful
  if (resObj.errorCode === 0) {
    // authorized successfully
  }
}

// function to get CSRF token
function getCSRFToken() {
  // use filesystem module to read token from file
  const fs = require("fs");
  const token = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
  return token;
}