import React, { useState, useEffect } from 'react'; // Added implicit import for hooks

const LocationSearchPanel = ({ 
  activeField, 
  onLocationSelect, 
  setPanelOpen, 
  setVehiclePanel,
  initialText,
  updateQuery
}) => {
  const [query, setQuery] = useState(initialText || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialText || '');
  }, [initialText]);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getLocationSuggestions(query);
        setSuggestions(results);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (updateQuery) {
      updateQuery(newQuery);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onLocationSelect(activeField, { 
      lat: suggestion.lat, 
      lng: suggestion.lng, 
      text: suggestion.name 
    });
    setPanelOpen(false);

    if (activeField === 'destination') {
      setTimeout(() => setVehiclePanel(true), 400);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h4 className="text-xl font-semibold text-gray-900 mb-4">
        {activeField === 'pickup' ? 'Select a pickup location' : 'Select a destination'}
      </h4>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={activeField === 'pickup' ? 'Search pickup locations' : 'Search destinations'}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#138808] focus:border-transparent"
        autoFocus
      />

      {loading && <p className="text-gray-500 text-sm">Loading suggestions...</p>}

      {!loading && suggestions.length === 0 && query.length > 0 && (
        <p className="text-gray-400 text-sm">No results found</p>
      )}

      <div className="space-y-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSuggestionSelect(s)}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <i className="ri-map-pin-fill mr-3 text-[#138808]"></i>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSearchPanel; // Added this line to export the component