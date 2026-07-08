'use server';

export async function extractGoogleMapsCoordinates(url: string) {
  try {
    // Basic validation
    if (!url.includes('google.com/maps') && !url.includes('goo.gl') && !url.includes('maps.app.goo.gl')) {
      return { error: 'Invalid Google Maps URL' };
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      redirect: 'follow',
      // prevent caching so we always fetch the actual redirect
      cache: 'no-store' 
    });

    const finalUrl = response.url;
    const html = await response.text();

    // 1. Try to extract from the final URL itself (often contains @lat,lng,zoom)
    let match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }

    // 2. Try to extract from a meta refresh redirect URL in the HTML
    const refreshMatch = html.match(/URL=['"]?([^'"]+)['"]?/i);
    if (refreshMatch && refreshMatch[1]) {
      const redirectUrl = refreshMatch[1];
      match = redirectUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || redirectUrl.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
      }
    }

    // 3. Try to extract from the og:image or center parameter in raw HTML
    match = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/) || html.match(/center=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }

    // 4. Fallback: look for raw arrays of coordinates in the initial payload
    match = html.match(/\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\]/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }

    return { error: 'Could not extract coordinates from the provided link.' };
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return { error: 'Failed to process the URL.' };
  }
}
