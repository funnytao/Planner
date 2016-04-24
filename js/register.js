var authusername = "";
var loggedin = false;
var userid;
var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
var url = "https://boiling-heat-4273.firebaseio.com/web/planner/users/";

// Toggle login/register options

var loginWindow = document.querySelector("#tologin");
var regWindow = document.querySelector("#toreg");
var regUsernameInput = document.querySelector("#regusername");

loginWindow.onclick = function() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("username").focus();
};

regWindow.onclick = function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("regusername").focus();
};

// Account Information Vanlidation

var submitLogin = document.querySelector("#login-button");
var submitReg = document.querySelector("#register-button");

var firstPasswordInput = document.querySelector("#firstPassword");
var secondPasswordInput = document.querySelector("#secondPassword");

function IssueTracker() {
  this.issues = [];
}

IssueTracker.prototype = {
  add: function (issue) {
    this.issues.push(issue);
  },
  retrieve: function () {
    var message = "";
    switch (this.issues.length) {
      case 0:
        // do nothing because message is already ""
        break;
      case 1:
        message = "Please correct the following issue:\n" + this.issues[0];
        break;
      default:
        message = "Please correct the following issues:\n" + this.issues.join("\n");
        break;
    }
    return message;
  }
};

var usernameError = "";
var emailError = "";
var firstInputIssuesTracker = new IssueTracker();
var secondInputIssuesTracker = new IssueTracker();

$("#regusername").on("input", usernameValid);

function usernameValid() {
    var regusername = regUsernameInput.value;
    usernameError = regusername===""? "Username cannot be empty!" : "";
    usernameError = regusername.match(/[^A-z0-9]/g)? "Cannot contains elements other than letters and numbers." : usernameError;
    var userdata = new Firebase(url);
    userdata.once("value", function(snapshot) {
        snapshot.forEach(function(smallshot) {
//            console.log("here: "+smallshot.child("username").val()+"  "+regusername);
            if (smallshot.child("username").val()!=="" && smallshot.child("username").val()===regusername) {
                usernameError = "Username Already Exists.";
            }
        });
    }).then(function() {
        if (usernameError.length>0) {
            $("#regusername").attr("title", usernameError)
                            .tooltip("fixTitle")
                            .tooltip("setContent")
                            .tooltip({trigger: "focus"})
                            .tooltip("show");
            $("#regusername").css("background-color", "rgb(247, 215, 216)");
        }
        else {
            $("#regusername").tooltip("hide");
            $("#regusername").removeAttr("title");
            $("#regusername").css("background-color", "white");
        }
//        console.log(usernameError);
    });
}

$("#email").on("input", emailValid);

function emailValid() {
    var re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    var emailAddress = document.getElementById("email").value;
//    emailError = re.test(emailAddress)? "" : "Email address is not valid.";
    emailError = emailAddress===""? "Email cannot be empty!" : "";
    emailError = emailAddress.search(re)!==-1? emailError : "Email address is not valid.";
    var userdata = new Firebase(url);
    userdata.once("value", function(snapshot) {
        snapshot.forEach(function(smallshot) {
//            console.log("here: "+smallshot.child("email").val()+"  "+emailAddress);
            if (smallshot.child("email").val()!=="" && smallshot.child("email").val()===emailAddress) {
                emailError = "Email Already Exists.";
            }
        });
    }).then(function() {
        if (emailError.length>0) {
            $("#email").attr("title", emailError)
                            .tooltip("fixTitle")
                            .tooltip("setContent")
                            .tooltip({trigger: "focus"})
                            .tooltip("show");
            $("#email").css("background-color", "rgb(247, 215, 216)");
        }
        else {
            $("#email").tooltip("hide");
            $("#email").removeAttr("title");
            $("#email").css("background-color", "white");
        }
//        console.log(emailError);
    });
}

$("#firstPassword").on("input", firstPasswordValid);

