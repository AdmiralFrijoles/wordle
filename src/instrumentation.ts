import { registerOTel } from '@vercel/otel'
import { traceExporter } from './instrumentation.node';

export function register() {
    if (process.env.NODE_ENV === "development") {
        return;
    }
    registerOTel({
        serviceName: "wordle-app",
        traceExporter: traceExporter
    });
}