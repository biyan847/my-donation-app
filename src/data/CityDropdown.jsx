// src/components/CityDropdown.jsx
import React, { useEffect, useState } from "react";
import cityList from "../data/cities.json";

const CityDropdown = ({ value, onChange }) => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(cityList);
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="location-input"
    >
      <option value="">Select a city</option>
      {cities.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
      ))}
    </select>
  );
};

export default CityDropdown;
