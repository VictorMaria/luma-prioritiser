export default class Utilities {
    static getRandomNumber = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // It should be noted that this method calcuates the shortest distance between two coordinates
    // and it does not take into consideration the additional distance the possible route between the coordinates may introduce.
    static distanceInKMBetweenTwoCoorindates(details: {
        longitude1: number;
        latitude1: number;
        longitude2: number;
        latitude2: number;
      }) {
        const { longitude1, longitude2, latitude1, latitude2 } = details;
        const longitude1InRadians = (longitude1 * Math.PI) / 180;
        const longitude2InRadians = (longitude2 * Math.PI) / 180;
        const latitude1InRadians = (latitude1 * Math.PI) / 180;
        const latitude2InRadians = (latitude2 * Math.PI) / 180;
    
        // Haversine formula
        let dlon = longitude2InRadians - longitude1InRadians;
        let dlat = latitude2InRadians - latitude1InRadians;
        let a =
          Math.pow(Math.sin(dlat / 2), 2) +
          Math.cos(latitude1InRadians) *
            Math.cos(latitude2InRadians) *
            Math.pow(Math.sin(dlon / 2), 2);
    
        let c = 2 * Math.asin(Math.sqrt(a));
    
        // Radius of earth in kilometers
        let r = 6371;
    
        return c * r;
      }
}