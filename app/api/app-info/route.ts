import { NextRequest, NextResponse } from 'next/server';
import { extractPackageId, scrapeGooglePlay, matchDeviceVariants } from '@/lib/play-scraper';
import { DeviceSpecs } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, deviceSpecs } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'يرجى إدخال رابط صالح لتطبيق Google Play أو اسم الحزمة (Package ID).' },
        { status: 400 }
      );
    }

    const packageId = extractPackageId(url);
    if (!packageId) {
      return NextResponse.json(
        {
          error:
            'صيغة الرابط غير صحيحة. يرجى إدخال رابط Google Play (مثل: https://play.google.com/store/apps/details?id=com.whatsapp) أو اسم الحزمة مباشرة (مثل com.whatsapp).',
        },
        { status: 400 }
      );
    }

    // Fetch live metadata
    const appDetails = await scrapeGooglePlay(packageId);

    // If user provided device specifications, annotate compatibility
    if (deviceSpecs && typeof deviceSpecs === 'object') {
      appDetails.variants = matchDeviceVariants(appDetails.variants, deviceSpecs as DeviceSpecs);
    }

    return NextResponse.json({ success: true, appDetails });
  } catch (error: any) {
    console.error('API /api/app-info error:', error);
    return NextResponse.json(
      {
        error:
          error.message ||
          'حدث خطأ أثناء جلب بيانات التطبيق من متجر Google Play. يرجى التحقق من الاتصال والمحاولة مجدداً.',
      },
      { status: 500 }
    );
  }
}
