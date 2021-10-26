import { TextField, Grid, Typography, Container, Button, Paper, styled } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import React, { useState } from 'react';
import YAML from 'js-yaml';
import { Toolbar } from './components';
import { useSpec, InfoProps, MessageProps, YamlSpec, SpecBuilder, ChannelProps } from './specContext';

const StyledPaper = styled(Paper)({
  padding: '10px',
});

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
      <Toolbar />
      <div className="flex flex-row flex-1">
        <SplitPane minSize={700} maxSize={900} style={{ margin: '20px 20px 10px 10px' }}>
          <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5">
                    Info
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Let us start by giving the API a title and a version. The object provides metadata about the API.
                    The metadata can be used by the clients if needed.
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
            <Grid container spacing={2}>
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
    </div>
  );
};

export default AsyncAPIInfoWizard;
