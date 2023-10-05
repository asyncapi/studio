import { ChipInput } from '@asyncapi/studio-ui';

export default {
  component: ChipInput,
};

export const Default = () => <ChipInput initialChips={['production', 'platform']} />;
