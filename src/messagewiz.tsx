import { TextField, Grid, Typography, Container, Button, Paper, styled } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import React, { useState } from 'react';
import { createSchema } from 'genson-js';
import YAML from 'js-yaml';
import { useSpec, MessageProps, SpecBuilder, ChannelProps, YamlSpec } from './specContext';

const StyledPaper = styled(Paper)({
  padding: '10px',
});

const AsyncAPIMessageWizard: React.FunctionComponent<MessageProps> = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [specData, setsSpecData] = useState<YamlSpec>({ spec: '' });
  const history = useHistory();
  const { spec, addSpec } = useSpec();
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

    const specString: string = YAML.dump({ asyncapi: '2.2.0', components: messageSpecObj.components });
    const specBuilder: SpecBuilder = {
      messageSpec: {
        messageName: data.messageName,
        message: data.message,
      },
      aggregatedSpec: { ...spec.aggregatedSpec, components: messageSpecObj.components },
      channelSpec: {} as ChannelProps,
    };
    addSpec(specBuilder);
    setsSpecData({ spec: specString });

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
      <SplitPane minSize={700} maxSize={900} style={{ margin: '20px 20px 10px 10px' }}>
        <Container>
          <Grid container spacing={2}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5">
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
              </Grid>
            </form>
          </Grid>
        </Container>
        <Container>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography gutterBottom variant="h5">
                Spec Output
              </Typography>
            </Grid>
            {specData.spec && (
              <Grid item xs={12}>
                <StyledPaper variant="outlined" square>
                  <pre>{specData.spec}</pre>
                </StyledPaper>
              </Grid>
            )}
            {renderNextButton(specData)}
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIMessageWizard;
