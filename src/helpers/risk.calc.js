const calculateRiskLevel = (phaData) => {
  const missDistance = parseFloat(phaData.close_approach_data[0].miss_distance.kilometers);
  const diameter = parseFloat(phaData.estimated_diameter.kilometers.estimated_diameter_max );
  const velocity = parseFloat(phaData.close_approach_data[0].relative_velocity.kilometers_per_hour);

  console.log('missDistance:', missDistance, 'diameter:', diameter, 'velocity:', velocity);

  if (missDistance > 10000000 && diameter < 0.1 && velocity < 25000) {
      return 'Low';
  } else if (missDistance <= 10000000 && missDistance > 1000000 && diameter < 0.3 && velocity < 50000) {
      return 'Medium';
  } else if (missDistance <= 1000000 && missDistance > 100000 && diameter < 1 && velocity < 75000) {
      return 'High';
  } else if (missDistance <= 100000 || diameter > 1 || velocity > 75000) {
      return 'Critical';
  }
  else if (phaData.is_potentially_hazardous_asteroid) {
      return 'High';
  }

  return 'Unknown';
};

module.exports = calculateRiskLevel;