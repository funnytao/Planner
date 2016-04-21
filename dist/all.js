// Modified from Google Map API Guide

function renderMap() {
//    var map = new google.maps.Map(document.getElementById('map'), {
//      center: {lat: -33.8688, lng: 151.2195},
//      zoom: 13
//    });
//    var input = /** @type {!HTMLInputElement} */(
//        document.getElementById('pac-input'));
    google.maps.event.trigger(map, 'resize');

    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
}
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        disableDefaultUI: true
    });
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
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

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
    });
}

// Add a new slog for guest input

function addguest() {
    console.log('created!');
    var addrow = document.createElement('div');
    addrow.setAttribute('class', 'row');
    var title = document.createElement('div');
    title.setAttribute('class', 'inputprefix');
    title.appendChild(document.createTextNode('Guest'));
    var dest = document.getElementById('guest');
    var guestname = document.createElement('input');
    guestname.required = true;
    guestname.setAttribute('class', 'guestlist');
    guestname.setAttribute('type', 'text');
    guestname.setAttribute('placeholder', 'Who is invited?');
    var deletebutton = document.createElement('div');
    deletebutton.setAttribute('class', 'rightbutton');
    var icon = document.createElement('span');
    icon.setAttribute('class', 'glyphicon glyphicon-minus');
    icon.setAttribute('onclick', 'deleteguest(this)');
    deletebutton.appendChild(icon);
    addrow.appendChild(title);
    addrow.appendChild(guestname);
    addrow.appendChild(deletebutton);
    dest.appendChild(addrow);
}

function deleteguest(item) {
    var guest = document.getElementById('guest');
    if (guest.childNodes.length>1) {
        console.log(item.parentElement.parentElement);
        item.parentElement.parentElement.remove();
    }
}

// Get date and time from widget

$('#start').datetimepicker({
    format: 'MM/dd/yyyy hh:mm',
    language: 'en'
});

$('#end').datetimepicker({
    format: 'MM/dd/yyyy hh:mm',
    language: 'en'
});

// Add a new event

document.querySelector('#addevent').onclick = function() {
    console.log('adding events');
    var guestList = [];
    var guests = document.getElementById('guest');
    console.log(guestList.length);
    
    // To read input value inside div
    
    for (i=0; i<guests.childNodes.length; i++) {
//        console.log(guests.childNodes[i].firstChild.nextSibling);
        var name = guests.childNodes[i].firstChild.nextSibling.value;
        if (name!==undefined) {
            guestList.push(name);
        }
    }
    
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    
    console.log(guestList.length);
    if (authData && guestList.length>0) {
        var dataref = new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events");
        dataref.push().set({
            eventname: document.getElementById('event').value,
            host: document.getElementById('host').value,
            start: document.getElementById('start-time').value,
            end: document.getElementById('end-time').value,
            guests: guestList,
            address: document.getElementById('pac-input').value
        });
        returnToEvents();
    }
};

// Redirect to the add event section

function addnew() {
    document.querySelector('.showEvents').style.display = "none";
    document.querySelector('.planner').style.display = "block";
    clearGuests();
    addguest();
    renderMap();
    //initMap();
}

// Close all the input added in previous section

function clearGuests() {
    var guests = document.getElementById('guest');
//    for (i=0; i<guests.childNodes.length; i++) {
//        guests.childNodes[i].remove();
//    }
    guests.innerHTML = "";
    console.log('cleared');
    $('input').val('');
}

// Redirect to events shown

function returnToEvents() {
    document.querySelector('.planner').style.display = "none";
    document.querySelector('.showEvents').style.display = "block";
    showEvents();
}
// Should have used ReactJS... Too messy...
// Function to build an event infowindow

