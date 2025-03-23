export const getLocationErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Please allow location access to use this feature'
    case error.POSITION_UNAVAILABLE:
      return 'Your location is currently unavailable, please check your GPS signal and try again'
    case error.TIMEOUT:
      return 'Timed-out while retrieving your location, please try again'
    default:
      return error.message
  }
}
