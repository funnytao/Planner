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