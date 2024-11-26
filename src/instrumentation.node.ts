'use strict'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Add otel logging
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR); // set diaglog level to DEBUG when debugging

const exporterOptions = {
    url: 'http://10.5.3.2:4318/v1/traces',
    headers: { 'signoz-access-token': 'SIGNOZ_INGESTION_KEY' },
}

export const traceExporter = new OTLPTraceExporter(exporterOptions);
