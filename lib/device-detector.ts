import { DeviceSpecs } from './types';

export function detectClientDevice(): DeviceSpecs {
  if (typeof window === 'undefined') {
    return {
      arch: 'arm64-v8a',
      androidVersion: 'Android 14 (API 34)',
      apiLevel: 34,
      dpi: '480',
      detectedModel: 'Default Android Device',
      isAutoDetected: false,
    };
  }

  const ua = window.navigator.userAgent;
  let detectedArch: DeviceSpecs['arch'] = 'arm64-v8a';
  let androidVersion = 'Android 14 (API 34)';
  let apiLevel = 34;
  let detectedModel = 'Android Device';

  // 1. Detect Android Version & Model
  const androidMatch = ua.match(/Android\s+([0-9.]+)/i);
  if (androidMatch && androidMatch[1]) {
    const rawVersion = parseFloat(androidMatch[1]);
    const major = Math.floor(rawVersion);
    switch (major) {
      case 15:
        androidVersion = 'Android 15 (API 35)';
        apiLevel = 35;
        break;
      case 14:
        androidVersion = 'Android 14 (API 34)';
        apiLevel = 34;
        break;
      case 13:
        androidVersion = 'Android 13 (API 33)';
        apiLevel = 33;
        break;
      case 12:
        androidVersion = 'Android 12 (API 31/32)';
        apiLevel = 31;
        break;
      case 11:
        androidVersion = 'Android 11 (API 30)';
        apiLevel = 30;
        break;
      case 10:
        androidVersion = 'Android 10 (API 29)';
        apiLevel = 29;
        break;
      case 9:
        androidVersion = 'Android 9.0 (API 28)';
        apiLevel = 28;
        break;
      case 8:
        androidVersion = 'Android 8.1 (API 27)';
        apiLevel = 27;
        break;
      case 7:
        androidVersion = 'Android 7.0 (API 24)';
        apiLevel = 24;
        break;
      default:
        if (major > 14) {
          androidVersion = `Android ${major} (API 34+)`;
          apiLevel = 34;
        } else {
          androidVersion = `Android ${major} (API 23)`;
          apiLevel = 23;
        }
    }
  }

  // Model extraction
  const modelMatch = ua.match(/;\s*([^;]+?)\s*Build\//i);
  if (modelMatch && modelMatch[1]) {
    detectedModel = modelMatch[1].trim();
  } else if (/iPhone|iPad/i.test(ua)) {
    detectedModel = 'iOS Device (Simulated Android Target)';
  } else if (/Windows/i.test(ua)) {
    detectedModel = 'Windows Desktop / Emulator Target';
  } else if (/Macintosh/i.test(ua)) {
    detectedModel = 'macOS Desktop Target';
  } else if (/Linux/i.test(ua)) {
    detectedModel = 'Linux System Target';
  }

  // 2. Detect CPU Architecture
  if (/x86_64|amd64|win64|wow64/i.test(ua)) {
    // If not mobile device, standard emulator / desktop is x86_64
    if (!/Android/i.test(ua)) {
      detectedArch = 'arm64-v8a'; // default mobile target
    } else {
      detectedArch = 'x86_64';
    }
  } else if (/arm64|aarch64/i.test(ua)) {
    detectedArch = 'arm64-v8a';
  } else if (/armv7|armeabi/i.test(ua)) {
    detectedArch = 'armeabi-v7a';
  } else {
    // Check WebGL GPU renderer as clue
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl && 'getExtension' in gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          if (/Adreno|Mali|PowerVR/i.test(renderer)) {
            detectedArch = 'arm64-v8a';
          } else if (/Intel|NVIDIA|AMD|Radeon|GeForce/i.test(renderer)) {
            detectedArch = 'arm64-v8a'; // modern targets prefer ARM64-v8a
          }
        }
      }
    } catch {
      detectedArch = 'arm64-v8a';
    }
  }

  // 3. Detect Screen DPI based on window.devicePixelRatio
  let dpi: DeviceSpecs['dpi'] = '480';
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1.0) dpi = '160';
  else if (dpr <= 1.5) dpi = '240';
  else if (dpr <= 2.2) dpi = '320';
  else if (dpr <= 3.2) dpi = '480';
  else dpi = '640';

  return {
    arch: detectedArch,
    androidVersion,
    apiLevel,
    dpi,
    detectedModel,
    isAutoDetected: true,
  };
}
