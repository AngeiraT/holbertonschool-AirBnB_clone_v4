//defer code from being executed until the web page has fully loaded.
$('document').ready(function () {
    $.ajax({  //Send a post request from curl version into ajax jquery
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        data: '{}',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            for (const place of data) {  // Loop into the result of the request and create an article tag representing a Place in the section.places.
                $('section.places').append('<article><h2>' + place.name + '</h2><div class="price_by_night"><p>$' + place.price_by_night + 
                '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' + place.max_guest + 
                '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' + place.number_rooms + 
                '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' + place.number_bathrooms + 
                '</p></div></div><div class="description"><p>' + place.description + '</p></div></article>');
            }
        }
    });



    $.get('http://0.0.0.0:5001/api/v1/status/', function (response) { 
        if (response.status === 'OK') {
            $('div#api_status').addClass('available'); //if in the status is “OK”, add the class available to the div#api_status
        } else {
            $('div#api_status').removeClass('available'); //remove the class available to the div#api_status
        }
    });
    
    
    
    const checksAmenities = {};
    
    $('input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) { //if check store the Amenity ID in a dic with attribute data id and name
            checksAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete checksAmenities[$(this).attr('data-id')]; // if not remove the Amenity ID 
        }
        $('.amenities H4').text(Object.values(checksAmenities).join(', ')); //update the h4 tag inside the div Amenities with the list of Amenities checked
    });
});

