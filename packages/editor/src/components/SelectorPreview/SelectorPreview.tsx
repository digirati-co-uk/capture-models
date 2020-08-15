import React, { ComponentClass, FunctionComponent } from 'react';
import { useSelectorStatus } from '../../../../plugin-api/lib/hooks/use-selector-status';
import { BaseField } from '../../../../types/src/field-types';
import { BaseSelector } from '../../../../types/src/selector-types';

export const SelectorPreview: React.FC<{
  selector?: BaseSelector;
  chooseSelector?: (payload: { selectorId: string }) => void;
  currentSelectorId?: string | null;
  selectorPreview?: any;
}> = ({ chooseSelector, selectorPreview, currentSelectorId, selector }) => {
  return useSelectorStatus(selector, {
    currentSelectorId: currentSelectorId ? currentSelectorId : undefined,
    chooseSelector: selectorId => (chooseSelector ? chooseSelector({ selectorId }) : undefined),
    selectorPreview,
    readOnly: true,
  });
};
