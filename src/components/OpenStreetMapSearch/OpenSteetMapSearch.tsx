import * as React from 'react';
import { Request } from '../../utils/Request';
import { Autocomplete } from '../Autocomplete/Autocomplete';

interface OpenStreetMapSearchProps {
  OnSubmit(place: string): void;
}
export const OpenStreetMapSearch: React.FC<OpenStreetMapSearchProps> = ({
  OnSubmit,
}) => {
  const [value, setValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState(['']);

  const search = async (searchTerm: string) => {
    setValue(searchTerm);
    const url =
      'https://nominatim.openstreetmap.org/search/' +
      searchTerm +
      '?format=json&addressdetails=1&limit=5&cache=true';
    const response = await Request('get', url);
    let data = JSON.parse(response);
    data = [...data].map(place => place.display_name);
    setSuggestions(data);
  };

  return (
    <label>
      Search:
      <Autocomplete Value={value} OnChange={search} Suggestions={suggestions} />
    </label>
  );
};
