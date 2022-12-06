// let data = null;
// const error = null;

// fetch("./sampledata.json") // fetch the fake data naa sa sample
//   .then((res) => {
//     if (!res.ok) {
//       // error coming back from server
//       throw Error("could not fetch the data for that resource");
//     }
//     return res.json();
//   })
//   .then((data) => {
//     setData(data);
//   })
//   .then(() => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
let user;
async function fetchWorkouts() {
  const response = await fetch("http://localhost:4001");
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
    console.log(user[i].username)
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

// function setData(d) {


function doFunction() {
  console.log("function");
  var t = false;
  var userd = document.getElementById("username").innerHTML;
  var pass = document.getElementById("pass").value;
  console.log(user);
  console.log(pass);
  for (let i = 0; i < user.length; i++) {
    if ((user[i].username).toLowerCase() == userd.toLowerCase()) {
      console.log("forloop");
      if (users[i].password == pass) {
        console.log("ok");
        t = true;
        window.location.href = "http://127.0.0.1:5500/index.html"; //redirect to login page
        break;
      }
    } else {
      t = false;
    }
    document.getElementById("pass").style.border = "none";
    document.getElementById("notif").innerText = "";
  }
  console.log(t);
  {
    !t && console.log("password not match");
    document.getElementById("pass").style.border = "thick solid  #ff0000";
    document.getElementById("notif").innerText = "password not match";
  }
  setTimeout(() => {}, 5000);
}

const fdfd = () => {
  console.log("wait");
};
