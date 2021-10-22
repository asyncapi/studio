import SplitPane from 'react-split-pane';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Grid,
  Typography,
  Container,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import React from 'react';
import { useSpec, ChannelProps } from './specContext';

const AsyncAPIChannelWizard: React.FunctionComponent<ChannelProps> = () => {
  const { spec } = useSpec();
  console.log(spec);
  let selectedProtocol = '';
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: ChannelProps) => {
    console.log(data);
  };

  const renderChannelBindings = (protocol: string) => {
    console.log(protocol);
    if (selectedProtocol === 'amqp') {
      return <Grid item xs={12}></Grid>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full h-screen">
      <SplitPane minSize={700} maxSize={900}>
        <Container>
          <Grid container spacing={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4">
                  Channel
                </Typography>
                {/* <Typography gutterBottom variant="h4">
                  {spec.messageSpec.messageName}
                </Typography> */}
                <Typography variant="subtitle1" gutterBottom>
                  A channel is an addressable component, made available by the server, for the organization of messages.
                  Producer applications send messages to channels and consumer applications consume messages from
                  channels.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="channelName"
                  rules={{ required: true, validate: () => getValues('channelName').length <= 20 }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.channelName);
                    return (
                      <TextField
                        error={error}
                        onChange={onChange}
                        value={value || ''}
                        label="Channel Name"
                        variant="outlined"
                        fullWidth
                        helperText={error && 'Message name must be less than 20 characters'}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Operation Type</InputLabel>
                  <Controller
                    control={control}
                    name="operationType"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => {
                      // const error = Boolean(errors && errors.channelName);
                      return (
                        <Select onChange={onChange} value={value || ''} variant="outlined">
                          <MenuItem value={'publish'}>Publish</MenuItem>
                          <MenuItem value={'subscribe'}>Subscribe</MenuItem>
                        </Select>
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Protocol Type</InputLabel>
                  <Controller
                    control={control}
                    name="protocolType"
                    rules={{ required: true }}
                    render={({ field }) => {
                      // const error = Boolean(errors && errors.channelName);
                      const { onChange, value } = field;
                      return (
                        <Select
                          onChange={(e) => {
                            onChange(e);
                            selectedProtocol = e.target.value as string;
                          }}
                          value={value || ''}
                          variant="outlined"
                        >
                          <MenuItem value={'amqp'}>amqp</MenuItem>
                        </Select>
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              {renderChannelBindings(selectedProtocol)}
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
          </Grid>
        </Container>
      </SplitPane>
    </div>
  );
};

export default AsyncAPIChannelWizard;
