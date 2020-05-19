import React from 'react';
import { ChooseSelectorButton } from './ChooseSelectorButton';

export default { title: 'Components|Choose Selector Button' };

export const Simple: React.FC = () => <ChooseSelectorButton value="box-selector" onChange={t => console.log(t)} />;
