const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const prometheusExporter = new PrometheusExporter({ port: 9464 });

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces',
});

const sdk = new NodeSDK({
  traceExporter,
  metricReaders: [prometheusExporter],
  instrumentations: [getNodeAutoInstrumentations()],
});


try {
  sdk.start();
  console.log(' OpenTelemetry initialized for Auth Service');
} catch (err) {
  console.error('OpenTelemetry initialization failed:', err);
}

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry shut down'))
    .catch(console.error);
});