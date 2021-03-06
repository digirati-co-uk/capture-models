import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { Tag } from '../../atoms/Tag';

type FieldHeaderProps = {
  labelFor?: string;
  label: string;
  selectorLabel?: string;
  showTerm?: boolean;
  term?: string;
  description?: string;
  selectorComponent?: any;
  onSelectorClose?: () => void;
  onSelectorOpen?: () => void;
};

export const FieldHeaderWrapper = styled.div`
  font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans',
    'Helvetica Neue', 'Icons16', sans-serif;
  line-height: 1.8em;
  margin: 0.5em 0;
`;

const FieldHeaderTop = styled.div`
  display: flex;
`;

const FieldHeaderLeft = styled.div`
  flex: 1 1 0px;
`;

export const FieldHeaderTitle = styled.label`
  letter-spacing: -0.3px;
  font-weight: 500;
  font-size: 1.3em;
  .ui.tiny.label {
    margin-left: 0.5em;
  }
`;

const FieldHeaderSubtitle = styled.label`
  letter-spacing: -0.25px;
  font-size: 1em;
  padding-bottom: 0.3em;
  display: block;
`;

const FieldHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldHeaderIcon = styled.div<{ open?: boolean }>`
  padding: 0.5em 1em;
  cursor: pointer;
  margin-top: auto;
  background: transparent;
  color: #6041e2;
  transition: transform 0.5s, background-color 0.5s, color 0.5s;
  margin-bottom: 0.5em;
  transform: translateY(0);
  &:hover {
    background: #eee;
  }
  ${props =>
    props.open
      ? css`
          color: #fff;
          background: #aaa7de;
          transform: translateY(0.5em);
          &:hover {
            background: #aaa7de;
          }
        `
      : ``}
`;

const FieldHeaderBottom = styled.div<{ open?: boolean }>`
  transition: max-height 0.3s;
  overflow: hidden;
  height: auto;
  ${props => (props.open ? `max-height: 500px;` : `max-height: 0;`)}
`;

const FieldHeaderBottomInner = styled.div`
  background: #aaa7de;
  color: #fff;
  padding: 0.7em;
  margin-bottom: 0.5em;
`;

export const FieldHeader: React.FC<FieldHeaderProps> = ({
  description,
  term,
  selectorComponent,
  showTerm,
  labelFor,
  label,
  onSelectorClose,
  onSelectorOpen,
  selectorLabel,
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
    <FieldHeaderWrapper>
      <FieldHeaderTop>
        <FieldHeaderLeft>
          <FieldHeaderTitle htmlFor={labelFor}>
            {label} {showTerm && term ? <Tag size="tiny">{term}</Tag> : null}
          </FieldHeaderTitle>
          {description ? <FieldHeaderSubtitle htmlFor={labelFor}>{description}</FieldHeaderSubtitle> : null}
        </FieldHeaderLeft>
        {selectorComponent ? (
          <FieldHeaderRight onClick={toggleSelector}>
            <FieldHeaderIcon open={open}>{selectorLabel || 'Define region'}</FieldHeaderIcon>
          </FieldHeaderRight>
        ) : null}
      </FieldHeaderTop>
      {selectorComponent ? (
        <FieldHeaderBottom open={open}>
          <FieldHeaderBottomInner>{selectorComponent ? selectorComponent : null}</FieldHeaderBottomInner>
        </FieldHeaderBottom>
      ) : null}
    </FieldHeaderWrapper>
  );
};
