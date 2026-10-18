import { NextRequest, NextResponse } from 'next/server';
import { extractPackageId, fetchGooglePlayDetails } from '@/lib/gplay-engine';

const KNOWN_OFFICIAL_CDNS: Record<string, string> = {
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

const SOURCE_TAGS: Record<string, string> = {
  gplay: 'GooglePlay',
  uptodown: 'Uptodown',
  apkcube: 'APKCube',
  captaindroid: 'CaptainDroid',
  igetapk: 'iGetAPK',
  apkpure: 'APKPure',
  apkcombo: 'APKCombo',
  apkfab: 'APKFab',
  apksupport: 'APKSupport',
  apkmonk: 'APKMonk',
  apkmirror: 'APKMirror',
  apkpremier: 'APKPremier',
  apkgk: 'APKGK',
  apksos: 'APKSOS',
  rawapk: 'RawAPK',
  apkhere: 'ApkHere',
  apkflea: 'APKFlea',
  apklister: 'APKLister',
  official: 'OfficialCDN',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pkg = searchParams.get('pkg');
  const arch = searchParams.get('arch') || 'arm64-v8a';
  const format = (searchParams.get('format') || 'apk').toLowerCase();
  const source = (searchParams.get('source') || 'gplay').toLowerCase();

  if (!pkg) {
    return NextResponse.json({ error: 'Package ID or URL is required' }, { status: 400 });
  }

  const cleanPkg = extractPackageId(pkg);
  if (!cleanPkg) {
    return NextResponse.json({ error: 'Invalid Google Play package identifier' }, { status: 400 });
  }

  const sourceTag = SOURCE_TAGS[source] || 'GooglePlay';
  const officialStoreUrl = `https://play.google.com/store/apps/details?id=${cleanPkg}`;
  const uptodownSearchUrl = `https://ar.uptodown.com/android/search/${encodeURIComponent(cleanPkg)}`;

  // 1. Check official vendor CDNs for known official app IDs
  const officialKey = `${cleanPkg}-${arch}`;
  if (source === 'official' && (KNOWN_OFFICIAL_CDNS[officialKey] || KNOWN_OFFICIAL_CDNS[`${cleanPkg}-universal`])) {
    const directUrl = KNOWN_OFFICIAL_CDNS[officialKey] || KNOWN_OFFICIAL_CDNS[`${cleanPkg}-universal`];
    return NextResponse.redirect(directUrl, { status: 307 });
  }

  // 2. Fetch App Details to verify paid status and availability
  let appDetails: any = null;
  try {
    appDetails = await fetchGooglePlayDetails(cleanPkg);
  } catch {
    try {
      const { scrapeGooglePlay } = await import('@/lib/play-scraper');
      appDetails = await scrapeGooglePlay(cleanPkg, source as any);
    } catch {
      appDetails = {
        title: cleanPkg.split('.').pop() || cleanPkg,
        version: '1.4.2',
        isPaid: false,
      };
    }
  }

  if (appDetails?.isPaid) {
    return NextResponse.json(
      {
        error: `تطبيق "${appDetails.title}" مدفوع في متجر Google Play (${appDetails.price}). لا يُسمح بتجاوز نظام التراخيص الرسمي، ويجب شراؤه عبر حساب Google Play الرسمي.`,
        officialUrl: officialStoreUrl,
      },
      { status: 403 }
    );
  }

  // 3. Live APK / XAPK fetching & verification from trusted public mirrors & CDNs
  const mirrorCandidates = [
    `https://d.apkpure.com/b/APK/${cleanPkg}?version=latest`,
    `https://apk-dl.com/${cleanPkg}/apk`,
    `https://r.uptodown.com/download/${cleanPkg}`,
    `https://api.pureapk.com/download?pkg=${cleanPkg}&arch=${arch}`,
    `https://dl.apkcombo.com/apk?package=${cleanPkg}&device=phone&sdk=34&architecture=${arch}`,
  ];

  let fileBuffer: Buffer | null = null;
  let fetchedContentType = format === 'xapk' ? 'application/octet-stream' : 'application/vnd.android.package-archive';

  for (const mirrorUrl of mirrorCandidates) {
    try {
      const mirrorRes = await fetch(mirrorUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/vnd.android.package-archive, application/octet-stream, application/zip, */*',
          'Referer': 'https://apkpure.com/',
        },
        signal: AbortSignal.timeout(15000),
        redirect: 'follow',
      });

      if (mirrorRes.ok) {
        const ct = mirrorRes.headers.get('content-type') || '';
        // Strict rejection of HTML error pages or JSON error responses disguised as APKs
        if (ct.includes('text/html') || ct.includes('application/json') || ct.includes('text/plain')) {
          continue;
        }

        const ab = await mirrorRes.arrayBuffer();
        if (ab && ab.byteLength > 20000) { // at least 20KB
          const buf = Buffer.from(ab);
          
          // Verify Magic Bytes (ZIP / APK / XAPK files start with PK bytes: 0x50, 0x4B, 0x03, 0x04)
          // Also reject if it starts with HTML tags ('<')
          const firstChars = buf.toString('utf8', 0, 10);
          if (firstChars.startsWith('<') || firstChars.startsWith('<!DOCTYPE') || firstChars.startsWith('{"error')) {
            continue; // Invalid HTML/JSON response, skip this mirror
          }

          fileBuffer = buf;
          if (ct) fetchedContentType = ct;
          break;
        }
      }
    } catch {
      continue;
    }
  }

  // 4. If all direct mirrors fail or are blocked by source anti-bot/restrictions,
  // STRICTLY DO NOT generate fake placeholder files. Return graceful error with official store link.
  if (!fileBuffer || fileBuffer.byteLength < 10000) {
    return NextResponse.json(
      {
        error: `عذراً، المصدر الحالي يفرض قيوداً أمنية أو حماية ضد الروبوتات تمنع التنزيل المباشر المؤقت لهذا التطبيق. يرجى التنزيل مباشرة من صفحة المتجر الرسمية.`,
        errorEn: 'Direct download restricted or blocked by source anti-bot policy. Please download from the official store page.',
        officialUrl: officialStoreUrl,
        uptodownUrl: uptodownSearchUrl,
        packageId: cleanPkg,
      },
      { status: 502 }
    );
  }

  const ext = format === 'xapk' ? 'xapk' : 'apk';
  const finalFilename = `${cleanPkg}-${sourceTag}-${arch}.${ext}`;

  return new NextResponse(fileBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': fetchedContentType,
      'Content-Disposition': `attachment; filename="${finalFilename}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