function createPanel(options, key) {
    var panel = document.createElement('div');
    panel.setAttribute('class', 'panel panel-default');
    var panelBody = document.createElement('div');
    panelBody.setAttribute('class', 'panel-body');
    var header = document.createElement('h2');
    header.appendChild(document.createTextNode(options.eventname));
    panelBody.appendChild(header);
    var closetab = document.createElement('a');
    closetab.setAttribute('class', 'deleteEvent');
    closetab.setAttribute('name', key);
    closetab.setAttribute('onclick', 'deleteEvent(this.name)');
    var closeIcon = document.createElement('span');
    closeIcon.setAttribute('class', 'glyphicon glyphicon-trash');
    closetab.appendChild(closeIcon);
    panelBody.appendChild(closetab);
    var cleardiv = document.createElement('div');
    panelBody.appendChild(cleardiv);
    var panelFooter = document.createElement('div');
    panelFooter.setAttribute('class', 'panel-footer');
    
    var rowTime = document.createElement('div');
    rowTime.setAttribute('class', 'row');
    var startdiv = document.createElement('p');
    startdiv.setAttribute('class', 'tag');
    startdiv.appendChild(document.createTextNode('From'));
    rowTime.appendChild(startdiv);
    var startdata = document.createElement('p');
    startdata.setAttribute('class', 'data');
    startdata.appendChild(document.createTextNode(options.start));
    rowTime.appendChild(startdata);
    var enddiv = document.createElement('p');
    enddiv.setAttribute('class', 'tag todiv');
    enddiv.appendChild(document.createTextNode('To'));
    rowTime.appendChild(enddiv);
    var enddata = document.createElement('p');
    enddata.setAttribute('class', 'data');
    enddata.appendChild(document.createTextNode(options.end));
    rowTime.appendChild(enddata);
    
    var rowHost = document.createElement('div');
    rowHost.setAttribute('class', 'row');
    var hostdiv = document.createElement('p');
    hostdiv.setAttribute('class', 'tag');
    hostdiv.appendChild(document.createTextNode('Host'));
    rowHost.appendChild(hostdiv);
    var hostdata = document.createElement('p');
    hostdata.setAttribute('class', 'data');
    hostdata.appendChild(document.createTextNode(options.host));
    rowHost.appendChild(hostdata);
    
    var rowGuest = document.createElement('div');
    rowGuest.setAttribute('class', 'row');
    var guesttitle = document.createElement('p');
    guesttitle.setAttribute('class', 'tag');
    guesttitle.appendChild(document.createTextNode('Guests'));
    rowGuest.appendChild(guesttitle);
    var guestnames = "";
    options.guests.forEach(function(item) {
        guestnames = guestnames + item + ", ";
    });
    var guestdata = document.createElement('p');
    guestdata.setAttribute('class', 'data');
    guestdata.appendChild(document.createTextNode(guestnames.substring(0, guestnames.length-3)));
    rowGuest.appendChild(guestdata);
    
    panelFooter.appendChild(rowHost);
    panelFooter.appendChild(rowGuest);
    panelFooter.appendChild(rowTime);
    var newmap = document.createElement('div');
    newmap.setAttribute('id', key);
    newmap.setAttribute('class', 'map');
    panelFooter.appendChild(newmap);
    panel.appendChild(panelBody);
    panel.appendChild(panelFooter);
    document.getElementById('events').appendChild(panel);
    displayMap(key, options.address);
}

// Delete event

function deleteEvent(item) {
    console.log(item);
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
        new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events/"+item).remove();
    }
    showEvents();
}

// Display all the event

function showEvents() {
    var events = document.getElementById('events');
    events.innerHTML = "";
    var ref = new Firebase("https://boiling-heat-4273.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
        var dataref = new Firebase("https://boiling-heat-4273.firebaseio.com/web/planner/users/"+authData.uid+"/events");
//        dataref.once("value", function(snapshot) {
        dataref.orderByChild('start').on("value", function(snapshot) {
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

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            var infowindow = new google.maps.InfoWindow({ maxWidth: 150 });
            infowindow.setContent('<div><strong>' + address.split(',')[0] + '</strong><br>' + address);
            infowindow.open(map, marker);
        } 
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
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