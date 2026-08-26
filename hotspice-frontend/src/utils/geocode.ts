import * as Location from "expo-location";

export interface PickedLocation {
  latitude: number;
  longitude: number;
  addressText?: string;
  city?: string;
}

function dedupeJoin(parts: (string | undefined | null)[]): string {
  const seen = new Set<string>();
  const clean: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    const key = part.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    clean.push(part.trim());
  }
  return clean.join(", ");
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
}

// OpenStreetMap's Nominatim gives real street/neighbourhood-level results
// (no API key needed) — the on-device geocoder (Android/iOS system Geocoder)
// has very sparse data for Pakistan and tends to collapse most coordinates
// in a city down to just the city name, so it's kept only as an offline
// fallback below.
async function reverseGeocodeNominatim(
  latitude: number,
  longitude: number,
): Promise<{ addressText?: string; city?: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      { headers: { Accept: "application/json", "Accept-Language": "en" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr: NominatimAddress = data.address ?? {};
    const city = addr.city ?? addr.town ?? addr.village ?? addr.county;
    const addressText = dedupeJoin([
      addr.house_number,
      addr.road ?? addr.neighbourhood ?? addr.suburb,
      city,
      addr.state,
    ]);
    if (!addressText && !data.display_name) return null;
    return { addressText: addressText || data.display_name, city };
  } catch {
    return null;
  }
}

async function reverseGeocodeOnDevice(
  latitude: number,
  longitude: number,
): Promise<{ addressText?: string; city?: string }> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const place = results[0];
    if (!place) return {};
    const city = place.city ?? place.subregion ?? undefined;
    const addressText = dedupeJoin([place.streetNumber, place.street ?? place.name, city, place.region]);
    return { addressText: addressText || undefined, city };
  } catch {
    return {};
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<{ addressText?: string; city?: string }> {
  const viaNominatim = await reverseGeocodeNominatim(latitude, longitude);
  if (viaNominatim) return viaNominatim;
  return reverseGeocodeOnDevice(latitude, longitude);
}