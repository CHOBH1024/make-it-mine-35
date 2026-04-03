import { jsPDF } from 'jspdf';
import type { Archetype, Inputs } from '@/lib/types';
import { detailData } from '@/lib/data';

// Korean text support: jsPDF doesn't have built-in Korean font support,
// so we render via HTML and use the browser's font rendering
export async function generateAnalysisPdf(result: Archetype, results: Archetype[], inputs: Inputs) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      addPage();
    }
  };

  // Create an HTML-based PDF for Korean support
  const container = document.createElement('div');
  container.style.width = '700px';
  container.style.fontFamily = "'Noto Sans KR', 'Malgun Gothic', sans-serif";
  container.style.color = '#1e293b';
  container.style.padding = '40px';
  container.style.background = '#fff';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';

  const userAnchorLabel = detailData.anchor[inputs.anchor]?.label || inputs.anchor;
  const top3 = results.slice(0, 3);

  container.innerHTML = `
    <div style="text-align:center; margin-bottom:30px;">
      <div style="font-size:11px; color:#92400e; letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; font-weight:bold;">
        CHEON IL GUK PASTORAL ARCHETYPE REPORT
      </div>
      <h1 style="font-size:32px; font-weight:800; color:#1e3a8a; margin:0 0 6px 0; font-family:serif;">
        ${result.title}
      </h1>
      <div style="font-size:16px; color:#64748b; font-style:italic; margin-bottom:12px;">
        ${result.engTitle}
      </div>
      <div style="font-size:13px; color:#78716c; border-left:3px solid #d97706; padding-left:12px; text-align:left; max-width:550px; margin:0 auto; line-height:1.7;">
        "${result.verse}"
      </div>
    </div>

    <hr style="border:none; border-top:2px solid #e7e5e4; margin:20px 0;">

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:12px;">📋 입력 요약</h2>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:13px;">
      <tr style="background:#f8fafc;">
        <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:bold; width:30%;">에니어그램</td>
        <td style="padding:8px 12px; border:1px solid #e2e8f0;">${inputs.enneagram || '-'} 유형</td>
      </tr>
      <tr>
        <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:bold;">Big 5 성격</td>
        <td style="padding:8px 12px; border:1px solid #e2e8f0;">
          개방성: ${inputs.big5.openness || '-'} | 성실성: ${inputs.big5.conscientiousness || '-'} | 외향성: ${inputs.big5.extraversion || '-'} | 친화성: ${inputs.big5.agreeableness || '-'} | 신경성: ${inputs.big5.neuroticism || '-'}
        </td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:bold;">커리어 앵커</td>
        <td style="padding:8px 12px; border:1px solid #e2e8f0;">${userAnchorLabel}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px; border:1px solid #e2e8f0; font-weight:bold;">VIA 강점</td>
        <td style="padding:8px 12px; border:1px solid #e2e8f0;">${inputs.via.join(', ') || '-'}</td>
      </tr>
    </table>

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:12px;">🏆 진단 결과 TOP 3</h2>
    ${top3.map((r, i) => `
      <div style="display:flex; align-items:center; gap:12px; padding:10px 14px; margin-bottom:6px; background:${i === 0 ? '#eff6ff' : '#fff'}; border:1px solid ${i === 0 ? '#bfdbfe' : '#e2e8f0'}; border-radius:8px;">
        <div style="font-size:20px; font-weight:800; color:${i === 0 ? '#1e3a8a' : '#94a3b8'}; min-width:30px;">${i + 1}</div>
        <div style="flex:1;">
          <div style="font-weight:700; color:#1e293b; font-size:14px;">${r.title} <span style="color:#94a3b8; font-weight:400; font-size:12px;">${r.engTitle}</span></div>
          <div style="font-size:12px; color:#64748b;">${r.subtitle}</div>
        </div>
        <div style="font-size:16px; font-weight:800; color:${i === 0 ? '#1e3a8a' : '#64748b'};">${(r.score || 0).toFixed(1)}점</div>
      </div>
    `).join('')}

    <hr style="border:none; border-top:2px solid #e7e5e4; margin:24px 0;">

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:8px;">📖 정체성 및 섭리적 맥락</h2>
    <p style="font-size:13px; line-height:1.8; color:#334155; margin-bottom:12px; text-align:justify;">${result.summary}</p>
    
    <div style="background:#eff6ff; padding:14px 16px; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:20px;">
      <div style="font-weight:700; font-size:13px; color:#1e3a8a; margin-bottom:4px;">💼 공직 가이드</div>
      <div style="font-size:12px; color:#1e40af; line-height:1.7;">${result.details.guide}</div>
    </div>

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:8px;">🧬 섭리적 DNA</h2>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px;">
      <tr style="background:#f8fafc;">
        <td style="padding:10px; border:1px solid #e2e8f0; font-weight:bold; width:33%; text-align:center;">HOW (행동)</td>
        <td style="padding:10px; border:1px solid #e2e8f0; font-weight:bold; width:33%; text-align:center;">WHAT (역할)</td>
        <td style="padding:10px; border:1px solid #e2e8f0; font-weight:bold; width:33%; text-align:center;">WHY (소명)</td>
      </tr>
      <tr>
        <td style="padding:10px; border:1px solid #e2e8f0; line-height:1.6;">${result.dna.how}</td>
        <td style="padding:10px; border:1px solid #e2e8f0; line-height:1.6;">${result.dna.what}</td>
        <td style="padding:10px; border:1px solid #e2e8f0; line-height:1.6;">${result.dna.why}</td>
      </tr>
    </table>

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:8px;">🤝 시너지 & 파트너</h2>
    <div style="font-size:12px; line-height:1.7; color:#334155; margin-bottom:10px;">${result.synergyDesc}</div>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px;">
      <tr>
        <td style="padding:10px; border:1px solid #e2e8f0; background:#f0fdf4; width:50%;">
          <div style="font-weight:700; color:#166534;">✅ 최적 파트너: ${result.partners.best.role}</div>
          <div style="color:#15803d; margin-top:4px;">${result.partners.best.reason}</div>
        </td>
        <td style="padding:10px; border:1px solid #e2e8f0; background:#fef2f2; width:50%;">
          <div style="font-weight:700; color:#991b1b;">⚠️ 주의 파트너: ${result.partners.caution.role}</div>
          <div style="color:#b91c1c; margin-top:4px;">${result.partners.caution.reason}</div>
        </td>
      </tr>
    </table>

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:8px;">🌱 성장 로드맵</h2>
    ${['discipline', 'skill', 'leadership', 'relationship'].map(key => {
      const g = result.growthGuide[key as keyof typeof result.growthGuide] as { title: string; description: string; actionItems: string[] };
      return `
        <div style="margin-bottom:14px; padding:12px 14px; border:1px solid #e2e8f0; border-radius:8px;">
          <div style="font-weight:700; font-size:13px; color:#1e293b; margin-bottom:4px;">${g.title}</div>
          <div style="font-size:12px; color:#475569; line-height:1.6; margin-bottom:6px;">${g.description}</div>
          <ul style="margin:0; padding-left:18px; font-size:11px; color:#64748b;">
            ${g.actionItems.map((item: string) => `<li style="margin-bottom:2px;">${item}</li>`).join('')}
          </ul>
        </div>
      `;
    }).join('')}

    <h2 style="font-size:18px; color:#1e3a8a; font-weight:700; margin-bottom:8px;">📌 추천 보직</h2>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px;">
      <tr style="background:#f8fafc;">
        <td style="padding:10px; border:1px solid #e2e8f0; font-weight:bold; width:50%;">본부 보직</td>
        <td style="padding:10px; border:1px solid #e2e8f0; font-weight:bold; width:50%;">현장 보직</td>
      </tr>
      <tr>
        <td style="padding:10px; border:1px solid #e2e8f0; line-height:1.7;">${result.recommendations.hq.join(', ')}</td>
        <td style="padding:10px; border:1px solid #e2e8f0; line-height:1.7;">${result.recommendations.field.join(', ')}</td>
      </tr>
    </table>

    <div style="text-align:center; font-size:10px; color:#a8a29e; margin-top:30px; padding-top:16px; border-top:1px solid #e7e5e4;">
      Cheon Il Guk Public Official Assessment Tool © ${new Date().getFullYear()} | 생성일: ${new Date().toLocaleDateString('ko-KR')}
    </div>
  `;

  document.body.appendChild(container);

  try {
    await doc.html(container, {
      callback: (doc) => {
        doc.save(`목회공직자_유형진단_${result.title}.pdf`);
      },
      x: 0,
      y: 0,
      width: 700,
      windowWidth: 700,
      autoPaging: 'text',
    });
  } finally {
    document.body.removeChild(container);
  }
}
