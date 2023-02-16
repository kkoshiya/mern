const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCZGcLR50xNLsmm7DQiu8M4CPD85kQZTPM';




async function getCoordsForAddress(address) {

    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)

    const data = response.data;

    if (!data || data.status === 'zero results') {
        const error = new HttpError('Could not find the location', 422);
        throw error;
    };

    const coordinates = data.results[0].geometry.location;

    return coordinates;
};

module.exports = getCoordsForAddress;