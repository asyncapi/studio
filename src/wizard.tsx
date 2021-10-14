import { TextField, Grid, Typography, Container } from '@material-ui/core';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import SplitPane from 'react-split-pane';
import React from 'react';

type Inputs = {
  message: string;
  messageName: string;
};

interface WizardProps {
  message?: string;
  messageName?: string;
}

const sampleMessage = {
  id: 1,
  lumens: 2,
  sentAt: '2021-10-14',
};

const AsyncAPIWizard: React.FunctionComponent<WizardProps> = ({
  messageName = 'lightMeasured',
  message = JSON.stringify(sampleMessage, null, 2),
}) => {
  const initialValues = {
    messageName: 'lightMeasured',
    example: '',
    exampleRequired: '',
    message: '',
  };

  const { control, handleSubmit } = useForm<Inputs>({
    defaultValues: initialValues,
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="flex flex-col h-full w-full h-screen">
      <SplitPane minSize={700} maxSize={900}>
        <Container>
          <Grid container spacing={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4">
                  Message
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  A message is the mechanism by which information is exchanged via a channel between servers and
                  applications. Let us define the name of the message and its JSON structure
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="messageName"
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                  }) => <TextField label="Message Name" defaultValue={messageName} variant="outlined" fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
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
                      defaultValue={message}
                      multiline
                      minRows={4}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </form>
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIWizard;
