import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Select from 'react-select';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';

const countryList = [
  "Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, Democratic Republic of the", "Cook Islands", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Macedonia", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
];

const options = countryList.map(country => ({ value: country, label: country }));

export default function ExportCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/website/settings', {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.export_countries) {
          try {
            const parsed = JSON.parse(json.data.export_countries);
            if (Array.isArray(parsed)) {
              setCountries(parsed);
            }
          } catch (e) {
            console.error("Error parsing export_countries", e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCountry = () => {
    if (!selectedCountry) return;
    
    if (countries.includes(selectedCountry.value)) {
      alert("This country is already in the list.");
      return;
    }

    setCountries([...countries, selectedCountry.value]);
    setSelectedCountry(null);
  };

  const handleRemoveCountry = (countryToRemove) => {
    setCountries(countries.filter(c => c !== countryToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const submitData = new FormData();
    submitData.append('export_countries', JSON.stringify(countries));
    submitData.append('_method', 'PUT');

    try {
      const res = await fetch('/api/admin/website/settings', {
        method: 'POST',
        body: submitData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setSuccessMessage('Export countries saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const err = await res.json();
        alert(err.message || 'Error saving countries');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Connection error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Export Countries | Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PublicIcon className="text-[#0B63CE]" /> Export Countries
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage the list of countries where your products are exported.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary flex items-center px-5 py-2.5 rounded-lg text-sm font-medium ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <SaveIcon fontSize="small" className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center shadow-sm">
            <CheckCircleIcon className="mr-3" fontSize="small" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Country</label>
            <div className="flex gap-4">
              <div className="flex-grow">
                <Select
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  options={options}
                  placeholder="Search and select a country..."
                  isClearable
                  classNamePrefix="react-select"
                />
              </div>
              <button 
                onClick={handleAddCountry}
                disabled={!selectedCountry}
                className={`px-5 py-2 bg-[#0B63CE] text-white rounded-lg font-medium transition-colors ${!selectedCountry ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Current Export Destinations ({countries.length})</h3>
            
            {countries.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                <PublicIcon fontSize="large" className="text-gray-300 mb-2" />
                <p>No export countries added yet.</p>
                <p className="text-sm">Search and add countries using the dropdown above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {countries.map((country, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                    <span className="font-medium text-gray-700">{country}</span>
                    <button 
                      onClick={() => handleRemoveCountry(country)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Country"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
