'use strict'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Add otel logging
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const exporterOptions = {
    url: process.env.SIGNOZ_INGESTION_URL,
    headers: { 'signoz-access-token': process.env.SIGNOZ_INGESTION_KEY ?? "" },
}

export const traceExporter = new OTLPTraceExporter(exporterOptions);
