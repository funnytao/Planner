// Modified from Google Map API Guide

function renderMap() {
//    var map = new google.maps.Map(document.getElementById("map"), {
//      center: {lat: -33.8688, lng: 151.2195},
//      zoom: 13
//    });
//    var input = /** @type {!HTMLInputElement} */(
//        document.getElementById("pac-input"));
    google.maps.event.trigger(map, "resize");

    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
}
//var map;
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        disableDefaultUI: true
    });
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById("pac-input"));

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener("place_changed", function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ""),
          (place.address_components[1] && place.address_components[1].short_name || ""),
          (place.address_components[2] && place.address_components[2].short_name || "")
        ].join(" ");
      }

      infowindow.setContent("<div><strong>" + place.name + "</strong><br>" + address);
      infowindow.open(map, marker);
    });
}

// Add a new slog for guest input

function addguest() {
    var d = new Date();
    var n = d.getTime();
//    console.log("created!");
    var addrow = document.createElement("div");
    addrow.setAttribute("class", "row");
    var title = document.createElement("label");
    title.setAttribute("class", "inputprefix");
    title.setAttribute("for", n);
    title.appendChild(document.createTextNode("Guest"));
    var dest = document.getElementById("guest");
    var guestname = document.createElement("input");
    guestname.required = true;
    guestname.setAttribute("title", "");
    guestname.setAttribute("class", "guestlist");
    guestname.setAttribute("type", "text");
    guestname.setAttribute("id", n);
    guestname.setAttribute("placeholder", "Who is invited?");
    var deletebutton = document.createElement("div");
    deletebutton.setAttribute("class", "rightbutton");
    var icon = document.createElement("span");
    icon.setAttribute("class", "glyphicon glyphicon-minus");
    icon.setAttribute("onclick", "deleteguest(this)");
    deletebutton.appendChild(icon);
    addrow.appendChild(title);
    addrow.appendChild(guestname);
    addrow.appendChild(deletebutton);
    dest.appendChild(addrow);
    $("#"+n).on("input", function(){
        checkEmpty(n, false);
    });
}

function deleteguest(item) {
    var guest = document.getElementById("guest");
    if (guest.childNodes.length>1) {
//        console.log(item.parentElement.parentElement);
        item.parentElement.parentElement.remove();
    }
}

// Get date and time from widget

$("#start").datetimepicker({
    format: "MM/dd/yyyy hh:mm",
    language: "en"
});

$("#end").datetimepicker({
    format: "MM/dd/yyyy hh:mm",
    language: "en"
});

// Add a new event

function checkEmpty(id, haserror) {
    var checkvalue = document.getElementById(id).value;
    var errortext = "";
    if (checkvalue==="") {
//        console.log("isempty");
        errortext = "Value cannot be empty.";
        $("#"+id).attr("title", errortext)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
        $("#"+id).css("background-color", "rgb(247, 215, 216)");
        haserror = true;
//        console.log("error:"+haserror);
    }
    else {
        console.log("notempty");
        $("#"+id).tooltip("hide");
        $("#"+id).removeAttr("title");
        $("#"+id).css("background-color", "white");
    }
    return haserror;
}

function checkEventEmpty() {
    var checkvalue = document.getElementById("event").value;
    var errortext = "";
    if (checkvalue==="") {
//        console.log("isempty");
        errortext = "Value cannot be empty.";
        $("#event").attr("title", errortext)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
        $("#event").css("background-color", "rgb(247, 215, 216)");
    }
    else {
        console.log("notempty");
        $("#event").tooltip("hide");
        $("#event").removeAttr("title");
        $("#event").css("background-color", "white");
    }
}

function checkdate(haserror) {
    var starttime = document.getElementById("start-time").value;
    var endtime = document.getElementById("end-time").value;
    var errortext = "";
    if (starttime!=="" && endtime!=="") {
        if (starttime>endtime) {
            errortext = "Start time should be earlier than end time.";
//            console.log("reversed...");
            $("#start-time").attr("title", errortext)
                        .tooltip("fixTitle")
                        .tooltip("setContent")
                        .tooltip({trigger: "focus"})
                        .tooltip("show");
            $("#start-time").css("background-color", "rgb(247, 215, 216)");
            haserror = true;
//            console.log("error:"+haserror);
        }
        else {
//            console.log("safe");
            $("#start-time").attr("title", "");
            $("#start-time").tooltip("hide");
            $("#start-time").removeAttr("title");
            $("#start-time").css("background-color", "white");
        }
    }
    return haserror;
}

