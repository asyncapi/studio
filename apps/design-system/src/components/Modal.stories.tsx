/* eslint-disable import/no-anonymous-default-export */
import { Modal } from '@asyncapi/studio-ui';

export default {
  component: Modal,
  args: {
    title: 'Modal title',
    description: 'Modal description',
    okDisabled: false,
    okText: 'Submit',
    cancelDisabled: false,
    cancelText: 'Cancel',
    containerClassName: '',
    onCancel: () => console.log('Cancel button clicked!'),
    onSubmit: () => console.log('Submit button clicked!'),
  }
};

export const NoContent = {};

export const StringContent = {
  args: {
    title: 'Modal title',
    description: 'Modal description',
    okDisabled: false,
    children: 'Hello, this is the content!'
  }
};

export const RichContent = {
  args: {
    title: 'Modal title',
    description: 'Modal description',
    okDisabled: false,
    children: (
        <>
          <p>This is a paragraph with a button: <button className="bg-gray-900 text-white px-4 rounded" onClick={() => alert('You clicked the button!')}>Click me!</button></p>
        </>
    )
  }
};

export const LongContent = {
  args: {
    title: 'Modal title',
    description: 'Modal description',
    okDisabled: false,
    children: (
      <>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
        <p>This is a paragraph.</p>
      </>
    )
  }
};
