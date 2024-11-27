import { registerOTel } from '@vercel/otel'
import { traceExporter } from './instrumentation.node';

export function register() {
    registerOTel({
        serviceName: process.env.OTEL_SERVICE_NAME ?? "wordle-app",
        traceExporter: traceExporter
    });
}