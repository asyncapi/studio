import { AbstractService } from './abstract.service';

import { convert } from '@asyncapi/converter';
import toast from 'react-hot-toast';

import type { AsyncAPIConvertVersion, ConvertOptions } from '@asyncapi/converter';

export class ConverterService extends AbstractService {
  async convert(
    spec: string,
    version?: AsyncAPIConvertVersion,
    options?: ConvertOptions,
  ): Promise<string> {
    version = version || this.svcs.specificationSvc.latestVersion;

    try {
      const converted = convert(spec, version, options);
      if (typeof converted === 'object') {
        return JSON.stringify(converted, undefined, 2);
      }
      return converted;
    } catch (err: any) {
      toast.error(`Conversion Failed: ${err.message}`, { duration: Infinity });
      console.error(err);
      throw err;
    }
  }
}