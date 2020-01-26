import React from 'react';
import { CaptureModelProvider } from './capture-model-provider';
import { useNavigation as legacyUseNavigation } from './navigation';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../themes';
import { BackgroundSplash } from '../components/BackgroundSplash/BackgroundSplash';
import { RoundedCard } from '../components/RoundedCard/RoundedCard';
import { useNavigation } from '../hooks/useNavigation';

const simple = require('../../fixtures/simple.json');

const withSimpleCaptureModel = (Component: React.FC): React.FC => () => (
  <CaptureModelProvider captureModel={simple}>
    <Component />
  </CaptureModelProvider>
);

export default {
  title: 'Core|Navigation',
};

export const Nested: React.FC = withSimpleCaptureModel(() => {
  const { currentView, pushPath, currentPath, popPath } = legacyUseNavigation();

  if (!currentView) {
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {currentPath.length ? <button onClick={popPath}>back</button> : null}
      <BackgroundSplash header={currentView.label} description={currentView.description}>
        {currentView.type === 'choice' ? (
          currentView.items.map((item, idx) => (
            <RoundedCard label={item.label} interactive key={idx} onClick={() => pushPath(idx)}>
              {item.description}
            </RoundedCard>
          ))
        ) : (
          <RoundedCard>We are on a form!</RoundedCard>
        )}
      </BackgroundSplash>
    </ThemeProvider>
  );
});

export const NewHook: React.FC = () => {
  const [currentView, { pop, push, idStack }] = useNavigation(simple.structure);

  if (!currentView) {
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {idStack.length ? <button onClick={pop}>back</button> : null}
      <BackgroundSplash header={currentView.label} description={currentView.description}>
        {currentView.type === 'choice' ? (
          currentView.items.map((item, idx) => (
            <RoundedCard label={item.label} interactive key={idx} onClick={() => push(item.id)}>
              {item.description}
            </RoundedCard>
          ))
        ) : (
          <RoundedCard>We are on a form!</RoundedCard>
        )}
      </BackgroundSplash>
    </ThemeProvider>
  );
};
