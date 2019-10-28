import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Autocomplete } from './Autocomplete';

const stories = storiesOf('Autocomplete', module);

const Wrapper: React.FC = () => {
  const [value, setValue] = React.useState('');
  const [suggestions] = React.useState([
    'Apples',
    'Bananas',
    'Carrots',
    'Digestives',
    'Eggs',
    'Jaffa Cakes',
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([
    ...suggestions,
  ]);

  const handleSuggestions = (searchTerm: string) => {
    setValue(searchTerm);
    if (searchTerm !== '') {
      let filtered = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
      setFilteredSuggestions(filtered);
    } else setFilteredSuggestions(suggestions);
  };

  return (
    <Autocomplete
      Suggestions={filteredSuggestions}
      Value={value}
      OnChange={handleSuggestions}
    />
  );
};

stories.add('Simple Autocomplete', () => <Wrapper />);
