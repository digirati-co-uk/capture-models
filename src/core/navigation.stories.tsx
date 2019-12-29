import React from 'react';
import { CaptureModelProvider } from './capture-model-provider';
import { useNavigation } from './navigation';

const withSimpleCaptureModel = (Component: React.FC): React.FC => () => (
  <CaptureModelProvider captureModel={require('../../fixtures/simple.json')}>
    <Component />
  </CaptureModelProvider>
);

export default {
  title: 'Core|Navigation',
};

export const Nested: React.FC = withSimpleCaptureModel(() => {
  const { currentView, pushPath, currentPath, popPath } = useNavigation();

  if (!currentView) {
    return null;
  }

  return (
    <div>
      {currentPath.length ? <button onClick={popPath}>back</button> : null}
      <h1>{currentView.label}</h1>
      <p>{currentView.description}</p>
      <ul>
        {currentView.type === 'choice'
          ? currentView.items.map((item, idx) => (
              <li key={idx} onClick={() => pushPath(idx)}>
                {item.label}
              </li>
            ))
          : 'We are on a form!'}
      </ul>
    </div>
  );
});
