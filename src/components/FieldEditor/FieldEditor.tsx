import copy from 'fast-copy';
import React, { useContext, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Form as StyledForm, Grid, Label, Segment } from 'semantic-ui-react';
import { FormPreview, PluginContext } from '../../core/plugins';
import { FieldTypes } from '../../types/field-types';
import generateId from 'nanoid';
import { SelectorTypeMap, SelectorTypes } from '../../types/selector-types';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';

export const FieldEditor: React.FC<{ field: FieldTypes; term?: string; onSubmit: (newProps: FieldTypes) => void }> = ({
  onSubmit,
  field: props,
  term,
}) => {
  const ctx = useContext(PluginContext);
  const { selectors } = useContext(PluginContext);
  const [selector, setSelector] = useState<SelectorTypes | undefined>();

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  // @ts-ignore
  const editor = React.createElement(field.Editor, props);

  return (
    <React.Suspense fallback="loading...">
      <Formik
        initialValues={props}
        onSubmit={newProps => {
          onSubmit({
            ...newProps,
            selector,
          });
        }}
      >
        <Form className="ui form">
          <Grid columns={2}>
            <Grid.Column>
              <StyledForm.Field>
                <label>
                  Label
                  <Field type="text" name="label" required={true} />
                </label>
              </StyledForm.Field>
              <StyledForm.Field>
                <label>
                  Description
                  <Field as="textarea" name="description" />
                </label>
              </StyledForm.Field>
              <StyledForm.Field>
                <label>
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
                </label>
              </StyledForm.Field>
              {/* @todo hookup term/vocab selector when we implement JSON-LD Extension */}
              {/*<StyledForm.Field>*/}
              {/*  <label>*/}
              {/*    Term*/}
              {/*    <Field type="text" name="term" />*/}
              {/*  </label>*/}
              {/*</StyledForm.Field>*/}
              {/* @todo selector selector */}
              {editor}
            </Grid.Column>
            <Grid.Column>
              <Segment padded color="orange" placeholder>
                <Label attached="top right" color="orange">
                  Preview
                </Label>
                <FormPreview term={term} />
              </Segment>
            </Grid.Column>
          </Grid>
          <div style={{ marginTop: 20 }}>
            <Button type="submit" primary>
              Save changes
            </Button>
          </div>
        </Form>
      </Formik>
    </React.Suspense>
  );
};
