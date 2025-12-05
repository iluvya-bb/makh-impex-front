import { useState, useEffect } from 'react';
import cityData from '../data/city.json';
import districtData from '../data/district.json';
import quarterData from '../data/quarter.json';

function AddressDropdown({ onChanged }) {
  const [cities] = useState(cityData);
  const [districts] = useState(districtData);
  const [quarters] = useState(quarterData);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const filteredDistricts = selectedCity
    ? districts.filter((d) => d.parent === selectedCity.id)
    : [];

  const filteredQuarters = selectedDistrict
    ? quarters.filter((q) => q.parent === selectedDistrict.id)
    : [];

  useEffect(() => {
    onChanged({
      cityId: selectedCity?.name || '',
      districtId: selectedDistrict?.name || '',
      quarterId: selectedQuarter?.name || '',
    });
  }, [selectedCity, selectedDistrict, selectedQuarter, onChanged]);

  const handleCityChange = (e) => {
    const city = cities.find((c) => c.id === parseInt(e.target.value));
    setSelectedCity(city || null);
    setSelectedDistrict(null);
    setSelectedQuarter(null);
  };

  const handleDistrictChange = (e) => {
    const district = districts.find((d) => d.id === parseInt(e.target.value));
    setSelectedDistrict(district || null);
    setSelectedQuarter(null);
  };

  const handleQuarterChange = (e) => {
    const quarter = quarters.find((q) => q.id === parseInt(e.target.value));
    setSelectedQuarter(quarter || null);
  };

  return (
    <div className="address-dropdown">
      <div className="dropdown-box">
        <select value={selectedCity?.id || ''} onChange={handleCityChange}>
          <option value="">Хот сонгох</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-box">
        <select
          value={selectedDistrict?.id || ''}
          onChange={handleDistrictChange}
          disabled={!selectedCity}
        >
          <option value="">Дүүрэг / Сум сонгох</option>
          {filteredDistricts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div className="dropdown-box">
        <select
          value={selectedQuarter?.id || ''}
          onChange={handleQuarterChange}
          disabled={!selectedDistrict}
        >
          <option value="">Баг / Хороо сонгох</option>
          {filteredQuarters.map((quarter) => (
            <option key={quarter.id} value={quarter.id}>
              {quarter.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AddressDropdown;
