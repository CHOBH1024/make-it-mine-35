import type { Inputs } from '@/lib/types';

/** Encode inputs to a compact base64 URL parameter */
export function encodeInputs(inputs: Inputs): string {
  const compact = {
    e: inputs.enneagram,
    b: inputs.big5,
    a: inputs.anchor,
    v: inputs.via,
  };
  return btoa(encodeURIComponent(JSON.stringify(compact)));
}

/** Decode inputs from a base64 URL parameter */
export function decodeInputs(encoded: string): Inputs | null {
  try {
    const compact = JSON.parse(decodeURIComponent(atob(encoded)));
    return {
      enneagram: compact.e || '',
      big5: compact.b || { openness: '', conscientiousness: '', extraversion: '', agreeableness: '', neuroticism: '' },
      anchor: compact.a || '',
      via: compact.v || [],
    };
  } catch {
    return null;
  }
}

/** Build a shareable URL with encoded inputs */
export function buildShareUrl(inputs: Inputs): string {
  const encoded = encodeInputs(inputs);
  const url = new URL(window.location.origin);
  url.searchParams.set('d', encoded);
  return url.toString();
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
}

/** Share via KakaoTalk using Kakao Link (URL scheme fallback) */
export function shareToKakao(title: string, description: string, url: string) {
  // Try mobile KakaoTalk URL scheme
  const kakaoShareUrl = `https://story.kakao.com/s/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n${description}`)}`;
  
  // Use Web Share API if available (works on mobile, shows KakaoTalk option)
  if (navigator.share) {
    navigator.share({
      title,
      text: description,
      url,
    }).catch(() => {
      // If Web Share fails, open Kakao Story as fallback
      window.open(kakaoShareUrl, '_blank', 'noopener');
    });
  } else {
    // Desktop fallback: open Kakao Story share
    window.open(kakaoShareUrl, '_blank', 'noopener');
  }
}

/** Use Web Share API or fallback to copy */
export async function webShare(title: string, description: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text: description, url });
      return 'shared';
    } catch {
      return 'failed';
    }
  }
  const ok = await copyToClipboard(url);
  return ok ? 'copied' : 'failed';
}
