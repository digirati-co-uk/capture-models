import { Field } from 'formik';
import React from 'react';
import { Form } from 'semantic-ui-react';

type Props = {
  placeholder?: string;
  required?: boolean;
  icon?: string;
  iconPosition?: 'left';
};

const TextFieldEditor: React.FC<Props> = ({ children, ...props }) => {
  return (
    <>
      <Form.Field>
        <label>
          Placeholder
          <Field type="text" name="placeholder" required={false} />
        </label>
      </Form.Field>
    </>
  );
};

export default TextFieldEditor;
