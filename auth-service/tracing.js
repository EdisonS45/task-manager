// tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Enable basic logs for debugging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// Export metrics for Prometheus (on port 9464)
const prometheusExporter = new PrometheusExporter({ port: 9464 });

// Export traces via OTLP (to Collector)
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://otel-collector:4318/v1/traces',
});

const sdk = new NodeSDK({
  traceExporter,
  // FIX 1: The 'metricReader' option is deprecated. Use 'metricReaders' (plural) instead.
  metricReaders: [prometheusExporter],
  instrumentations: [getNodeAutoInstrumentations()],
});

// FIX 2: sdk.start() is synchronous (returns void) and does not return a Promise,
// so the .then() and .catch() calls that caused the TypeError must be removed.
try {
  sdk.start();
  console.log('✅ OpenTelemetry initialized for Auth Service');
} catch (err) {
  console.error('OpenTelemetry initialization failed:', err);
}

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry shut down'))
    .catch(console.error);
});