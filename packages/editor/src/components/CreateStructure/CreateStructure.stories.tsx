import React from 'react';
import { CreateStructure } from './CreateStructure';

export default { title: 'Components|Create structure' };

export const Simple: React.FC = () => <CreateStructure handleChoice={choice => alert(`You chose ${choice}`)} />;
