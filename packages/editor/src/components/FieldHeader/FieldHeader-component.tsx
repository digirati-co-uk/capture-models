import React, { useCallback, useState } from 'react';
import { Label } from 'semantic-ui-react';
import './FieldHeader.scss';

type FieldHeaderProps = {
  labelFor?: string;
  label: string;
  showTerm?: boolean;
  term?: string;
  description?: string;
  selectorComponent?: any;
  onSelectorClose?: () => void;
  onSelectorOpen?: () => void;
};

export const FieldHeaderComponent: React.FC<FieldHeaderProps> = ({
  description,
  term,
  selectorComponent,
  showTerm,
  labelFor,
  label,
  onSelectorClose,
  onSelectorOpen,
}) => {
  const [open, setOpen] = useState(false);

  const toggleSelector = useCallback(() => {
    if (open) {
      setOpen(false);
      if (onSelectorClose) {
        onSelectorClose();
      }
    } else {
      setOpen(true);
      if (onSelectorOpen) {
        onSelectorOpen();
      }
    }
  }, [onSelectorClose, onSelectorOpen, open]);

  return (
    <div className={`field-header`}>
      <div className={`field-header__top`}>
        <div className={`field-header__left`}>
          <label className={`field-header__title`} htmlFor={labelFor}>
            {label} {showTerm && term ? <Label size="tiny">{term}</Label> : null}
          </label>
          {description ? (
            <label className={`field-header__subtitle`} htmlFor={labelFor}>
              {description}
            </label>
          ) : null}
        </div>
        {selectorComponent ? (
          <div className={`field-header__right`} onClick={toggleSelector}>
            <div className={`field-header__icon ${open ? 'field-header__icon--open' : ''}`}>Edit Selector</div>
          </div>
        ) : null}
      </div>
      {selectorComponent ? (
        <div className={`field-header__bottom ${open ? 'field-header__bottom--open' : ''}`}>
          <div className={`field-header__bottom-inner`}>{selectorComponent ? selectorComponent : null}</div>
        </div>
      ) : null}
    </div>
  );
};
