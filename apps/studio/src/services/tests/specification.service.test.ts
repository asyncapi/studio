import { createServices } from '../';

import type { SpecificationService } from '../specification.service';

describe('SpecificationService', () => {
  let specificationSvc: SpecificationService;

  beforeAll(async () => {
    const services = await createServices();
    specificationSvc = services.specificationSvc;
  });

  describe('.specs', () => {
    test('should return available schemas object', () => {
      const specs = specificationSvc.specs;
      expect(specs).toBeDefined();
      expect(typeof specs).toBe('object');
      expect(Object.keys(specs).length).toBeGreaterThan(0);
    });
  });

  describe('.latestVersion', () => {
    test('should return the latest specification version string', () => {
      const latestVersion = specificationSvc.latestVersion;
      expect(typeof latestVersion).toBe('string');
      expect(latestVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('.getSpec()', () => {
    test('should return spec definition for valid version', () => {
      const spec = specificationSvc.getSpec('2.6.0' as any);
      expect(spec).toBeDefined();
    });

    test('should return undefined for non-existent version', () => {
      const spec = specificationSvc.getSpec('99.99.99' as any);
      expect(spec).toBeUndefined();
    });
  });
});
