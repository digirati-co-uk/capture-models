import * as React from 'react';
import './Autocomplete.styles';

interface AutocompleteProps {
  Suggestions: Array<string>;
}

export class Autocomplete extends React.Component<AutocompleteProps, any> {
  constructor(props: AutocompleteProps) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: '',
    };
  }

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { Suggestions } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = Suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  onClick = (e: MouseEvent) => {
    const newValue = e.currentTarget.innerText ? e.currentTarget.innerText : '';
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: newValue,
    });
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion: string, index: number) => {
              let className = 'suggestions__suggestion';

              if (index === activeSuggestion) {
                className += ' suggestions__suggestion--active';
              }

              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>Nothing found.</em>
          </div>
        );
      }
    }

    return (
      <div className="autocomplete">
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          defaultValue={userInput}
          value={userInput}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}
