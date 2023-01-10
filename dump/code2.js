function authorize(clientMac, apMac, ssidName, radioId, milliseconds) {
  // Send user to authorize and the time allowed
  const authInfo = {
    clientMac: clientMac,
    apMac: apMac,
    ssidName: ssidName,
    radioId: radioId,
    time: milliseconds,
    authType: 4,
  };

  const csrfToken = getCSRFToken();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Csrf-Token": csrfToken,
  };

  const xhr = new XMLHttpRequest();

  // post
  xhr.open(
    "POST",
    `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`
  );

  // Set return to a value, not return to page
  xhr.responseType = "text";

  // Set up cookies.
  xhr.withCredentials = true;

  // Allow Self Signed Certs
  xhr.rejectUnauthorized = false;

  // API Call
  xhr.send(JSON.stringify(authInfo));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Csrf-Token", csrfToken);

  xhr.addEventListener("load", () => {
    const res = xhr.responseText;
    console.log(res);
    const resObj = JSON.parse(res);

    if (resObj.errorCode === 0) {
      // authorized successfully
    }
  });
}

function getCSRFToken() {
  const fs = new FileSystem();
  const file = fs.openFile(TOKEN_FILE_PATH, { create: true });
  if (!file) {
    console.error("Unable to open file!");
    return;
  }
  const token = file.read();
  file.close();
  return token;
}
