import React, { useMemo } from 'react';
import { customAlphabet, urlAlphabet } from 'nanoid';

import { presets, TagDefinition, TaggedTextFieldProps } from './TaggedTextField';
import { HTMLPreviewContainer } from '../HTMLField/HTMLField.preview';

function parseTags(prefix: string, tags: TagDefinition) {
  if (!tags.backgroundColor && !tags.color) {
    return '';
  }

  const selector = tags.isHTML ? tags.tag : `[data-tag="${tags.tag}"]`;
  return `
    ${prefix} ${selector} {
      ${tags.backgroundColor ? `background: ${tags.backgroundColor};` : ''}
      ${tags.color ? `color: ${tags.color};` : ''}
    }`;
}

function parseStyles(prefix: string, { tags = [], blocks = [] }: { tags?: TagDefinition[]; blocks?: TagDefinition[] }) {
  return `
    ${tags
      .map(tag => parseTags(prefix, tag))
      .filter(e => e)
      .join('')}
    ${blocks
      .map(block => parseTags(prefix, block))
      .filter(e => e)
      .join('')}
  `;
}

export const TaggedTextFieldPreview: React.FC<TaggedTextFieldProps> = ({ value, tags, blocks, preset }) => {
  const id = useMemo(() => customAlphabet(urlAlphabet, 10)(), []);
  const styles = useMemo(() => {
    return parseStyles(`.tagged-${id}`, preset && presets[preset] ? presets[preset] : { tags, blocks });
  }, [id, preset, tags, blocks]);

  if (!value) {
    return <span style={{ color: '#999' }}>No value</span>;
  }

  return (
    <>
      <div className={`tagged-${id}`}>
        <HTMLPreviewContainer dangerouslySetInnerHTML={{ __html: value }} />
      </div>
      <style>{styles}</style>
    </>
  );
};
