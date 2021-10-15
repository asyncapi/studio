import { TextField, Grid, Typography, Container } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import SplitPane from 'react-split-pane';
import React from 'react';

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
  const { control, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);

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
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
                      label="Message Name"
                      defaultValue={messageName}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="message"
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
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
              <Grid item xs={12}>
                <input type="submit" />
              </Grid>
            </form>
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIWizard;
