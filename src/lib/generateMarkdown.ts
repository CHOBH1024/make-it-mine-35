import type { Archetype, Inputs } from '@/lib/types';
import { detailData } from '@/lib/data';

export function generateMarkdown(result: Archetype, results: Archetype[], inputs: Inputs): string {
    const top3 = results.slice(0, 3);
    const userAnchorLabel = detailData.anchor[inputs.anchor]?.label || inputs.anchor || '미선택';
    const date = new Date().toLocaleDateString('ko-KR');

    const eqLabels: Record<string, string> = {
        awareness: '자기인식', regulation: '감정조절', motivation: '동기부여',
        empathy: '공감능력', social: '사회적기술',
    };
    const big5Labels: Record<string, string> = {
        openness: '개방성', conscientiousness: '성실성', extraversion: '외향성',
        agreeableness: '친화성', neuroticism: '신경성',
    };

    const growthKeys = ['discipline', 'skill', 'leadership', 'relationship'] as const;

    return `# ${result.title} — 목회공직자 유형진단 보고서

> ${result.verse}

**유형:** ${result.title} (${result.engTitle})
**부제:** ${result.subtitle}
**생성일:** ${date}
**진단 도구:** Cheon Il Guk Pastoral Archetype v5

---

## 진단 입력 요약

| 항목 | 입력값 |
|------|--------|
| 에니어그램 | ${inputs.enneagram ? inputs.enneagram + '유형' : '미선택'} |
${Object.entries(inputs.big5).map(([k, v]) => `| Big 5 — ${big5Labels[k] || k} | ${v || '미선택'} |`).join('\n')}
| 커리어 앵커 | ${userAnchorLabel} |
| VIA 강점 | ${inputs.via.join(', ') || '미선택'} |
${Object.entries(inputs.eq).map(([k, v]) => `| EQ — ${eqLabels[k] || k} | ${v || '미선택'} |`).join('\n')}

---

## 진단 결과 TOP 3

${top3.map((r, i) => `${i + 1}. **${r.title}** (${r.engTitle}) — ${(r.score || 0).toFixed(1)}점\n   ${r.subtitle}`).join('\n\n')}

---

## 1위 유형: ${result.title}

### 정체성 요약

${result.summary}

### 공직 가이드

${result.details.guide}

---

## 섭리적 DNA

| HOW (행동) | WHAT (역할) | WHY (소명) |
|------------|-------------|------------|
| ${result.dna.how} | ${result.dna.what} | ${result.dna.why} |

---

## 파트너십

${result.synergyDesc}

- **최적 파트너:** ${result.partners.best.role} — ${result.partners.best.reason}
- **주의 파트너:** ${result.partners.caution.role} — ${result.partners.caution.reason}

---

## 성장 로드맵

${growthKeys.map(k => {
    const g = result.growthGuide[k];
    return `### ${g.title}\n\n${g.description}\n\n${g.actionItems.map(i => `- ${i}`).join('\n')}`;
}).join('\n\n')}

---

## 추천 보직

**본부 보직:** ${result.recommendations.hq.join(', ')}
**현장 보직:** ${result.recommendations.field.join(', ')}

---

## 기도 가이드

- **새벽기도:** ${result.prayerGuide.morningPrayer}
- **낮기도:** ${result.prayerGuide.noonPrayer}
- **저녁묵상:** ${result.prayerGuide.eveningReflection}
- **특별기도:** ${result.prayerGuide.specialPrayer}
- **주간 집중:** ${result.prayerGuide.weeklyFocus.join(', ')}

---

## 롤 모델

**${result.roleModel.name}** (${result.roleModel.epithet})

${result.roleModel.description}

> ${result.roleModel.bibleVerse}

${result.roleModel.lesson}

---

*Cheon Il Guk Public Official Assessment Tool © ${new Date().getFullYear()}*
`;
}

export function downloadMarkdown(result: Archetype, results: Archetype[], inputs: Inputs) {
    const content = generateMarkdown(result, results, inputs);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `목회공직자_유형진단_${result.title}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
