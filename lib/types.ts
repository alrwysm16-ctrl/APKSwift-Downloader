export interface DeviceSpecs {
  arch: 'arm64-v8a' | 'armeabi-v7a' | 'x86_64' | 'x86' | 'universal';
  androidVersion: string;
  apiLevel: number;
  dpi: 'nodpi' | '160' | '240' | '320' | '480' | '640';
  detectedModel?: string;
  isAutoDetected?: boolean;
}

export interface ApkVariant {
  id: string;
  format: 'APK' | 'XAPK' | 'Split APKs' | 'Fused APK';
  version: string;
  versionCode: number;
  architecture: 'arm64-v8a' | 'armeabi-v7a' | 'x86_64' | 'x86' | 'universal';
  minAndroid: string;
  minApiLevel: number;
  targetAndroid: string;
  dpi: string;
  fileSize: string;
  fileSizeBytes: number;
  sha256: string;
  downloadUrl: string;
  isDirectDownload: boolean;
  source: string;
  isCompatible?: boolean;
  compatibilityReason?: string;
  splits?: string[];
}

export interface AppDetails {
  packageId: string;
  title: string;
  developer: string;
  icon: string;
  rating: number;
  ratingsCount: string;
  category: string;
  price: string;
  isPaid: boolean;
  version: string;
  lastUpdated: string;
  minAndroid: string;
  downloadsCount: string;
  contentRating: string;
  description: string;
  shortDescription?: string;
  screenshots: string[];
  googlePlayUrl: string;
  variants: ApkVariant[];
  sourceOrigin: 'live_google_play' | 'verified_catalog' | 'gplay_api';
}

export interface SearchHistoryItem {
  packageId: string;
  title: string;
  icon: string;
  version: string;
  timestamp: number;
}

export interface GPlayConfig {
  backendUrl: string;
  useCustomBackend: boolean;
  googleEmail?: string;
  aasToken?: string;
  tokenDispenserUrl?: string;
  deviceProfile: string;
}
