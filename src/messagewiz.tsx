import { TextField, Grid, Typography, Container, Button, Paper } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import React, { useState } from 'react';
import { createSchema } from 'genson-js';
import YAML from 'js-yaml';
import { useSpec, MessageProps, SpecBuilder, ChannelProps, YamlSpec } from './specContext';

const AsyncAPIMessageWizard: React.FunctionComponent<MessageProps> = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [specData, setsSpecData] = useState<YamlSpec>({ spec: '' });
  const history = useHistory();
  const { addSpec } = useSpec();
  const onSubmit = async (data: MessageProps) => {
    const schema: any = createSchema(JSON.parse(data.message!));
    const messageSpecObj: any = {
      components: {
        messages: {
          [data.messageName]: {
            payload: schema,
          },
        },
      },
    };

    const spec: string = YAML.dump({ asyncapi: '2.2.0', ...messageSpecObj });
    const specBuilder: SpecBuilder = {
      messageSpec: {
        messageName: data.messageName,
        message: data.message,
      },
      aggregatedSpec: messageSpecObj,
      channelSpec: {} as ChannelProps,
    };
    addSpec(specBuilder);
    setsSpecData({ spec });

    // const doc = await parse(spec);
    // console.log(doc);
  };

  const renderNextButton = (specData: YamlSpec) => {
    if (specData.spec !== '') {
      return (
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => history.push('/channelwiz')}>
            Next Define A Channel
          </Button>
        </Grid>
      );
    }
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
            {renderNextButton(specData)}
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIMessageWizard;
