import React from "react"
import * as Form from "@radix-ui/react-form"

export const ServerForm = () => (
  <Form.Root>
    <Form.Field name="protocol">
      <Form.Label>Protocol</Form.Label>
      <Form.Control asChild></Form.Control>
    </Form.Field>
  </Form.Root>
)
