import React from 'react';
import styled from 'styled-components';

export const CardButton = styled.button<{ size?: 'large' | 'medium' | 'small'; shadow?: boolean; inline?: boolean }>`
  box-sizing: border-box;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textOnPrimary};
  margin-bottom: ${props => props.theme.card[props.size === 'large' ? 'large' : 'small'].margin};
  padding: ${props => (props.size === 'large' ? '0.75em 1.2em' : '.6em 1.2em')};
  width: ${props => (props.inline ? 'auto' : '100%')};
  box-shadow: ${props => (props.shadow ? props.theme.card.shadow : 'none')};
  border-radius: 4px;
  font-weight: 500;
  border: none;
  text-align: center;
  font-size: ${props => {
    switch (props.size) {
      case 'large':
        return props.theme.sizes.buttonLg;
      case 'medium':
        return props.theme.sizes.buttonMd;
      case 'small':
        return props.theme.sizes.buttonSm;
      default:
        return props.theme.sizes.buttonMd;
    }
  }};
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: ${props => props.theme.card.shadow};
  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus {
    outline: 2px solid rgba(255, 255, 255, .5);
    outline-offset: -4px;
    &:active {
      outline: none;
    }
  }
`;
