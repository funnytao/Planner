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
            var infowindow = new google.maps.InfoWindow({ maxWidth: 140 });
            infowindow.setContent('<div><strong>' + address.split(',')[0] + '</strong><br>' + address);
            infowindow.open(map, marker);
        } 
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}