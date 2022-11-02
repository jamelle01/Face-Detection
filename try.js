let data = null;
const error = null;

fetch('./sampledata.json')
    .then(res => {
        if (!res.ok) { // error coming back from server
            throw Error('could not fetch the data for that resource');
        } 
        return res.json()
    })
    .then(data => {
        setData(data);
    })
    .then(()=>{
        console.log(data)
    })    
    .catch(err => {
        console.log(err);
    })

// document.getElementById("clickme").onclick = setTimeout(doFunction(), 1000);

document.querySelector("#clickme")
    .addEventListener('click', () => {
        doFunction();
    });
document.getElementById("pass")
    .addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          document.getElementById("clickme").click();
        }
      });



function setData(d){
    data = d;
    console.log("data stored")
}

function doFunction(){
    console.log("function")
    var t = false;
    var user = document.getElementById("username").innerHTML;
    var pass = document.getElementById("pass").value;
    console.log(user)
    console.log(pass)
    for(let i=0; i<data.users.length; i++){
        if(data.users[i].username == user){
            console.log("forloop")
            if(data.users[i].password == pass){
                console.log("ok")
                t = true;
                window.location.href = "http://127.0.0.1:5500/index.html"; //redirect to login page
                break;
            }
            
        }else{
            t = false;
        }
    }
    console.log(t)
    {!t && console.log("password not match")}
    setTimeout(() => {
        
    }, 5000);
    // 
}

const fdfd = ()=> {
    console.log("wait")
}

