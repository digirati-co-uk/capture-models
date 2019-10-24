import * as React from 'react';
import './Autocomplete.styles';

interface AutocompleteProps {
  Suggestions: Array<string>;
  OnChange(value: string): void;
  Value: string;
}

export class Autocomplete extends React.Component<AutocompleteProps, any> {
  constructor(props: AutocompleteProps) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
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
    });

    this.props.OnChange(userInput);
  };

  onClick = (e: MouseEvent) => {
    const newValue = e.currentTarget ? e.currentTarget.innerText : '';
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    });
    this.props.OnChange(newValue);
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const { activeSuggestion, filteredSuggestions } = this.state;
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
      });
      this.props.OnChange(filteredSuggestions[activeSuggestion]);
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
      state: { activeSuggestion, filteredSuggestions, showSuggestions },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && this.props.Value) {
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
          value={this.props.Value}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}
