import SplitPane from 'react-split-pane';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
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
  Link,
  styled,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Toolbar } from './components';
import { useSpec, ChannelProps, YamlSpec } from './specContext';
import YAML from 'js-yaml';

const StyledInputLabel = styled(InputLabel)({
  padding: '0 15px',
});

const StyledPaper = styled(Paper)({
  padding: '10px',
});

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
      qos: '',
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
    } else if (data.protocolType === 'mqtt') {
      channelObj[data.channelName].bindings[data.protocolType] = {
        qos: +data.qos,
      };
    }

    const newSpec = {
      aggregatedSpec: {
        asyncapi: '2.2.0',
        info: spec.aggregatedSpec.info,
        channels: channelObj,
        components: spec.aggregatedSpec.components,
      },
    };
    addSpec(newSpec);
    const specString: string = YAML.dump({ ...newSpec.aggregatedSpec });
    setsSpecData({ spec: specString });
  };
  const history = useHistory();
  const renderNextButton = (specData: YamlSpec) => {
    if (specData.spec !== '') {
      return (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              localStorage.setItem('document', specData.spec);
              history.push('/');
            }}
          >
            View In Studio
          </Button>
        </Grid>
      );
    }
  };

  const { protocolType } = watch();

  useEffect(() => {
    trigger('protocolType');
  }, [protocolType]);

  const renderChannelBindings = () => {
    const protocolType = getValues().protocolType;
    if (protocolType === 'amqp') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h5">
              AMQP Bindings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              To read more about the amqp bindings object refer to the{' '}
              <Link href="https://github.com/asyncapi/bindings/blob/master/amqp/README.md#channel">documentation</Link>
            </Typography>
          </Grid>
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
    } else if (protocolType === 'mqtt') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="h5">
              MQTT Bindings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              To read more about the mqtt bindings object refer to the{' '}
              <Link href="https://github.com/asyncapi/bindings/blob/master/mqtt/README.md#channel">documentation</Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="bindingName"
              rules={{ required: true, validate: () => getValues('bindingName').length <= 20 }}
              render={({ field: { onChange, value } }) => {
                const error = Boolean(errors && errors.bindingName);
                return (
                  <TextField
                    error={error}
                    onChange={onChange}
                    value={value || ''}
                    label="Binding Name"
                    variant="outlined"
                    fullWidth
                    helperText={error && 'Binding name must be less than 20 characters'}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name="qos"
              rules={{ required: true, validate: () => getValues('qos').length <= 20 }}
              render={({ field: { onChange, value } }) => {
                const error = Boolean(errors && errors.qos);
                return (
                  <TextField
                    error={error}
                    onChange={onChange}
                    value={value || ''}
                    label="QOS"
                    variant="outlined"
                    fullWidth
                    type="number"
                    helperText={error && 'QOS name must be less than 20 characters'}
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
      <Toolbar />
      <div className="flex flex-row flex-1">
        <SplitPane minSize={700} maxSize={900} style={{ overflow: 'visible', margin: '20px 20px 10px 10px' }}>
          <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom variant="h5">
                    Channel
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    A channel is an addressable component, made available by the server, for the organization of
                    messages. Producer applications send messages to channels and consumer applications consume messages
                    from channels. To read more about the channel object refer to the{' '}
                    <Link href="https://www.asyncapi.com/docs/specifications/v2.2.0#channelsObject">documentation</Link>
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
                  <Typography gutterBottom variant="h5">
                    Operation
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Describes a publish or a subscribe operation. This provides a place to document how and why messages
                    are sent and received. To read more about the operations object refer to the{' '}
                    <Link href="https://www.asyncapi.com/docs/specifications/v2.2.0#operationObject">
                      documentation
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <StyledInputLabel>Operation Type</StyledInputLabel>
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
                  <Typography gutterBottom variant="h5">
                    Channel Bindings
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Map describing protocol-specific definitions for a channel. To read more about the channel bindings
                    object refer to the{' '}
                    <Link href="https://www.asyncapi.com/docs/specifications/v2.2.0#channelBindingsObject">
                      documentation
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <StyledInputLabel>Protocol Type</StyledInputLabel>
                    <Controller
                      control={control}
                      name="protocolType"
                      rules={{ required: true }}
                      render={({ field }) => {
                        const { onChange, value } = field;
                        return (
                          <Select name="protocolType" onChange={onChange} value={value || ''} variant="outlined">
                            <MenuItem value={'amqp'}>amqp</MenuItem>
                            <MenuItem value={'mqtt'}>mqtt</MenuItem>
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
              </Grid>
            </form>
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
    </div>
  );
};

export default AsyncAPIChannelWizard;
