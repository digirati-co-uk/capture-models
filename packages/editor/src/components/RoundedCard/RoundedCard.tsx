import React from 'react';
import styled, { css } from 'styled-components';
import { getCard, getTheme } from '../../themes';

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
  font-size: ${props => getTheme(props).sizes.headingMd};
  color: #000;
  flex: 1 1 0px;
  align-self: center;
`;

const CardBody = styled.div`
  font-size: ${props => getTheme(props).sizes.text};
  line-height: 1.4em;
  color: #000;
`;

const CardWrapper = styled.article<{ size: CardSize; interactive: boolean }>`
  position: relative;
  box-sizing: border-box;
  background: #fff;
  padding: ${props => getCard(props, 'padding')};
  border-radius: ${props => getCard(props, 'radius')};
  margin-bottom: ${props => getCard(props, 'margin')};
  box-shadow: ${props => getTheme(props).card.shadow};
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
    border: 2px solid ${props => (props.interactive ? getTheme(props).colors.primary : 'transparent')};
  }
`;

const CardCount = styled.div`
  background: ${props => getTheme(props).colors.mutedPrimary};
  color: ${props => getTheme(props).colors.textOnMutedPrimary};
  border-radius: 12px;
  border: 1px solid ${props => getTheme(props).colors.textOnMutedPrimary};
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
    {image || label || count ? (
      <CardLayout showMargin={!!children}>
        {image ? <CardImage src={image} /> : null}
        {label ? <CardLabel htmlFor={labelFor}>{label}</CardLabel> : null}
        {count ? <CardCount>{count}</CardCount> : null}
      </CardLayout>
    ) : null}
    {children ? <CardBody>{children}</CardBody> : null}
  </CardWrapper>
);
