//defer code from being executed until the web page has fully loaded.
$('document').ready(function () {
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
