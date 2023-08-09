import React from 'react';
import * as Form from '@radix-ui/react-form';
import Select from './FormInputs/Select';

export const ServerForm = () => (
  <Form.Root>
    <Form.Field name='protocol'>
      <Form.Label>Protocol</Form.Label>
      <Form.Control asChild>
        <Select />
      </Form.Control>
    </Form.Field>
  </Form.Root>
);