function datafront () {
    $.ajax({  //Send a post request from curl version into ajax jquery
        type: 'POST',
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{}',
        success: function (data) {
            for (const place of Object.values(data)) {  // Loop into the result of the request and create an article tag representing a Place in the section.places.
                $('section.places').append(`<article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">
            <i class="fa fa-users fa-3x" aria-hidden="true"></i>
            </br>
            ${place.max_guest} Guests
          </div>
          <div class="number_rooms">
            <I class="fa fa-bed fa-3x" aria-hidden="true"></i>
            </br>
            ${place.number_rooms} Bedrooms
          </div>
          <div class="number_bathrooms">
            <I class="fa fa-bath fa-3x" aria-hidden="true"></i>
            </br>
            ${place.number_bathrooms} Bathrooms
          </div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      </article>`);
            }
        }
    });
}

function statusApi () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (response) { 
        if (response.status === 'OK') {
            $('div#api_status').addClass('available'); //if in the status is “OK”, add the class available to the div#api_status
        } else {
            $('div#api_status').removeClass('available'); //remove the class available to the div#api_status
        }
    });
}
    
$('document').ready(function () {    //defer code from being executed until the web page has fully loaded.
    
    const checksAmenities = {};
    
    $('input[type="checkbox"]').click(function () {
        if ($(this).is(':checked')) { //if check store the Amenity ID in a dic with attribute data id and name
            checksAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete checksAmenities[$(this).attr('data-id')]; // if not remove the Amenity ID 
        }
        $('.amenities H4').text(Object.values(checksAmenities).join(', ')); //update the h4 tag inside the div Amenities with the list of Amenities checked
    });
statusApi();
datafront();
});
