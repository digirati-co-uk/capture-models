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
      showSuggestion: false,
    };
  }

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      activeSuggestion: 0,
      showSuggestions: true,
    });

    this.props.OnChange(e.currentTarget.value);
  };

  onClick = (value: string) => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
    });
    if (value) this.props.OnChange(value);
  };

  onKeyDown = (e: React.KeyboardEvent) => {
    const { activeSuggestion } = this.state;
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
      });
      this.props.OnChange(this.props.Suggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === this.props.Suggestions.length) {
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
      state: { activeSuggestion, showSuggestions },
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && this.props.Value) {
      if (this.props.Suggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {this.props.Suggestions.map((suggestion: string, index: number) => {
              let className = 'suggestions__suggestion';

              if (index === activeSuggestion) {
                className += ' suggestions__suggestion--active';
              }

              return (
                <li
                  className={className}
                  key={suggestion}
                  onClick={e => onClick(e.currentTarget.innerText)}
                >
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
        {this.props.Suggestions.length > 0 ? suggestionsListComponent : <div />}
      </div>
    );
  }
}
