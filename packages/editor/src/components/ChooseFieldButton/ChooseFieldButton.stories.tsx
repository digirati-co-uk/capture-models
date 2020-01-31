import React from 'react';
import { ChooseFieldButton } from './ChooseFieldButton';

export default { title: 'Components|Choose Field Button' };

export const Simple: React.FC = () => <ChooseFieldButton onChange={t => console.log(t)} />;
