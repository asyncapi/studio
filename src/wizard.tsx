import { TextField, Grid, Typography, Container, Button, Paper } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import SplitPane from 'react-split-pane';
import React, { useState } from 'react';
import { createSchema } from 'genson-js';
import YAML from 'js-yaml';

interface WizardProps {
  message: string;
  messageName: string;
}

interface YamlSpec {
  spec: string;
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
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [specData, setsSpecData] = useState<YamlSpec>({ spec: '' });
  const onSubmit = (data: WizardProps) => {
    const schema: any = createSchema(JSON.parse(data.message!));
    const schemaWithName: any = {};
    schemaWithName[data.messageName] = schema;
    const components: any = {
      components: {
        messages: schemaWithName,
      },
    };

    const spec: string = YAML.dump(components);
    setsSpecData({ spec });
  };
  // console.log(errors);
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
                  rules={{ required: true, validate: () => getValues('messageName').length <= 20 }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.messageName);
                    return (
                      <TextField
                        error={error}
                        onChange={onChange}
                        value={value || ''}
                        label="Message Name"
                        variant="outlined"
                        fullWidth
                        helperText={error && 'Message name must be less than 20 characters'}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="message"
                  rules={{
                    validate: () => {
                      try {
                        JSON.parse(getValues('message'));
                        return true;
                      } catch {
                        return false;
                      }
                    },
                  }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.message);
                    return (
                      <TextField
                        onChange={onChange}
                        value={value || ''}
                        label="JSON Message / Schema"
                        multiline
                        minRows={4}
                        fullWidth
                        variant="outlined"
                        error={!!error}
                        helperText={error && 'Please enter a valid JSON'}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Grid>
            </form>
          </Grid>
        </Container>
        <Container>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h4">
                Spec Output
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper variant="outlined" square>
                <pre>{specData.spec}</pre>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIWizard;
