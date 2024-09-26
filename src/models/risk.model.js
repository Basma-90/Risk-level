const mongoose = require('mongoose');

const PHASchema = new mongoose.Schema({
  id: String,
  name: String,
  diameter_km_min: Number,
  diameter_km_max: Number,
  close_approach_date: String,
  relative_velocity_kph: Number,
  miss_distance_km: Number,
  is_potentially_hazardous: Boolean,
  orbiting_body: String,
  risk_level: String  
});

const PHA = mongoose.model('PHA', PHASchema);

module.exports = PHA;
