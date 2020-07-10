import React, { useMemo } from 'react';
import { BaseField, FieldComponent } from '@capture-models/types';
import RichTextEditor, { EditorValue } from 'react-rte';
import { useDebouncedCallback } from 'use-debounce';

export interface HTMLFieldProps extends BaseField {
  type: 'html-field';
  allowedTags?: string[];
  format?: 'html' | 'markdown';
  value: string;
  enableHistory?: boolean;
  enableExternalImages?: boolean;
  enableLinks?: boolean;
}

const INLINE_STYLE_BUTTONS = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Strikethrough', style: 'STRIKETHROUGH' },
  { label: 'Monospace', style: 'CODE' },
  { label: 'Underline', style: 'UNDERLINE' },
];

const BLOCK_TYPE_DROPDOWN = [
  { label: 'Normal', style: 'unstyled' },
  { label: 'Heading Large', style: 'header-one' },
  { label: 'Heading Medium', style: 'header-two' },
  { label: 'Heading Small', style: 'header-three' },
  { label: 'Code Block', style: 'code-block' },
];
const BLOCK_TYPE_BUTTONS = [
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Blockquote', style: 'blockquote' },
];

const defaultEditorToolbarConfig: any = {
  display: [
    'BLOCK_TYPE_DROPDOWN',
    'INLINE_STYLE_BUTTONS',
    'BLOCK_TYPE_BUTTONS',
  ],
  INLINE_STYLE_BUTTONS,
  BLOCK_TYPE_DROPDOWN,
  BLOCK_TYPE_BUTTONS,
};

export const HTMLField: FieldComponent<HTMLFieldProps> = ({
  value,
  format = 'html',
  updateValue,
  enableExternalImages,
  enableHistory,
  enableLinks,
}) => {
  const [initialValue, setValue] = React.useState<EditorValue>(() =>
    RichTextEditor.createValueFromString(value, format)
  );

  const toolbarConfig = useMemo(() => {
    const display = ['BLOCK_TYPE_DROPDOWN', 'INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS'];

    if (enableExternalImages) {
      display.push('IMAGE_BUTTON');
    }

    if (enableHistory) {
      display.push('HISTORY_BUTTONS');
    }

    if (enableLinks) {
      display.push('LINK_BUTTONS');
    }

    return { ...defaultEditorToolbarConfig, display };
  }, [enableExternalImages, enableHistory, enableLinks]);

  const [updateExternalValue] = useDebouncedCallback((v: EditorValue) => {
    updateValue(v.toString(format));
  }, 200);

  return (
    <RichTextEditor

      toolbarConfig={toolbarConfig}
      value={initialValue}
      editorStyle={{ fontFamily: 'sans-serif' }}
      onChange={e => {
        setValue(e);
        updateExternalValue(e);
      }}
    />
  );
};

export default HTMLField;
