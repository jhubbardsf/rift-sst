/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'sst',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            // protect: ['production'].includes(input?.stage),
            home: 'aws',
        };
    },
    async run() {
        // Get stage from context or default to development
        const stage = process.env.SST_STAGE || 'development';

        // Define allowed origins per stage (exclude localhost)
        const allowedOrigins = stage === 'production' ? ['https://app.rift.exchange', 'https://rift.exchange'] : ['*'];

        // API Gateway with CORS restricting to allowedOrigins
        const tokenColorsFunction = new sst.aws.Function('RiftTokenColorsFunction', {
            handler: 'functions/token-colors.handler',
            environment: {
                STAGE: stage,
            },
            url: {
                cors: {
                    allowOrigins: allowedOrigins,
                    allowMethods: ['GET'],
                    allowHeaders: ['*'],
                },
            },
        });
    },
});
