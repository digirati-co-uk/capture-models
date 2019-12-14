import React from 'react';
import { CaptureModel, StructureType } from '../../types/capture-model';
import { ViewChoice } from './ViewChoice';

export default { title: 'Structure|View Choice' };

const model: CaptureModel = require('../../../fixtures/simple.json');

export const Simple: React.FC = () => (
  <div style={{ padding: 40 }}>
    <ViewChoice
      onAddChoice={() => console.log('add choice')}
      onClickChoice={choice => console.log('clicked choice', choice)}
      choice={model.structure as StructureType<'choice'>}
    />
  </div>
);
