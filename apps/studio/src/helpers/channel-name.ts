import type { ChannelInterface } from '@asyncapi/parser';

type PulsarChannelBinding = {
  persistence?: unknown;
  namespace?: unknown;
};

type PulsarServerBinding = {
  tenant?: unknown;
};

type ChannelNameFormatter = (channel: ChannelInterface) => string | undefined;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function formatPulsarChannelName(channel: ChannelInterface): string | undefined {
  const address = channel.address();
  const pulsarChannelBinding = channel.bindings().all()
    .find(binding => binding.protocol() === 'pulsar')
    ?.value<PulsarChannelBinding>();
  const persistence = pulsarChannelBinding?.persistence;
  const namespace = pulsarChannelBinding?.namespace;

  if (!isNonEmptyString(address) || !isNonEmptyString(persistence) || !isNonEmptyString(namespace)) {
    return undefined;
  }

  const tenants = channel.servers().all().flatMap(server => {
    const pulsarServerBinding = server.bindings().all()
      .find(binding => binding.protocol() === 'pulsar')
      ?.value<PulsarServerBinding>();
    const tenant = pulsarServerBinding?.tenant;

    return isNonEmptyString(tenant) ? [tenant] : [];
  });

  if (tenants.length !== 1) {
    return undefined;
  }

  return `${persistence}://${tenants[0]}/${namespace}/${address}`;
}

const protocolChannelNameFormatters: Record<string, ChannelNameFormatter> = {
  pulsar: formatPulsarChannelName,
};

export function getChannelDisplayName(channel: ChannelInterface): string {
  const address = channel.address();
  if (!isNonEmptyString(address)) {
    return 'Unknown';
  }

  for (const binding of channel.bindings().all()) {
    const formatter = protocolChannelNameFormatters[binding.protocol()];
    const formattedName = formatter?.(channel);

    if (formattedName) {
      return formattedName;
    }
  }

  return address;
}