$("#event").on("input", function(){
    checkEmpty("event", false);
});

$("#eventtype").on("input", function(){
    checkEmpty("eventtype", false);
});
$("#start-time").on("input", function(){
    checkEmpty("start-time", false);
    checkdate(isempty);
});
$("#end-time").on("input", function(){
    checkEmpty("end-time", false);
    checkdate(false);
});
$("#host").on("input", function(){
    checkEmpty("host", false);
});
$("#pac-input").on("input", function(){
    checkEmpty("pac-input", false);
});

document.querySelector("#addevent").onclick = function() {
    var haserror = false;
//    console.log(document.getElementById("start-time").value<document.getElementById("end-time").value);
    haserror = checkEmpty("event", haserror);
    haserror = checkEmpty("eventtype", haserror);
    haserror = checkEmpty("host", haserror);
    haserror = checkEmpty("start-time", haserror);
    haserror = checkEmpty("end-time", haserror);
    haserror = checkdate(haserror);
    haserror = checkEmpty("pac-input", haserror);
    var guestList = [];
    var guests = document.getElementById("guest");
//    console.log(guestList.length);
    
    // To read input value inside div
    
    for (i=0; i<guests.childNodes.length; i++) {
        var name = guests.childNodes[i].firstChild.nextSibling.value;
        if (name!=="") {
            guestList.push(name);
        }
        else {
            haserror = checkEmpty(guests.childNodes[i].firstChild.nextSibling.id, haserror);
        }
    }
    
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    console.log(haserror);
    if (authData && guestList.length>0 && !haserror) {
        var dataref = new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events");
        dataref.push().set({
            eventname: document.getElementById("event").value,
            host: document.getElementById("host").value,
            start: document.getElementById("start-time").value,
            end: document.getElementById("end-time").value,
            guests: guestList,
            address: document.getElementById("pac-input").value,
            important: document.getElementById("switch").checked,
            note: document.getElementById("mtg").value
        });
        returnToEvents();
    }
};

// Redirect to the add event section

function addnew() {
    document.querySelector(".showEvents").style.display = "none";
    document.querySelector(".planner").style.display = "block";
    clearGuests();
    addguest();
    renderMap();
    document.getElementById("event").focus();
    $(".planner input").tooltip({ selector: "[title]",
                      placement: "bottom",
                      trigger: "focus",
                      animation: false}); 
}

// Close all the input added in previous section

function clearGuests() {
    var guests = document.getElementById("guest");
//    for (i=0; i<guests.childNodes.length; i++) {
//        guests.childNodes[i].remove();
//    }
    guests.innerHTML = "";
    console.log("cleared");
    $("input").val("");
}

// Redirect to events shown

function returnToEvents() { 
    $(".planner input").tooltip("destroy");
    document.querySelector(".planner").style.display = "none";
    document.querySelector(".showEvents").style.display = "block";
    showEvents();
}
// Should have used ReactJS... Too messy...
// Function to build an event infowindow

