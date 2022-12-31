let user;
// var clientMac = getQueryStringKey("clientMac");
// var apMac = getQueryStringKey("apMac");
// // var gatewayMac = getQueryStringKey("gatewayMac") || undefined;
// var ssidName = getQueryStringKey("ssidName") || undefined;
// var redirectUrl = getQueryStringKey("redirectUrl") || undefined;
// var radioId = !!getQueryStringKey("radioId")
//   ? Number(getQueryStringKey("radioId"))
//   : undefined;

console.log("i tried");

async function fetchWorkouts() {
  const response = await fetch(
    "https://face-recognition-backend.adaptable.app/"
  );
  const json = await response.json();
  if (response.ok) {
    user = await json.map((user) => {
      let container = {};
      container.username = user.username;
      container.password = user.password;

      return container;
    });
    console.log(user);
  }
}

Promise.all([fetchWorkouts()]).then(() => {
  for (let i = 0; i < users.length; i++) {
    console.log(user[i].username);
  }
});

document.querySelector("#clickme").addEventListener("click", () => {
  doFunction();
});
document.getElementById("pass").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("clickme").click();
  }
});

async function doFunction() {
  console.log("function");
  var t = false;
  var userd = document.getElementById("username").innerHTML;
  var pass = document.getElementById("pass").value;
  console.log(user);
  console.log(pass);
  for (let i = 0; i < user.length; i++) {
    if (user[i].username.toLowerCase() == userd.toLowerCase()) {
      console.log("forloop");
      if (users[i].password == pass) {
        console.log("ok");
        t = true;
        // window.location.href = "./second/index.html"; //redirect to login page
        break;
      }
    } else {
      t = false;
    }
    document.getElementById("pass").style.border = "none";
    document.getElementById("notif").innerText = "";
  }
  console.log(t);
  if (t) {
    // await fetchController();
    // console.log(clientMac);
    // console.log(apMac);
    // console.log(ssidName);
    // console.log(radioId);
    // console.log(redirectUrl);
    // window.location.href = `${redirectUrl}`; //redirect to login page/
    // authorize();
    login();
  }
  {
    !t && console.log("password not match");
    if (!t) {
      document.getElementById("pass").style.border = "thick solid  #ff0000";
      document.getElementById("notif").innerText = "password not match";
    }
  }
  setTimeout(() => {}, 5000);
}

const CONTROLLER = "192.168.100.80";
const PORT = "8043";
const CONTROLLER_ID = "93575f5c1d2898597019560a983a0794";

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
    `https://192.168.0.115:8043/53477786b5ff63adf8978a17cb6d79c6/api/v2/hotspot/login`
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

function getQueryStringKey(key) {
  return getQueryStringAsObject()[key];
}

function getQueryStringAsObject() {
  e;
  var b,
    cv,
    e,
    k,
    ma,
    sk,
    v,
    r = {},
    d = function (v) {
      return decodeURIComponent(v);
    }, //# d(ecode) the v(alue)
    q = window.location.search.substring(1), //# suggested: q = decodeURIComponent(window.location.search.substring(1)),
    s = /([^&;=]+)=?([^&;]*)/g; //# original regex that does not allow for ; as a delimiter:   /([^&=]+)=?([^&]*)/g
  ma = function (v) {
    if (typeof v != "object") {
      cv = v;
      v = {};
      v.length = 0;
      if (cv) {
        Array.prototype.push.call(v, cv);
      }
    }
    return v;
  };
  while ((e = s.exec(q))) {
    b = e[1].indexOf("[");
    v = d(e[2]);
    if (b < 0) {
      k = d(e[1]);
      if (r[k]) {
        r[k] = ma(r[k]);
        Array.prototype.push.call(r[k], v);
      } else {
        r[k] = v;
      }
    } else {
      k = d(e[1].slice(0, b));
      sk = d(e[1].slice(b + 1, e[1].indexOf("]", b)));
      r[k] = ma(r[k]);
      if (sk) {
        r[k][sk] = v;
      } else {
        Array.prototype.push.call(r[k], v);
      }
    }
  }
  return r;
}
