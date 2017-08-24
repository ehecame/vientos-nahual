/* global Polymer, google, util */

Polymer({
  is: 'place-picker',

  properties: {
    googleMapsApiKey: {
      type: String,
      value: window.vientos.config.map.googleApiKey
    }
  },

  reset () {
    this.$['place-input'].value = ''
  },

  _onGoogleMapsApiLoad () {
    this.autocomplete = new google.maps.places.Autocomplete(this.$['place-input'])
    google.maps.event.addListener(this.autocomplete, 'place_changed', this._placeChanged.bind(this))
  },

  _placeChanged () {
    let googlePlace = this.autocomplete.getPlace()
    if (googlePlace.place_id) {
      let place = {
        address: googlePlace.formatted_address,
        latitude: googlePlace.geometry.location.lat(),
        longitude: googlePlace.geometry.location.lng(),
        googlePlaceId: googlePlace.place_id
      }
      this.fire('picked', place)
    }
    this.reset()
  }
})