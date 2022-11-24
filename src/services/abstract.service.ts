import type { Services } from './index';

export abstract class AbstractService {
  constructor(
    protected readonly svcs: Services = {} as Services,
  ) {}

  public onInit(): void | Promise<void> {}
}
