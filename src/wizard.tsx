import { useForm, SubmitHandler } from 'react-hook-form';
import './style.css';

type Inputs = {
  example: string,
  exampleRequired: string,
  message: string,
  messageName: string,
};

const AsyncAPIWizard = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  // console.log(watch('example')); // watch input value by passing the name of it

  return (
    <div>
      Wizard
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>So you want to define an AsyncAPI spec.
               Tell us about the event you want to publish or subscribe to
        </label>
        <input defaultValue='Message Name' {...register('messageName')} />
        <textarea defaultValue='JSON Message / JSON Schema' {...register('message')} />

        <input type='submit' />
      </form>
    </div>
  );
};

export default AsyncAPIWizard;