function createPanel(options, key) {
    var panel = document.createElement("div");
    panel.setAttribute("class", "panel panel-default");
    var panelBody = document.createElement("div");
    panelBody.setAttribute("class", "panel-body");
    var header = document.createElement("h2");
    header.appendChild(document.createTextNode(options.eventname));
    panelBody.appendChild(header);
    var closetab = document.createElement("a");
    closetab.setAttribute("class", "deleteEvent");
    closetab.setAttribute("name", key);
    closetab.setAttribute("onclick", "deleteEvent(this.name)");
    if (options.important) {
        var importantIcon = document.createElement("span");
        importantIcon.setAttribute("class", "glyphicon glyphicon-star");
        closetab.appendChild(importantIcon);
    }
    var closeIcon = document.createElement("span");
    closeIcon.setAttribute("class", "glyphicon glyphicon-trash");
    closetab.appendChild(closeIcon);
    panelBody.appendChild(closetab);
    var cleardiv = document.createElement("div");
    panelBody.appendChild(cleardiv);
    var panelFooter = document.createElement("div");
    panelFooter.setAttribute("class", "panel-footer");
    
    var rowTime = document.createElement("div");
    rowTime.setAttribute("class", "row");
    var startdiv = document.createElement("p");
    startdiv.setAttribute("class", "tag");
    startdiv.appendChild(document.createTextNode("From"));
    rowTime.appendChild(startdiv);
    var startdata = document.createElement("p");
    startdata.setAttribute("class", "data");
    startdata.appendChild(document.createTextNode(options.start));
    rowTime.appendChild(startdata);
    var enddiv = document.createElement("p");
    enddiv.setAttribute("class", "tag todiv");
    enddiv.appendChild(document.createTextNode("To"));
    rowTime.appendChild(enddiv);
    var enddata = document.createElement("p");
    enddata.setAttribute("class", "data");
    enddata.appendChild(document.createTextNode(options.end));
    rowTime.appendChild(enddata);
    
    var rowHost = document.createElement("div");
    rowHost.setAttribute("class", "row");
    var hostdiv = document.createElement("p");
    hostdiv.setAttribute("class", "tag");
    hostdiv.appendChild(document.createTextNode("Host"));
    rowHost.appendChild(hostdiv);
    var hostdata = document.createElement("p");
    hostdata.setAttribute("class", "data");
    hostdata.appendChild(document.createTextNode(options.host));
    rowHost.appendChild(hostdata);
    
    var rowGuest = document.createElement("div");
    rowGuest.setAttribute("class", "row");
    var guesttitle = document.createElement("p");
    guesttitle.setAttribute("class", "tag");
    guesttitle.appendChild(document.createTextNode("Guests"));
    rowGuest.appendChild(guesttitle);
    var guestnames = "";
    options.guests.forEach(function(item) {
        guestnames = guestnames + item + ", ";
    });
    var guestdata = document.createElement("p");
    guestdata.setAttribute("class", "data");
    guestdata.appendChild(document.createTextNode(guestnames.substring(0, guestnames.length-3)));
    rowGuest.appendChild(guestdata);
    
    var rowNote;
    if (options.note.length>0) {
        rowNote = document.createElement("div");
        rowNote.setAttribute("class", "row");
        var notediv = document.createElement("p");
        notediv.setAttribute("class", "tag");
        notediv.appendChild(document.createTextNode("Note"));
        rowNote.appendChild(notediv);
        var notedata = document.createElement("p");
        notedata.setAttribute("class", "data");
        notedata.appendChild(document.createTextNode(options.note));
        rowNote.appendChild(notedata);
    }
    
    panelFooter.appendChild(rowHost);
    panelFooter.appendChild(rowGuest);
    if (options.note.length>0) { 
        panelFooter.appendChild(rowNote); 
    }
    panelFooter.appendChild(rowTime);
    var newmap = document.createElement("div");
    newmap.setAttribute("id", key);
    newmap.setAttribute("class", "map");
    panelFooter.appendChild(newmap);
    panel.appendChild(panelBody);
    panel.appendChild(panelFooter);
    document.getElementById("events").appendChild(panel);
    displayMap(key, options.address);
}

// Delete event

function deleteEvent(item) {
//    console.log(item);
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
        new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events/"+item).remove();
    }
    showEvents();
}

// Display all the event

function showEvents() {
    var events = document.getElementById("events");
    events.innerHTML = "";
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
        var dataref = new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events");
//        dataref.once("value", function(snapshot) {
        dataref.orderByChild("start").on("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                createPanel(childSnapshot.val(), childSnapshot.key());
            });
        });
    }
}

// Display a map for each event location

function displayMap(key, address) {
    var map = new google.maps.Map(document.getElementById(key), {
        zoom: 18,
        center: {lat: -34.397, lng: 150.644},
        draggable: false,
        scrollwheel: false,
        disableDefaultUI: true,
        disableDoubleClickZoom: true
    });
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({"address": address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            var infowindow = new google.maps.InfoWindow({ maxWidth: 140 });
            infowindow.setContent("<div><strong>" + address.split(",")[0] + "</strong><br>" + address);
            infowindow.open(map, marker);
        } 
        else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
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