function firstPasswordValid() {
    var firstPassword = firstPasswordInput.value;
    firstInputIssuesTracker = new IssueTracker();
    (function checkRequirements() {
        if (firstPassword.length < 8) {
          firstInputIssuesTracker.add("Fewer than 8 characters.");
        } 
        else if (firstPassword.length > 100) {
          firstInputIssuesTracker.add("Greater than 100 characters.");
        }

        if (!firstPassword.match(/\d/g)) {
          firstInputIssuesTracker.add("Missing a number.");
        }

        if (!firstPassword.match(/[a-z]/g)) {
          firstInputIssuesTracker.add("Missing a lowercase letter.");
        }

        if (!firstPassword.match(/[A-Z]/g)) {
          firstInputIssuesTracker.add("Missing an uppercase letter.");
        }
        var illegalCharacterGroup = firstPassword.match(/[^A-z0-9\!\@\#\$\%\^\&\*]/g);
        if (illegalCharacterGroup) {
            illegalCharacterGroup.forEach(function (illegalChar) {
                firstInputIssuesTracker.add("Contains an illegal character: " + illegalChar+".");
            });
        }
    }());
    
    var firstInputIssues = firstInputIssuesTracker.retrieve();
//    console.log(firstInputIssues);
    //firstPasswordInput.setCustomValidity(firstInputIssues);
    if (firstInputIssues.length>0) {
        $("#firstPassword").attr("title", firstInputIssues)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
        $("#firstPassword").css("background-color", "rgb(247, 215, 216)");
    }
    else {
        $("#firstPassword").tooltip("hide");
        $("#firstPassword").removeAttr("title");
        $("#firstPassword").css("background-color", "white");
    }
}

$("#secondPassword").on("input", secondPasswordValid);

function secondPasswordValid() {
    var secondPassword = secondPasswordInput.value;
    secondInputIssuesTracker = new IssueTracker();
    
    if (secondPassword!==firstPasswordInput.value) {
        secondInputIssuesTracker.add("Passwords not matched.");
    }
    
    var secondInputIssues = secondInputIssuesTracker.retrieve() || "";
//    console.log("["+secondInputIssues+"]");
    if (secondInputIssues.length>0) {
//        console.log("still...");
        $("#secondPassword").attr("title", secondInputIssues)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
        $("#secondPassword").css("background-color", "rgb(247, 215, 216)");
    }
    else {
        $("#secondPassword").tooltip("hide");
        $("#secondPassword").removeAttr("title");
        $("#secondPassword").css("background-color", "white");
    }
}

submitReg.onclick = function() {
//    console.log("clicked sign up");
    submitReg.setCustomValidity("");
    usernameValid();
    firstPasswordValid();
    secondPasswordValid();
    if (secondInputIssuesTracker.issues.length+firstInputIssuesTracker.issues.length===0 && usernameError==="" && emailError==="") {
//        console.log("OK for now");
        ref.createUser({
            email    : document.querySelector("#email").value,
            password : secondPasswordInput.value
        }, function(error, userData) {
            if (error) {
//                console.log(error);
            } 
            else {
//                console.log("Successfully created user account with uid:", userData.uid);
                new Firebase(url).child(userData.uid).set({
                    username: regUsernameInput.value,
                    email: document.getElementById("email").value,
                    job: document.getElementById("job").value || "unfilled",
                    events: []
                });
                ref.authWithPassword({
                    email    : document.getElementById("email").value,
                    password : secondPasswordInput.value
                }, function(error, authData) {
                    if (error) {
//                        console.log(error);
                    }
                    else {
//                        console.log("Authenticated successfully with payload:", authData.uid);
                        authusername = regUsernameInput.value;
                        showComponents();
                    }
                });
            }
        });
    }
    else {
//        console.log("eeeeeeeerror");
        submitReg.setCustomValidity("Please Validate Your Information.");
    }
};

var loginuserError = "";
var loginpassError = "";

$("#username").on("input", loginuserValid);

function loginuserValid() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var loginusername = document.getElementById("username").value;
    loginuserError = loginusername===""? "Email cannot be empty!" : "";
    var userdata = new Firebase(url);
    userdata.once("value", function(snapshot) {
        var exist = false;
        snapshot.forEach(function(smallshot) {
            if (smallshot.child("email").val()!=="" && smallshot.child("email").val()===loginusername) {
                exist = true;
            }
        });
        if (!exist && loginusername!=="") {
            loginuserError = "Account does not exists.";
        }
    }).then(function() {
        if (loginuserError.length>0) {
            $("#username").attr("title", loginuserError)
                            .tooltip("fixTitle")
                            .tooltip("setContent")
                            .tooltip({trigger: "focus"})
                            .tooltip("show");
            $("#username").css("background-color", "rgb(247, 215, 216)");
        }
        else {
            $("#username").tooltip("hide");
            $("#username").removeAttr("title");
            $("#username").css("background-color", "white");
        }
//        console.log(loginuserError);
    });
}

$("#password").on("input", loginpassValid);

function loginpassValid(errortext) {
    var loginpassword = document.getElementById("password").value;
    loginpassError = loginpassword==="" ? "Please enter your password." : errortext;
    if (loginpassError.length>0) {
        $("#password").attr("title", loginpassError)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
        $("#password").css("background-color", "rgb(247, 215, 216)");
    }
    else {
        $("#password").tooltip("hide");
        $("#password").removeAttr("title");
        $("#password").css("background-color", "white");
    }
}

// Login Validation
submitLogin.onclick = function() {
//    console.log("login validation");
    loginuserValid("");
    loginpassValid("");
    if (loginuserError.length===0 && loginpassError.length===0) {
        ref.authWithPassword({
            email    : document.querySelector("#username").value,
            password : document.querySelector("#password").value
        }, function(error, authData) {
            if (error) {
//                console.log(error);
                loginpassValid("Password is not correct.");
            }
            else {
//                console.log("Authenticated successfully with payload:", authData.uid);
                //alert("Welcome "+document.querySelector("#username").value+"!");
                userid = authData.uid;
                new Firebase(url+authData.uid+"/username").once("value", function(snapshot) {
                    authusername = snapshot.val();
                    console.log(authusername);
                }).then(function(){
                    showComponents();
                });
            }
        });
    }
};

function showComponents() {
//    console.log(authusername);
    document.querySelector(".welcome").style.display = "none";
    document.querySelector(".showEvents").style.display = "block";
    document.getElementById("authusername").innerHTML = authusername;
    $(".welcome input").tooltip("destroy");
    showEvents();
}

$(".welcome input").tooltip({ selector: "[title]",
                      placement: "bottom",
                      trigger: "focus",
                      animation: false}); 

//$(document).tooltip({ selector: "[title]",
//                      placement: "bottom",
//                      trigger: "focus",
//                      animation: false}); 