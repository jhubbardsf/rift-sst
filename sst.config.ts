/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'sst',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
        };
    },
    async run() {
        const vpc = new sst.aws.Vpc('MyVpc');

        const cluster = new sst.aws.Cluster('MyCluster', { vpc });
        const service = new sst.aws.Service('MyService', {
            cluster,
            loadBalancer: {
                ports: [{ listen: '80/http', forward: '3000/http' }],
            },
            dev: {
                command: 'bun dev',
            },
        });

        // Token colors API endpoint
        const tokenColorsApi = new sst.aws.Function('TokenColorsFunction', {
            handler: 'functions/token-colors.handler',
            url: true,
        });

        return {
            serviceUrl: service.url,
            tokenColorsUrl: tokenColorsApi.url,
        };
    },
});
