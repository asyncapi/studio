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
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Paper,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSpec, ChannelProps, YamlSpec } from './specContext';
import YAML from 'js-yaml';

const AsyncAPIChannelWizard: React.FunctionComponent<ChannelProps> = () => {
  const [specData, setsSpecData] = useState<YamlSpec>({ spec: '' });
  const { spec, addSpec } = useSpec();

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      channelName: '',
      operationType: '',
      operationId: '',
      protocolType: '',
      channelBindings: {},
      bindingName: '',
      bindingType: '',
      vhost: '',
    },
  });

  const onSubmit = (data: any) => {
    const channelObj: any = {
      [data.channelName]: {
        [data.operationType]: {
          operationId: data.operationId,
          message: {
            $ref: `#/components/messages/${spec.messageSpec?.messageName}`,
          },
        },
        bindings: {},
      },
    };

    if (data.protocolType === 'amqp') {
      channelObj[data.channelName].bindings[data.protocolType] = {
        is: data.bindingType,
        vhost: data.vhost,
      };
    }

    const newSpec = { aggregatedSpec: { asyncapi: '2.2.0', channels: channelObj, ...spec.aggregatedSpec } };
    addSpec(newSpec);
    const specString: string = YAML.dump({ ...newSpec.aggregatedSpec });
    setsSpecData({ spec: specString });
  };

  const { protocolType } = watch();

  useEffect(() => {
    trigger('protocolType');
  }, [protocolType]);

  const renderChannelBindings = () => {
    if (getValues().protocolType === 'amqp') {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="bindingType"
              rules={{ required: true, validate: () => getValues('bindingType').length <= 20 }}
              render={({ field: { onChange, value } }) => {
                return (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Binding Type</FormLabel>
                    <RadioGroup onChange={onChange} value={value || ''}>
                      <FormControlLabel value="queue" control={<Radio />} label="Queue" />
                      <FormControlLabel value="exchange" control={<Radio />} label="Exchange" />
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="bindingName"
              rules={{ required: true, validate: () => getValues('bindingName').length <= 20 }}
              render={({ field: { onChange, value } }) => {
                const error = Boolean(errors && errors.channelName);
                return (
                  <TextField
                    error={error}
                    onChange={onChange}
                    value={value || ''}
                    label="Queue / Exchange Name"
                    variant="outlined"
                    fullWidth
                    helperText={error && 'Queue / Exchange name must be less than 20 characters'}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="vhost"
              rules={{ required: true, validate: () => getValues('vhost').length <= 20 }}
              render={({ field: { onChange, value } }) => {
                const error = Boolean(errors && errors.channelName);
                return (
                  <TextField
                    error={error}
                    onChange={onChange}
                    value={value || ''}
                    label="VHost"
                    variant="outlined"
                    fullWidth
                    helperText={error && 'VHost name must be less than 20 characters'}
                  />
                );
              }}
            />
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full h-screen">
      <SplitPane minSize={700} maxSize={900} style={{ overflow: 'visible' }}>
        <Container>
          <Grid container spacing={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4">
                  Channel
                </Typography>
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
                <Typography gutterBottom variant="h4">
                  Operation
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Describes a publish or a subscribe operation. This provides a place to document how and why messages
                  are sent and received.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Operation Type</InputLabel>
                  <Controller
                    control={control}
                    name="operationType"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => {
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
                <Controller
                  control={control}
                  name="operationId"
                  rules={{ required: true, validate: () => getValues('operationId').length <= 20 }}
                  render={({ field: { onChange, value } }) => {
                    const error = Boolean(errors && errors.operationId);
                    return (
                      <TextField
                        error={error}
                        onChange={onChange}
                        value={value || ''}
                        label="Operation Id"
                        variant="outlined"
                        fullWidth
                        helperText={error && 'Message name must be less than 20 characters'}
                      />
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4">
                  Channel Bindings
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Map describing protocol-specific definitions for a channel.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Protocol Type</InputLabel>
                  <Controller
                    control={control}
                    name="protocolType"
                    rules={{ required: true }}
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        <Select name="protocolType" onChange={onChange} value={value || ''} variant="outlined">
                          <MenuItem value={'amqp'}>amqp</MenuItem>
                        </Select>
                      );
                    }}
                  />
                </FormControl>
              </Grid>
              {renderChannelBindings()}
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

export default AsyncAPIChannelWizard;
