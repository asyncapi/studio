import { TextField, Grid, Typography, Container, Button, Paper } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import React, { useState } from 'react';
import YAML from 'js-yaml';
import { useSpec, InfoProps, MessageProps, YamlSpec, SpecBuilder, ChannelProps } from './specContext';

const AsyncAPIInfoWizard: React.FunctionComponent<InfoProps> = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [specData, setsSpecData] = useState<YamlSpec>({ spec: '' });
  const history = useHistory();
  const { addSpec } = useSpec();
  const onSubmit = (data: InfoProps) => {
    console.log(data);
    const infoSpecObj: any = {
      info: {
        title: data.title,
        version: data.version,
      },
    };
    const spec: string = YAML.dump({ asyncapi: '2.2.0', ...infoSpecObj });
    setsSpecData({ spec });
    const specBuilder: SpecBuilder = {
      messageSpec: {} as MessageProps,
      aggregatedSpec: infoSpecObj,
      channelSpec: {} as ChannelProps,
      infoSpec: {
        title: data.title,
        version: data.version,
      },
    };
    addSpec(specBuilder);
  };

  const renderNextButton = (specData: YamlSpec) => {
    if (specData.spec !== '') {
      return (
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => history.push('/messagewiz')}>
            Next Define A Message
          </Button>
        </Grid>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full h-screen">
      <SplitPane minSize={700} maxSize={900}>
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4">
                  Info
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Let us start by giving the API a title and a version. The object provides metadata about the API. The
                  metadata can be used by the clients if needed.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: true, validate: () => getValues('title').length <= 20 }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.title);
                    return (
                      <TextField
                        error={error}
                        onChange={onChange}
                        value={value || ''}
                        label="Title"
                        variant="outlined"
                        fullWidth
                        helperText={error && 'Title must be less than 20 characters'}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="version"
                  rules={{ required: true, validate: () => getValues('version').length <= 20 }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.version);
                    return (
                      <TextField
                        error={error}
                        onChange={onChange}
                        value={value || ''}
                        label="Version"
                        variant="outlined"
                        fullWidth
                        helperText={error && 'Version must be less than 20 characters'}
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

export default AsyncAPIInfoWizard;
