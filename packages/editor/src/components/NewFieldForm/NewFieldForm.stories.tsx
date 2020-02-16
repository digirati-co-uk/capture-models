import React from 'react';
import { NewFieldForm } from './NewFieldForm';

export default { title: 'Components|New Field Form' };

export const Simple: React.FC = () => <NewFieldForm existingTerms={[]} onSave={t => console.log(t)} />;
