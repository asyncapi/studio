const pipeline = require('../../src/lib/pipeline');

describe('Pipeline', () => {
  describe('#exec', () => {
    it('works', async () => {
      expect.assertions(1);

      pipeline.append('test', [
        (info, next) => {
          info.step1 = true;
          next(null);
        },
        (info, next) => {
          info.step2 = true;
          next(null);
        },
      ]);

      await expect(pipeline.exec('test', { a: 1 })).resolves.toStrictEqual({
        a: 1,
        step1: true,
        step2: true,
        params: {},
      });
    });

    it('fails when a step fails', async () => {
      expect.assertions(1);

      pipeline.append('test', [
        (info, next) => {
          next(new Error('test-fail!'));
        },
        (info, next) => {
          info.step2 = true;
          next(null);
        },
      ]);

      await expect(pipeline.exec('test', { a: 1 })).rejects.toStrictEqual(new Error('test-fail!'));
    });

    it('fails with an Error object when a step fails', async () => {
      expect.assertions(1);

      pipeline.append('test', [
        (info, next) => {
          next('test-fail!');
        },
        (info, next) => {
          info.step2 = true;
          next(null);
        },
      ]);

      await expect(pipeline.exec('test', { a: 1 })).rejects.toStrictEqual(new Error('test-fail!'));
    });
  });

  describe('#append', () => {
    it('creates the pipeline if it does not exist', async () => {
      pipeline.append('test-append-without-creating', (info, next) => {
        next(null);
      });

      expect(pipeline.get('test-append-without-creating').length).toEqual(1);
    });
  });
});
