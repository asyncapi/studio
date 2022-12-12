import type { Services } from './index';

export abstract class AbstractService {
  constructor(
    protected readonly svcs: Services = {} as Services,
  ) {}

  public onInit(): void | Promise<void> {}
  public onAfterInit(): void | Promise<void> {}
  public onAfterAppInit(): void | Promise<void> {}
}
