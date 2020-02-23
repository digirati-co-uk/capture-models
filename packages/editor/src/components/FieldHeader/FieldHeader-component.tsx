import React, { useState } from 'react';
import { Label } from 'semantic-ui-react';
import './FieldHeader.scss';

type FieldHeaderProps = {
  labelFor?: string;
  label: string;
  showTerm?: boolean;
  term?: string;
  description?: string;
  selectorComponent?: any;
};

export const FieldHeaderComponent: React.FC<FieldHeaderProps> = ({
  description,
  term,
  selectorComponent,
  showTerm,
  labelFor,
  label,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`field-header`}>
      <div className={`field-header__top`}>
        <div className={`field-header__left`}>
          <label className={`field-header__title`} htmlFor={labelFor}>
            {label} {showTerm && term ? <Label size="tiny">{term}</Label> : null}
          </label>
          {description ? <div className={`field-header__subtitle`}>{description}</div> : null}
        </div>
        {selectorComponent ? (
          <div className={`field-header__right`} onClick={() => setOpen(s => !s)}>
            <div className={`field-header__icon ${open ? 'field-header__icon' : ''}`}>Edit Selector</div>
          </div>
        ) : null}
      </div>
      {selectorComponent ? (
        <div className={`field-header__bottom ${open ? 'field-header__bottom' : ''}`}>
          <div className={`field-header__bottom-inner`}>{selectorComponent ? selectorComponent : null}</div>
        </div>
      ) : null}
    </div>
  );
};