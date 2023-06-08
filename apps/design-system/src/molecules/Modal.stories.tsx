import { Modal } from './components/Modal';

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
    onCancel: () => alert('Cancel button clicked!'),
    onSubmit: () => alert('Submit button clicked!'),
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
          <p>This is a paragraph with a button: <button className="bg-gray-700 text-white px-2 rounded" onClick={() => alert('You clicked the button!')}>Click me!</button></p>
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
