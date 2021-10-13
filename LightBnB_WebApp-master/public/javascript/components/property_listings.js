$(() => {

  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  function addListing(listing) {
    $propertyListings.append(listing);
  }
  function clearListings() {
    $propertyListings.empty();
  }
  window.propertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false) {
    if (!isReservation) {
      clearListings();
    }
    getMyDetails()
    .then()

    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation);
      addListing(listing);
    }

    if (isReservation) {
      $('.update-button').on('click', function() {
        const idData = $(this).attr('id').substring(16);
        console.log(`update ${idData}`);          
      })
      $('.delete-button').on('click', function() {
        const idData = $(this).attr('id').substring(16);
        console.log(`delete ${idData}`);          
      })
    } 
    
  }
  window.propertyListings.addProperties = addProperties;

});