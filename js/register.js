var loggedin = false;
var userid;
var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
var url = "https://boiling-heat-4273.firebaseio.com/web/planner/users/";

// Toggle login/register options

var loginWindow = document.querySelector('#tologin');
var regWindow = document.querySelector('#toreg');
var regUsernameInput = document.querySelector('#regusername');

loginWindow.onclick = function() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById("username").focus();
};

regWindow.onclick = function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById("regusername").focus();
};

// Account Information Vanlidation

var submitLogin = document.querySelector('#login-button');
var submitReg = document.querySelector('#register-button');

var firstPasswordInput = document.querySelector('#firstPassword');
var secondPasswordInput = document.querySelector('#secondPassword');

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
var dupuser = false;

$("#regusername").on('input', function(){
    dupuser = false;
    var regusername = regUsernameInput.value;
    //var usernameError = "";
    usernameError = regusername.match(/[^A-z0-9]/g)? "Cannot contains elements other than letters and numbers." : "";
    var userdata = new Firebase(url);
    userdata.once("value", function(snapshot) {
        snapshot.forEach(function(smallshot) {
            if (smallshot.child("username").val()===regusername) {
                dupuser = true;
                usernameError = "Username Already Exists.";
            }
        });
    });
    if (usernameError.length>0) {
        $('#regusername').attr('title', usernameError)
                        .tooltip('fixTitle')
                        .tooltip('setContent')
                        .tooltip({trigger: "focus"})
                        .tooltip('show');
        $('#regusername').css('background-color', 'rgb(247, 215, 216)');
    }
    else {
        $('#regusername').tooltip('hide');
        $('#regusername').removeAttr("title");
        $('#regusername').css('background-color', 'white');
    }
    console.log(usernameError);
    regUsernameInput.setCustomValidity("");
});

$("#firstPassword").on('input', function(){
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
    console.log(firstInputIssues);
    //firstPasswordInput.setCustomValidity(firstInputIssues);
    if (firstInputIssues.length>0) {
        $('#firstPassword').attr('title', firstInputIssues)
                        .tooltip('fixTitle')
                        .tooltip('setContent')
                        .tooltip({trigger: "focus"})
                        .tooltip('show');
        $('#firstPassword').css('background-color', 'rgb(247, 215, 216)');
    }
    else {
        $('#firstPassword').tooltip('hide');
        $('#firstPassword').removeAttr("title");
        $('#firstPassword').css('background-color', 'white');
    }
});

$("#secondPassword").on('input', function(){
    var secondPassword = secondPasswordInput.value;
    secondInputIssuesTracker = new IssueTracker();
    
    if (secondPassword!==firstPasswordInput.value) {
        secondInputIssuesTracker.add("Passwords not matched.");
    }
    
    var secondInputIssues = secondInputIssuesTracker.retrieve() || "";
    console.log("["+secondInputIssues+"]");
    if (secondInputIssues.length>0) {
        console.log("still...");
        $('#secondPassword').attr('title', secondInputIssues)
                        .tooltip('fixTitle')
                        .tooltip('setContent')
                        .tooltip({trigger: "focus"})
                        .tooltip('show');
        $('#secondPassword').css('background-color', 'rgb(247, 215, 216)');
    }
    else {
        $('#secondPassword').tooltip('hide');
        $('#secondPassword').removeAttr("title");
        $('#secondPassword').css('background-color', 'white');
    }
    //secondPasswordInput.setCustomValidity(secondInputIssues);
});

submitReg.onclick = function() {
    submitReg.setCustomValidity("");
    if (secondInputIssuesTracker.issues.length+firstInputIssuesTracker.issues.length===0 && usernameError==="" && !dupuser) {
        ref.createUser({
            email    : document.querySelector('#email').value,
            password : secondPasswordInput.value
        }, function(error, userData) {
            if (error) {
                alert(error);
//                submitReg.setCustomValidity(error);
                //console.log("Error creating user:", error);
            } 
            else {
                console.log("Successfully created user account with uid:", userData.uid);
                new Firebase(url).child(userData.uid).set({
                    username: regUsernameInput.value,
                    events: []
                });
                alert("Account Created!");
                loggedin = true;
                showComponents();
            }
        });
    }
    else if (dupuser) {
        console.log("dup");
        regUsernameInput.setCustomValidity("Username has already been used.");
    }
    else {
        console.log("eeeeeeeerror");
        submitReg.setCustomValidity("Please Validate Your Information.");
    }
};

// Login Validation
submitLogin.onclick = function() {
    console.log("clicked");
    var logsuc = false;
    ref.authWithPassword({
        email    : document.querySelector('#username').value,
        password : document.querySelector('#password').value
    }, function(error, authData) {
        if (error) {
            alert(error);
//            submitLogin.setCustomValidity(error);

            //setTimeout(function(){submitLogin.setCustomValidity(error);}, 500);
        }
        else {
            console.log("Authenticated successfully with payload:", authData.uid);
            //alert("Welcome "+document.querySelector('#username').value+"!");
            userid = authData.uid;
            loggedin = true;
            showComponents();
        }
    });
    
};

function showComponents() {
    document.querySelector('.welcome').style.display = "none";
    document.querySelector('.showEvents').style.display = "block";
    //initMap();
    showEvents();
}

$(document).tooltip({ selector: "[title]",
                      placement: "right",
                      trigger: "focus",
                      animation: false}); 