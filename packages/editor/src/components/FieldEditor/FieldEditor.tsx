import copy from 'fast-copy';
import React, { useContext, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Button } from '../../atoms/Button';
import { Segment } from '../../atoms/Segment';
import { PluginContext } from '@capture-models/plugin-api';
import { generateId } from '@capture-models/helpers';
import { ConfirmButton } from '../../atoms/ConfirmButton';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { ChooseFieldButton } from '../ChooseFieldButton/ChooseFieldButton';
import { BaseField, BaseSelector, SelectorTypeMap } from '@capture-models/types';
import { FormPreview } from '../FormPreview/FormPreview';
import {
  StyledCheckbox,
  StyledFormField,
  StyledFormInputElement,
  StyledFormLabel,
  StyledFormTextarea,
} from '../../atoms/StyledForm';
import { AutoSaveFormik } from '../AutoSaveFormik/AutoSaveFormik';
import { MultiDropdown } from '../../atoms/MultiDropdown';

export type FieldSource = {
  id: string;
  name: string;
  description?: string;
  defaultProps?: any;
  fieldTypes: string[];
};

export const FieldEditor: React.FC<{
  field: BaseField;
  term?: string;
  onSubmit: (newProps: BaseField, term?: string) => void;
  onDelete?: (term?: string) => void;
  onChangeFieldType?: (type: string, defaults: any, term?: string) => void;
  setSaveHandler?: (handler: () => void) => void;
  sourceTypes?: Array<FieldSource>;
}> = ({ onSubmit, onDelete, onChangeFieldType, sourceTypes, field: props, term }) => {
  const ctx = useContext(PluginContext);
  const { fields, selectors } = useContext(PluginContext);
  const [selector, setSelector] = useState<BaseSelector | undefined>(props.selector);
  const field = ctx.fields[props.type];
  const [defaultValue, setDefaultValue] = useState<any>(props.value);

  if (!field) {
    throw new Error('Plugin does not exist');
  }

  const editorProps = field.mapEditorProps ? field.mapEditorProps(props) : props;
  const editor = React.createElement(field.Editor, editorProps as any);
  const dataSources = (sourceTypes || []).filter(sourceType => {
    return sourceType.fieldTypes.indexOf(props.type) !== -1;
  });
  const [dataSource, setDataSource] = useState<string[]>(props.dataSources || []);

  return (
    <React.Suspense fallback="loading...">
      <Formik
        initialValues={props}
        onSubmit={newProps => {
          if (field.onEditorSubmit) {
            onSubmit(
              field.onEditorSubmit({
                ...newProps,
                type: props.type,
                selector,
                dataSources: dataSource && dataSource.length ? dataSource : undefined,
                value: defaultValue,
              }),
              term
            );
          } else {
            onSubmit(
              {
                ...newProps,
                type: props.type,
                selector,
                dataSources: dataSource && dataSource.length ? dataSource : undefined,
                value: defaultValue,
              },
              term
            );
          }
        }}
      >
        <Form>
          <AutoSaveFormik />
          <Segment>
            <h3 style={{ textAlign: 'center' }}>Preview</h3>
            <FormPreview
              key={`${props.type}-${term}`}
              type={props.type}
              term={term}
              defaultValue={defaultValue}
              setDefaultValue={setDefaultValue}
              mapValues={field.onEditorSubmit}
            />
          </Segment>
          <StyledFormField>
            <StyledFormLabel>
              Label
              <Field as={StyledFormInputElement} type="text" name="label" required={true} />
            </StyledFormLabel>
          </StyledFormField>
          <StyledFormField>
            <StyledFormLabel>
              Description
              <Field as={StyledFormTextarea} name="description" />
            </StyledFormLabel>
          </StyledFormField>
          {onChangeFieldType ? (
            <StyledFormField>
              <StyledFormLabel>
                Field type
                <ChooseFieldButton
                  fieldType={field.type}
                  onChange={t =>
                    t && fields[t] ? onChangeFieldType(t as any, (fields[t] as any).defaultProps, term) : null
                  }
                />
              </StyledFormLabel>
            </StyledFormField>
          ) : null}
          {dataSources ? (
            <StyledFormField>
              <StyledFormLabel>
                Dynamic data sources
                <MultiDropdown
                  placeholder="Choose data sources"
                  fluid
                  selection
                  value={dataSource}
                  onChange={val => {
                    setDataSource(val || []);
                  }}
                  options={dataSources.map(source => {
                    return {
                      key: source.id,
                      text: source.name || '',
                      value: source.id,
                    };
                  })}
                />
              </StyledFormLabel>
            </StyledFormField>
          ) : null}
          <StyledFormField>
            <StyledFormLabel>
              Choose selector (optional)
              <ChooseSelectorButton
                value={props.selector ? props.selector.type : ''}
                onChange={t => {
                  if (t) {
                    const chosenSelector = selectors[t as keyof SelectorTypeMap];
                    if (chosenSelector) {
                      setSelector({
                        id: generateId(),
                        type: chosenSelector.type,
                        state: copy(chosenSelector.defaultState),
                      });
                    }
                  } else {
                    setSelector(undefined);
                  }
                }}
              />
            </StyledFormLabel>
          </StyledFormField>
          <StyledFormField>
            <StyledFormLabel>
              <Field as={StyledCheckbox} type="checkbox" name="allowMultiple" style={{ marginRight: 10 }} />
              Allow multiple instances
            </StyledFormLabel>
          </StyledFormField>
          <StyledFormField>
            <StyledFormLabel>
              Plural label (used when referring to lists of this document)
              <Field as={StyledFormInputElement} type="text" name="pluralField" />
            </StyledFormLabel>
          </StyledFormField>
          {editor}
          <div style={{ marginTop: 20 }}>
            <Button type="submit" primary style={{ marginRight: '.5em' }}>
              Save changes
            </Button>
            {onDelete ? (
              <ConfirmButton message="Are you sure you want to remove this field?" onClick={() => onDelete(term)}>
                <Button type="button" alert>
                  Delete field
                </Button>
              </ConfirmButton>
            ) : null}
          </div>
        </Form>
      </Formik>
    </React.Suspense>
  );
};
