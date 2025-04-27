import { handler as tokenColorsHandler } from './functions/token-colors';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

const server = Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === '/' && req.method === 'GET') {
            return new Response('Hello World!');
        }

        // Route for token-colors function
        if (url.pathname === '/api/token-colors' && req.method === 'GET') {
            // Create API Gateway event from HTTP request
            const headers: Record<string, string> = {};
            req.headers.forEach((value, key) => {
                headers[key] = value;
            });

            const event: APIGatewayProxyEventV2 = {
                version: '2.0',
                routeKey: '$default',
                rawPath: url.pathname,
                rawQueryString: url.search.substring(1),
                headers,
                queryStringParameters: Object.fromEntries(url.searchParams.entries()),
                requestContext: {
                    accountId: 'local',
                    apiId: 'local',
                    domainName: url.hostname,
                    domainPrefix: 'local',
                    http: {
                        method: req.method,
                        path: url.pathname,
                        protocol: 'HTTP/1.1',
                        sourceIp: '127.0.0.1',
                        userAgent: req.headers.get('user-agent') || '',
                    },
                    requestId: crypto.randomUUID(),
                    routeKey: '$default',
                    stage: '$default',
                    time: new Date().toISOString(),
                    timeEpoch: Date.now(),
                },
                isBase64Encoded: false,
            };

            // Call the Lambda handler
            const result = await tokenColorsHandler(event);

            // Transform Lambda response to HTTP response
            const responseHeaders: HeadersInit = {};
            if (result.headers) {
                Object.entries(result.headers).forEach(([key, value]) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        responseHeaders[key] = String(value);
                    }
                });
            }

            return new Response(result.body, {
                status: result.statusCode,
                headers: responseHeaders,
            });
        }

        return new Response('404!', { status: 404 });
    },
});

console.log(`Listening on ${server.url}`);
console.log(`Token colors API available at ${server.url}api/token-colors?url=IMAGE_URL`);
