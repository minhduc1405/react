import * as React from 'react';
import {WrappedFieldInputProps} from 'redux-form';

interface FormInputProps {
  name: string;
  type: string;
  input: WrappedFieldInputProps;
  meta: any;
}

export const InputReduxFormComponent: React.SFC<FormInputProps> = ({ input, type, name, meta: { error, touched } }) => {
  return (
        <input id={name} name={name} type={type} {...input} />
  );
};
