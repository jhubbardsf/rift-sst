import { ApiHandler } from "sst/node/api";
import { Vibrant } from 'node-vibrant/node';
import Sharp from 'sharp';

// In-memory cache for color results
const cache = new Map<string, { borderColor: string; bgColor: string }>();

// Ensure bg is dark enough for white text
function ensureDarkEnoughColor(hex: string, minLum: number = 0.5): string {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum > minLum) {
        const factor = minLum / lum;
        const newR = Math.floor(r * factor * 255);
        const newG = Math.floor(g * factor * 255);
        const newB = Math.floor(b * factor * 255);
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    return hex;
}

export const handler = ApiHandler(async (evt) => {
    const queryParams = evt.queryStringParameters || {};
    const rawUrl = queryParams.url;

    if (!rawUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing `url` query parameter' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    // Return cached result if available
    if (cache.has(rawUrl)) {
        return {
            statusCode: 200,
            body: JSON.stringify(cache.get(rawUrl)),
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=86400, stale-while-revalidate'
            }
        };
    }

    try {
        const response = await fetch(rawUrl);
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Fetch failed: ${response.statusText}` }),
                headers: { 'Content-Type': 'application/json' }
            };
        }

        // Read raw buffer
        let buffer = Buffer.from(await response.arrayBuffer());
        const contentType = response.headers.get('content-type') || '';

        // Rasterize unsupported formats (WebP/AVIF) and SVG vector formats to PNG
        if (
            contentType.includes('image/webp') ||
            contentType.includes('image/avif') ||
            contentType.includes('svg+xml')
        ) {
            buffer = Buffer.from(await Sharp(buffer).png().toBuffer());
        }

        // Extract palette
        const palette = await Vibrant.from(buffer).maxColorCount(16).getPalette();

        // Pick colors
        const vibrantHex = palette.Vibrant?.hex;
        const darkVibrantHex = palette.DarkVibrant?.hex;
        const mutedHex = palette.Muted?.hex;

        const borderColor = vibrantHex || mutedHex || '#666666';
        let bgColor = darkVibrantHex || vibrantHex || mutedHex || '#333333';
        bgColor = ensureDarkEnoughColor(bgColor);

        const result = { borderColor, bgColor };
        cache.set(rawUrl, result);

        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=86400, stale-while-revalidate'
            }
        };
    } catch (err: any) {
        console.error('Palette extraction error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to process image' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
});