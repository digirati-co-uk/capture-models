import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  background: ${props => props.theme.colors.primary};
  padding: 40px 30px 80px 30px;
  margin-bottom: -40px;
`;

const BackgroundHeader = styled.h1`
  font-size: ${props => props.theme.sizes.headingLg};
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  font-weight: 600;
  color: ${props => props.theme.colors.textOnPrimary};
`;

const BackgroundDescription = styled.p`
  font-size: ${props => props.theme.sizes.text};
  color: ${props => props.theme.colors.textOnPrimary};
  opacity: 0.9;
`;
const BackgroundBody = styled.div`
  margin: 0 30px;
`;

type BackgroundSplashProps = {
  header: string;
  description?: string;
};

export const BackgroundSplash: React.FC<BackgroundSplashProps> = ({ header, description, children }) => {
  return (
    <>
      <Background>
        <BackgroundHeader>{header}</BackgroundHeader>
        {description ? <BackgroundDescription>{description}</BackgroundDescription> : null}
      </Background>
      <BackgroundBody>{children}</BackgroundBody>
    </>
  );
};
