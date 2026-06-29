import type { Channel, Stream, Country, Category, Language } from "./types";

const BASE_URL = "https://iptv-org.github.io/api";

async function fetchJSON<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  return res.json();
}

export async function fetchChannels(): Promise<Channel[]> {
  return fetchJSON<Channel[]>("channels.json");
}

export async function fetchStreams(): Promise<Stream[]> {
  return fetchJSON<Stream[]>("streams.json");
}

export async function fetchCountries(): Promise<Country[]> {
  return fetchJSON<Country[]>("countries.json");
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>("categories.json");
}

export async function fetchLanguages(): Promise<Language[]> {
  return fetchJSON<Language[]>("languages.json");
}

export function getStreamForChannel(
  streams: Stream[],
  channelId: string
): Stream | null {
  const channelStreams = streams.filter((s) => s.channel === channelId);
  if (channelStreams.length === 0) return null;
  // Prefer HLS streams
  const hls = channelStreams.find((s) => s.url.includes(".m3u8"));
  return hls || channelStreams[0];
}

export function getStreamsForChannel(
  streams: Stream[],
  channelId: string
): Stream[] {
  return streams.filter((s) => s.channel === channelId);
}

// SWR fetcher
export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    return res.json();
  });
