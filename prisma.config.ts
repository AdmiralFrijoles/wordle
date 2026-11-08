import {defineConfig} from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        seed: 'ts-node --compiler-options {"module":"commonjs","moduleResolution":"classic","resolveJsonModule":false} --transpile-only prisma/seed.ts',
    },
});
