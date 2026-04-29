import type { Archetype, Inputs } from '@/lib/types';
import { detailData } from '@/lib/data';

export async function generateAnalysisPdf(result: Archetype, results: Archetype[], inputs: Inputs) {
    const userAnchorLabel = detailData.anchor[inputs.anchor]?.label || inputs.anchor || '-';
    const top3 = results.slice(0, 3);
    const date = new Date().toLocaleDateString('ko-KR');
    const growthKeys = ['discipline', 'skill', 'leadership', 'relationship'] as const;

    const eqLabels: Record<string, string> = {
        awareness: '자기인식', regulation: '감정조절', motivation: '동기부여',
        empathy: '공감능력', social: '사회적기술',
    };

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${result.title} — 목회공직자 유형진단 보고서</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    color: #1e293b;
    background: #fff;
    font-size: 11pt;
    line-height: 1.7;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }
  h1, h2, h3 { font-family: 'Noto Serif KR', Georgia, serif; }
  .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 3px solid #1e3a8a; }
  .report-tag { font-size: 9pt; color: #92400e; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; }
  .title { font-size: 28pt; font-weight: 900; color: #1e3a8a; margin-bottom: 6px; }
  .eng-title { font-size: 13pt; color: #64748b; font-style: italic; margin-bottom: 14px; }
  .verse { font-size: 10.5pt; color: #78716c; border-left: 3px solid #d97706; padding: 8px 14px; text-align: left; max-width: 560px; margin: 0 auto; line-height: 1.8; background: #fffbeb; border-radius: 0 6px 6px 0; }
  h2 { font-size: 14pt; color: #1e3a8a; font-weight: 700; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1.5px solid #e2e8f0; }
  h3 { font-size: 11.5pt; color: #1e293b; font-weight: 700; margin: 18px 0 8px; }
  p { margin-bottom: 10px; line-height: 1.8; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; }
  th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; line-height: 1.6; }
  th { background: #f8fafc; font-weight: 700; color: #334155; }
  .top1 { background: #eff6ff; border: 1px solid #bfdbfe; }
  .rank-row td:first-child { font-size: 18pt; font-weight: 900; color: #94a3b8; }
  .rank-row.first td:first-child { color: #1e3a8a; }
  .guide-box { background: #eff6ff; padding: 14px 16px; border-radius: 8px; border: 1px solid #bfdbfe; margin-bottom: 20px; }
  .guide-box p { margin: 0; color: #1e40af; }
  .partner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .partner-best { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 8px; }
  .partner-caution { background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 8px; }
  .growth-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
  .growth-item h3 { margin-top: 0; }
  ul { padding-left: 18px; margin-bottom: 8px; }
  li { margin-bottom: 3px; }
  .dna-table th { text-align: center; }
  .dna-table td { vertical-align: top; }
  .footer { text-align: center; font-size: 9pt; color: #a8a29e; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e7e5e4; }
  @media print {
    @page { margin: 18mm 15mm; size: A4; }
    body { font-size: 10pt; }
    .page { padding: 0; max-width: 100%; }
    h2 { page-break-after: avoid; }
    .growth-item, table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="report-tag">CHEON IL GUK PASTORAL ARCHETYPE REPORT</div>
    <h1 class="title">${result.title}</h1>
    <div class="eng-title">${result.engTitle}</div>
    <div class="verse">"${result.verse}"</div>
  </div>

  <h2>입력 요약</h2>
  <table>
    <tr><th>에니어그램</th><td>${inputs.enneagram ? inputs.enneagram + '유형' : '-'}</td>
        <th>커리어 앵커</th><td>${userAnchorLabel}</td></tr>
    <tr><th>Big 5</th><td colspan="3">개방성: ${inputs.big5.openness || '-'} | 성실성: ${inputs.big5.conscientiousness || '-'} | 외향성: ${inputs.big5.extraversion || '-'} | 친화성: ${inputs.big5.agreeableness || '-'} | 신경성: ${inputs.big5.neuroticism || '-'}</td></tr>
    <tr><th>VIA 강점</th><td colspan="3">${inputs.via.join(', ') || '-'}</td></tr>
    <tr><th>EQ</th><td colspan="3">${Object.entries(inputs.eq).map(([k, v]) => `${eqLabels[k] || k}: ${v || '-'}`).join(' | ')}</td></tr>
  </table>

  <h2>진단 결과 TOP 3</h2>
  <table>
    ${top3.map((r, i) => `
    <tr class="rank-row ${i === 0 ? 'first' : ''}">
      <td style="width:40px; text-align:center;">${i + 1}</td>
      <td class="${i === 0 ? 'top1' : ''}">
        <strong>${r.title}</strong> <span style="color:#94a3b8; font-size:9pt;">${r.engTitle}</span><br>
        <span style="font-size:9pt; color:#64748b;">${r.subtitle}</span>
      </td>
      <td style="width:60px; text-align:right; font-weight:700; color:${i === 0 ? '#1e3a8a' : '#64748b'};">${(r.score || 0).toFixed(1)}점</td>
    </tr>`).join('')}
  </table>

  <h2>정체성 및 섭리적 맥락</h2>
  <p>${result.summary}</p>
  <div class="guide-box"><p>${result.details.guide}</p></div>

  <h2>섭리적 DNA</h2>
  <table class="dna-table">
    <tr><th>HOW (행동)</th><th>WHAT (역할)</th><th>WHY (소명)</th></tr>
    <tr><td>${result.dna.how}</td><td>${result.dna.what}</td><td>${result.dna.why}</td></tr>
  </table>

  <h2>시너지 & 파트너십</h2>
  <p>${result.synergyDesc}</p>
  <div class="partner-grid">
    <div class="partner-best">
      <strong style="color:#166534;">최적 파트너: ${result.partners.best.role}</strong>
      <p style="color:#15803d; margin-top:6px;">${result.partners.best.reason}</p>
    </div>
    <div class="partner-caution">
      <strong style="color:#991b1b;">주의 파트너: ${result.partners.caution.role}</strong>
      <p style="color:#b91c1c; margin-top:6px;">${result.partners.caution.reason}</p>
    </div>
  </div>

  <h2>성장 로드맵</h2>
  ${growthKeys.map(k => {
      const g = result.growthGuide[k];
      return `<div class="growth-item">
        <h3>${g.title}</h3>
        <p>${g.description}</p>
        <ul>${g.actionItems.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>`;
  }).join('')}

  <h2>추천 보직</h2>
  <table>
    <tr><th>본부 보직</th><th>현장 보직</th></tr>
    <tr><td>${result.recommendations.hq.join(', ')}</td><td>${result.recommendations.field.join(', ')}</td></tr>
  </table>

  <h2>기도 가이드</h2>
  <table>
    <tr><th>새벽기도</th><td>${result.prayerGuide.morningPrayer}</td></tr>
    <tr><th>낮기도</th><td>${result.prayerGuide.noonPrayer}</td></tr>
    <tr><th>저녁묵상</th><td>${result.prayerGuide.eveningReflection}</td></tr>
    <tr><th>특별기도</th><td>${result.prayerGuide.specialPrayer}</td></tr>
  </table>

  <div class="footer">
    Cheon Il Guk Public Official Assessment Tool &copy; ${new Date().getFullYear()} | 생성일: ${date}
  </div>
</div>
<script>
  window.onload = function() {
    window.print();
  };
</script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
        alert('팝업이 차단되었습니다. 팝업을 허용한 후 다시 시도하세요.');
        return;
    }
    printWin.document.write(html);
    printWin.document.close();
}
