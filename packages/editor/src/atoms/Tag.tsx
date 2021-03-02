import styled, { css } from 'styled-components/macro';

export const Tag = styled.div<{ size?: 'tiny'; blue?: boolean }>`
  font-size: .8em;
  display: inline-block;
  line-height: 1;
  margin: 0 .14285714em;
  vertical-align: center;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: .5em .8em;
  color: rgba(0,0,0,.7);
  text-transform: none;
  //font-weight: 700;
  //border: 0 solid transparent;
  border-radius: 3px;
  ${props => props.size === 'tiny' && css`
    font-size: .55em;
  `}
  ${props => props.blue && css`
    background: #005cc5;
    color: #fff;
    border-color: #004ea7;
  `}
`;
