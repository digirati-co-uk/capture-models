import React, { useState } from 'react';
import { Label } from 'semantic-ui-react';
import bem from '@fesk/bem-js';
import './FieldHeader.scss';

const $fieldHeader = bem.block('field-header');

type FieldHeaderProps = {
  labelFor: string;
  label: string;
  showTerm?: boolean;
  term?: string;
  description?: string;
  selectorComponent: any;
};

export const FieldHeader2: React.FC<FieldHeaderProps> = ({ description, term, selectorComponent, showTerm, labelFor, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={$fieldHeader}>
      <div className={$fieldHeader.element('top')}>
        <div className={$fieldHeader.element('left')}>
          <label className={$fieldHeader.element('title')} htmlFor={labelFor}>
            {label} {showTerm ? <Label size="tiny">{term}</Label> : null}
          </label>
          {description ? <div className={$fieldHeader.element('subtitle')}>{description}</div> : null}
        </div>
        {selectorComponent ? (
          <div className={$fieldHeader.element('right')} onClick={() => setOpen(s => !s)}>
            <div className={$fieldHeader.element('icon').modifiers({ open })}>Edit Selector</div>
          </div>
        ) : null}
      </div>
      {selectorComponent ? (
        <div className={$fieldHeader.element('bottom').modifiers({ open })}>
          <div className={$fieldHeader.element('bottom-inner')}>{selectorComponent ? selectorComponent : null}</div>
        </div>
      ) : null}
    </div>
  );
};
