import React from 'react';
import styled, { css } from 'styled-components';

export type CardSize = 'large' | 'medium' | 'small';

export type RoundedCardProps = {
  size?: CardSize;
  count?: number;
  label?: string;
  labelFor?: string;
  image?: string;
  interactive?: boolean;
  onClick?: any;
};

const CardLabel = styled.label`
  display: block;
  font-size: ${props => props.theme.sizes.headingMd};
  color: #000;
  flex: 1 1 0px;
  align-self: center;
`;

const CardBody = styled.label`
  font-size: ${props => props.theme.sizes.text};
  color: #000;
`;

const CardWrapper = styled.article<{ size: CardSize; interactive: boolean }>`
  position: relative;
  box-sizing: border-box;
  background: #fff;
  padding: ${props => props.theme.card[props.size].padding};
  border-radius: ${props => props.theme.card[props.size].radius};
  margin-bottom: ${props => props.theme.card[props.size].margin};
  box-shadow: ${props => props.theme.card.shadow};
  border: 2px solid transparent;
  z-index: 2;
  ${props =>
    props.interactive &&
    css`
      cursor: pointer;
      & label {
        cursor: pointer;
      }
    `}
  &:hover {
    border: 2px solid ${props => (props.interactive ? props.theme.colors.primary : 'transparent')};
  }
`;

const CardCount = styled.div`
  background: ${props => props.theme.colors.mutedPrimary};
  color: ${props => props.theme.colors.textOnMutedPrimary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.textOnMutedPrimary};
  font-size: 12px;
  padding: 0 8px;
  font-weight: 600;
  height: 24px;
  line-height: 24px;
  align-self: center;
`;

const CardLayout = styled.div<{ showMargin: boolean }>`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => (props.showMargin ? '0.6em' : '0')};
`;

const CardImage = styled.img`
  height: 30px;
  width: 30px;
  contain: content;
  margin-right: 10px;
`;

export const RoundedCard: React.FC<RoundedCardProps> = ({
  size = 'large',
  onClick,
  count,
  label,
  labelFor,
  interactive = !!onClick,
  children,
  image,
}) => (
  <CardWrapper interactive={interactive} size={size} onClick={onClick}>
    <CardLayout showMargin={!!children}>
      {image ? <CardImage src={image} /> : null}
      <CardLabel htmlFor={labelFor}>{label}</CardLabel>
      {count ? <CardCount>{count}</CardCount> : null}
    </CardLayout>
    {children ? <CardBody>{children}</CardBody> : null}
  </CardWrapper>
);
