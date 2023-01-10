async function login() {
  // define login info
  const loginInfo = {
    name: OPERATOR_USER,
    password: OPERATOR_PASSWORD
  };

  // define headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  // define fetch options
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(loginInfo),
    credentials: "include"
  };

  // make HTTP request using fetch function
  const res = await fetch(
    `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`,
    options
  );

  // parse response as JSON
  const resObj = await res.json();

  // check if login was successful
  if (resObj.errorCode === 0) {
    // login successfully
    setCSRFToken(resObj.result.token);
  }
}

// function to save CSRF token
function setCSRFToken(token) {
  // use filesystem module to write token to file
  const fs = require("fs");
  fs.writeFileSync(TOKEN_FILE_PATH, token);
  return token;
}