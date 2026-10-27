import { Parser } from '@asyncapi/parser';
import examples from '../../examples';

describe('Studio Examples', () => {
  const parser = new Parser();

  test('should include RabbitMQ (AMQP) template', () => {
    const rabbitmqExample = examples.find(e => e.title === 'RabbitMQ (AMQP)');
    expect(rabbitmqExample).toBeDefined();
    expect(rabbitmqExample?.type).toEqual('protocol-example');
    expect(typeof rabbitmqExample?.template).toEqual('string');
  });

  test('should parse RabbitMQ (AMQP) template without error diagnostics', async () => {
    const rabbitmqExample = examples.find(e => e.title === 'RabbitMQ (AMQP)');
    expect(rabbitmqExample?.template).toBeDefined();
    const { document, diagnostics } = await parser.parse(rabbitmqExample?.template ?? '');
    expect(document).toBeDefined();
    const errorDiagnostics = diagnostics.filter(d => d.severity === 0);
    expect(errorDiagnostics).toHaveLength(0);
    expect(document?.version()).toEqual('3.0.0');
    expect(document?.info().title()).toEqual('RabbitMQ (AMQP) Example');
  });

  test('all examples should have title, description function, and template', () => {
    for (const example of examples) {
      expect(example.title).toBeDefined();
      expect(typeof example.description).toEqual('function');
      expect(typeof example.template).toEqual('string');
      expect(example.template.length).toBeGreaterThan(0);
    }
  });
});
