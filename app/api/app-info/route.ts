import { NextRequest, NextResponse } from 'next/server';
import { extractPackageId, fetchGooglePlayDetails } from '@/lib/gplay-engine';
import { scrapeGooglePlay, matchDeviceVariants } from '@/lib/play-scraper';
import { DeviceSpecs } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, deviceSpecs, source = 'gplay' } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'يرجى إدخال رابط صالح لتطبيق أو لعبة Google Play أو اسم الحزمة (Package ID).' },
        { status: 400 }
      );
    }

    const packageId = extractPackageId(url);
    if (!packageId) {
      return NextResponse.json(
        {
          error:
            'صيغة الرابط غير صحيحة. يرجى إدخال رابط Google Play (مثل: https://play.google.com/store/apps/details?id=com.HorrorGamer.Overnight2Mobile) أو اسم الحزمة مباشرة.',
        },
        { status: 400 }
      );
    }

    let appDetails;

    // Use Google Play Direct Engine as primary source
    try {
      appDetails = await fetchGooglePlayDetails(packageId, deviceSpecs as DeviceSpecs);
    } catch (gplayErr: any) {
      console.warn('Google Play Direct engine fallback to scraper:', gplayErr.message);
      // Fallback to general scraper if direct fails
      appDetails = await scrapeGooglePlay(packageId, source);
    }

    // Annotate variants for user device compatibility
    if (deviceSpecs && typeof deviceSpecs === 'object' && appDetails.variants) {
      appDetails.variants = matchDeviceVariants(appDetails.variants, deviceSpecs as DeviceSpecs, source);
    }

    return NextResponse.json({ success: true, appDetails });
  } catch (error: any) {
    console.error('API /api/app-info error:', error);
    return NextResponse.json(
      {
        error:
          error.message ||
          'حدث خطأ أثناء جلب بيانات التطبيق من متجر Google Play. يرجى التحقق من صحة الرابط أو اسم الحزمة والمحاولة مجدداً.',
      },
      { status: 500 }
    );
  }
}
