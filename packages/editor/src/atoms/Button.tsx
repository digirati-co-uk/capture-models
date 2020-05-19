import styled, { css } from 'styled-components';

export const Button = styled.button<{ primary?: boolean; fluid?: boolean, alert?: boolean; size?: 'tiny' | 'mini' | 'small' }>`
  background: #eee;
  color: #333;
  font-size: 1em;
  padding: .5em .8em;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  display: inline-block;
  margin: 0 .14285714em;

  &:hover {
    background: #ddd;
  }
  
  & > & {
    margin-left: 1em;
  }
  
 
  &:disabled {
    opacity: .5;
  }
  
  ${props => props.fluid && css`
    width: 100%;
  `}
  
  ${props => props.primary && css`
    border: 1px solid #000;
    background: #333;
    &:hover {
      background: #444;
    }
    color: #fff;
  `}
 
  ${props => props.alert && css`
    background: #ba321c;
    border-color: #610000;
    &:hover {
      background: #a71e08;
    }
    color: #fff;
  `}
  
  
  ${props => props.size === 'small' && css`
    font-size: 0.9em;
  `}
  ${props => props.size === 'tiny' && css`
    font-size: 0.8em;
  `}
  ${props => props.size === 'mini' && css`
    font-size: 0.7em;
  `}
`;
