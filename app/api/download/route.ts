import { NextRequest, NextResponse } from 'next/server';
import { extractPackageId } from '@/lib/play-scraper';

const KNOWN_DIRECT_DOWNLOADS: Record<string, string> = {
  'org.videolan.vlc-arm64-v8a': 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-arm64-v8a.apk',
  'org.videolan.vlc-armeabi-v7a': 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-armeabi-v7a.apk',
  'org.videolan.vlc-x86_64': 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-x86_64.apk',
  'org.videolan.vlc-universal': 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-all.apk',
  'org.telegram.messenger-arm64-v8a': 'https://telegram.org/dl/android/apk',
  'org.telegram.messenger-universal': 'https://telegram.org/dl/android/apk',
  'com.whatsapp-arm64-v8a': 'https://www.whatsapp.com/android/current/WhatsApp.apk',
  'com.whatsapp-universal': 'https://www.whatsapp.com/android/current/WhatsApp.apk',
  'com.brave.browser-arm64-v8a': 'https://github.com/brave/brave-browser/releases/download/v1.70.126/Bravearm64.apk',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pkg = searchParams.get('pkg');
  const arch = searchParams.get('arch') || 'arm64-v8a';
  const format = (searchParams.get('format') || 'apk').toLowerCase();
  const source = (searchParams.get('source') || 'all').toLowerCase();

  if (!pkg) {
    return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
  }

  const cleanPkg = extractPackageId(pkg);
  if (!cleanPkg) {
    return NextResponse.json({ error: 'Invalid package identifier' }, { status: 400 });
  }

  // 1. Check known direct official CDN links first if source is official or default
  if (source === 'official' || source === 'all' || source === 'gplay') {
    const key = `${cleanPkg}-${arch}`;
    const directUrl = KNOWN_DIRECT_DOWNLOADS[key] || KNOWN_DIRECT_DOWNLOADS[`${cleanPkg}-universal`];
    if (directUrl) {
      return NextResponse.redirect(directUrl, { status: 307 });
    }
  }

  // 2. Source-specific routing
  switch (source) {
    case 'uptodown':
      return NextResponse.redirect(`https://services.uptodown.com/download/${cleanPkg}`, { status: 307 });

    case 'apkcombo':
      return NextResponse.redirect(`https://apkcombo.com/downloader/#package=${cleanPkg}`, { status: 307 });

    case 'apkfab':
      return NextResponse.redirect(`https://apkfab.com/search?q=${cleanPkg}`, { status: 307 });

    case 'apkmirror':
      return NextResponse.redirect(
        `https://www.apkmirror.com/?post_type=app_release&searchtype=apk&s=${encodeURIComponent(cleanPkg)}`,
        { status: 307 }
      );

    case 'apkpure':
    default:
      // Provide verified APKPure CDN mirror
      const mirrorUrl = `https://d.apkpure.com/b/APK/${cleanPkg}?version=latest`;
      return NextResponse.redirect(mirrorUrl, { status: 307 });
  }
}
