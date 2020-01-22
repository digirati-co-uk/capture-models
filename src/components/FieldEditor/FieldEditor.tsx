import React, { useContext } from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, Form as StyledForm, Grid, Label, Segment } from 'semantic-ui-react';
import { FormPreview, PluginContext } from '../../core/plugins';
import { FieldTypes } from '../../types/field-types';

export const FieldEditor: React.FC<{ field: FieldTypes; term?: string; onSubmit: (newProps: FieldTypes) => void }> = ({
  onSubmit,
  field: props,
  term,
}) => {
  const ctx = useContext(PluginContext);

  const field = ctx.fields[props.type];
  if (!field) {
    throw new Error('Plugin does not exist');
  }

  // @ts-ignore
  const editor = React.createElement(field.Editor, props);

  return (
    <React.Suspense fallback="loading...">
      <Formik initialValues={props} onSubmit={onSubmit}>
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
