const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json' , (error, response, body) => {
    if(error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    console.log(ip);
    callback(null, ip);
  });
};
const fetchCoordsByIP = function(ip, callback) {
  request('https://freegeoip.app/json/' + ip , (error, response, body) => {
    
     if(error) {
       callback(error, null);
       return;
     }
     if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
     }
     
     const data = JSON.parse(body);
     const geoLocations = {"latitude": (data.latitude).toString(), "longitude": (data.longitude).toString() };
     callback(null, geoLocations);
   });
}
   const fetchISSFlyOverTimes = function(coords, callback) {
    console.log(coords['latitude'] , coords['longitude']);
    request('http://api.open-notify.org/iss-pass.json?lat=' + coords['latitude'] + '&lon=' +coords['longitude'] , (error, response, body) => {
    
      if(error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const passes = JSON.parse(body).response;
      callback(null, passes);
    });
  };
  const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
      fetchCoordsByIP(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
  
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }
  
          callback(null, nextPasses);
        });
      });
    });
  };
module.exports = { 
  nextISSTimesForMyLocation
};
