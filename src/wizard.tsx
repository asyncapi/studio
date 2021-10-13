import { TextField, Grid, Typography } from '@material-ui/core';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

type Inputs = {
  example: string;
  exampleRequired: string;
  message: string;
  messageName: string;
};

const AsyncAPIWizard = () => {
  const initialValues = {
    messageName: '',
    example: '',
    exampleRequired: '',
    message: '',
  };

  const { control, handleSubmit } = useForm<Inputs>({
    defaultValues: initialValues,
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h4">
              Message
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              A message is the mechanism by which information is exchanged via a channel between servers and
              applications. Let us define the name of the message and its JSON structure
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="messageName"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => <TextField label="Message Name" placeholder="messageName" variant="outlined" fullWidth />}
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              control={control}
              name="message"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <TextField
                  label="JSON Message / Schema"
                  placeholder="JSON Message / Schema"
                  multiline
                  minRows={4}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AsyncAPIWizard;
