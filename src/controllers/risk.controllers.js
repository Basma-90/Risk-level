const axios = require('axios');
const PHA = require('../models/risk.model');
const calculateRiskLevel = require('../helpers/risk.calc');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.API_KEY;

if (!apiKey) {
    throw new Error('API key not found. Please check your environment variables.');
}

const getPHAs = async (startDate, endDate) => {
    const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
    try {
        const response = await axios.get(URL, { timeout: 10000 }); // 10 seconds timeout
        const phas = response.data.near_earth_objects;
        const phaData = [];

        for (const date in phas) {
            for (const pha of phas[date]) {
                const newPHA = new PHA({
                    id: pha.id,
                    name: pha.name,
                    diameter_km_min: pha.estimated_diameter.kilometers.estimated_diameter_min,
                    diameter_km_max: pha.estimated_diameter.kilometers.estimated_diameter_max,
                    close_approach_date: date,
                    relative_velocity_kph: pha.close_approach_data[0].relative_velocity.kilometers_per_hour,
                    miss_distance_km: pha.close_approach_data[0].miss_distance.kilometers,
                    is_potentially_hazardous: pha.is_potentially_hazardous_asteroid,
                    orbiting_body: pha.close_approach_data[0].orbiting_body,
                    risk_level: calculateRiskLevel(pha),
                });
                phaData.push(newPHA);
            }
        }
        return phaData;
    } catch (err) {
        console.error('Error fetching PHA data:', err); // Log full error
        throw err;
    }
};

const savePHAs = async (startDate, endDate) => {
    try {
        const phaData = await getPHAs(startDate, endDate);
        const savePromises = phaData.map(pha => pha.save().catch(err => {
            console.error(`Error saving PHA with ID ${pha.id}:`, err.message);
        }));
        await Promise.all(savePromises);
    } catch (err) {
        console.error('Error in savePHAs:', err.message);
    }
};

module.exports = { getPHAs, savePHAs };
