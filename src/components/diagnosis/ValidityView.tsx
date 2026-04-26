import React, { useState } from 'react';

// Big Five
import { big5History } from '@/lib/validity/big5/history';
import { big5Psychometrics } from '@/lib/validity/big5/psychometrics';
import { big5Pastoral } from '@/lib/validity/big5/pastoral';
import { big5FiveFactors } from '@/lib/validity/big5/five-factors';
// Big Five summary card (구 파일)
import { big5Data } from '@/lib/validity/big5';

// Enneagram
import { enneagramHistory } from '@/lib/validity/enneagram/history';
import { enneagramEvidence } from '@/lib/validity/enneagram/evidence';
import { enneagramNineTypes } from '@/lib/validity/enneagram/nine-types';
import { enneagramSDT } from '@/lib/validity/enneagram/sdt-connection';
import { enneagramOrgResearch } from '@/lib/validity/enneagram/org-research';
import { enneagramData } from '@/lib/validity/enneagram';

// Anchor
import { anchorTheory } from '@/lib/validity/anchor/theory';
import { anchorEvidence } from '@/lib/validity/anchor/evidence';
import { anchorData } from '@/lib/validity/anchor';

// VIA
import { viaTheory } from '@/lib/validity/via/theory';
import { viaEvidence } from '@/lib/validity/via/evidence';
import { viaTwentyFourStrengths } from '@/lib/validity/via/twenty-four-strengths';
import { viaData } from '@/lib/validity/via';

// EQ
import { eqMSCEIT } from '@/lib/validity/eq/msceit-framework';
import { eqModels } from '@/lib/validity/eq/models';
import { eqResearch } from '@/lib/validity/eq/research';
import { eqFiveDimensions } from '@/lib/validity/eq/five-dimensions';
import { eqData } from '@/lib/validity/eq';

// Synthesis
import { synthIntegration } from '@/lib/validity/synthesis/integration';
import { pastoralApplication } from '@/lib/validity/synthesis/pastoral-application';
import { overallLimitations } from '@/lib/validity/synthesis/overall-limitations';
import { integrationData } from '@/lib/validity/integration';

// ─────────────────────────────────────────────
// 섹션 데이터 구조
// ─────────────────────────────────────────────

type SubSection = { title: string; content: string };

type ToolSection = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  badge: string;
  badgeColor: string;
  reliabilityScore: number;
  overview: string;
  subSections: SubSection[];
  limitations: { level: string; title: string; content: string }[];
};

const tools: ToolSection[] = [
  {
    ...big5Data,
    subSections: [
      big5History,
      big5FiveFactors,
      big5Psychometrics,
      big5Pastoral,
    ],
  },
  {
    ...enneagramData,
    subSections: [
      enneagramSDT,
      enneagramOrgResearch,
      enneagramHistory,
      enneagramNineTypes,
      enneagramEvidence,
    ],
  },
  {
    ...anchorData,
    subSections: [
      anchorTheory,
      anchorEvidence,
    ],
  },
  {
    ...viaData,
    subSections: [
      viaTheory,
      viaTwentyFourStrengths,
      viaEvidence,
    ],
  },
  {
    ...eqData,
    subSections: [
      eqMSCEIT,
      eqFiveDimensions,
      eqModels,
      eqResearch,
    ],
  },
];

const levelStyles: Record<string, string> = {
  "치명적 한계": "bg-red-50 border-red-300 text-red-800",
  "주의": "bg-yellow-50 border-yellow-300 text-yellow-800",
  "참고": "bg-blue-50 border-blue-300 text-blue-800",
};
const levelIcons: Record<string, string> = {
  "치명적 한계": "✗",
  "주의": "⚠",
  "참고": "ℹ",
};

// ─────────────────────────────────────────────
// 컴포넌트
// ─────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= n ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
      <span className="text-xs text-gray-400 ml-1 self-center">({n}/5)</span>
    </span>
  );
}

function ContentBlock({ text }: { text: string }) {
  return (
    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
      {text}
    </div>
  );
}

function SubSectionTabs({ subs }: { subs: SubSection[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-4">
        {subs.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              active === i
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <ContentBlock text={subs[active].content} />
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: ToolSection }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'detail' | 'limits'>('detail');

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-4">
      {/* 헤더 */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow"
            style={{ backgroundColor: tool.color }}
          >
            {tool.title[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{tool.title}</h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: tool.badgeColor }}
              >
                {tool.badge}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{tool.subtitle}</p>
            <Stars n={tool.reliabilityScore} />
          </div>
        </div>
        <span className={`text-xl text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>↓</span>
      </button>

      {/* 본문 */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-6 space-y-6">
          {/* 개요 */}
          <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            {tool.overview}
          </div>

          {/* 탭 전환 */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('detail')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === 'detail' ? 'text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={tab === 'detail' ? { backgroundColor: tool.color } : {}}
            >
              상세 학술 내용
            </button>
            <button
              onClick={() => setTab('limits')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                tab === 'limits' ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              한계 & 주의사항
            </button>
          </div>

          {tab === 'detail' && <SubSectionTabs subs={tool.subSections} />}

          {tab === 'limits' && (
            <div className="space-y-3">
              {tool.limitations.map((lim, i) => (
                <div key={i} className={`rounded-xl border p-4 ${levelStyles[lim.level] || 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                    <span>{levelIcons[lim.level] || '·'}</span>
                    <span>[{lim.level}]</span>
                    <span>{lim.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{lim.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SynthesisSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showCases, setShowCases] = useState(false);
  const [showRefs, setShowRefs] = useState(false);

  const synths = [
    synthIntegration,
    pastoralApplication,
    overallLimitations,
  ];

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-200 pb-3">
        통합 분석 & 목회 적용
      </h2>

      {synths.map((s, i) => (
        <div key={i} className="border border-indigo-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 bg-indigo-50 hover:bg-indigo-100 text-left transition-colors"
          >
            <span className="font-bold text-indigo-900">{s.title}</span>
            <span className="text-indigo-400 text-xl">{openIdx === i ? '↑' : '↓'}</span>
          </button>
          {openIdx === i && (
            <div className="px-6 py-5 bg-white">
              <ContentBlock text={s.content} />
            </div>
          )}
        </div>
      ))}

      {/* 기업 사례 */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowCases(c => !c)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 text-left"
        >
          <span className="font-bold text-gray-900">기업 활용 사례 (6개사 상세)</span>
          <span className="text-gray-400 text-xl">{showCases ? '↑' : '↓'}</span>
        </button>
        {showCases && (
          <div className="border-t border-gray-100 px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationData.corporateCases.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-gray-900">{c.company}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{c.tool}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{c.detail}</p>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 font-medium">
                  결과: {c.outcome}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 참고문헌 */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowRefs(r => !r)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 text-left"
        >
          <span className="font-bold text-gray-900">참고문헌 ({integrationData.references.length}편 APA)</span>
          <span className="text-gray-400 text-xl">{showRefs ? '↑' : '↓'}</span>
        </button>
        {showRefs && (
          <div className="border-t border-gray-100 px-6 py-5">
            <ol className="space-y-2">
              {integrationData.references.map((ref, i) => (
                <li key={i} className="text-xs text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-gray-400 font-mono shrink-0">[{i+1}]</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────

export function ValidityView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* 헤더 */}
      <div className="mb-10 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Academic Validity Report
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-3">학술 타당성 보고서</h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
          이 진단 시스템에서 사용하는 5개 도구의 학술적 근거, 신뢰도·타당도 데이터, 기업 활용 현황,
          한계점을 APA 인용 기준으로 종합 검토한 보고서입니다.
          각 도구의 제목을 클릭하면 세부 내용을 확인할 수 있습니다.
        </p>
        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-400">
          <span>참고문헌 {integrationData.references.length}편</span>
          <span>·</span>
          <span>6개국 기업 사례</span>
          <span>·</span>
          <span>순수 학술 텍스트 12만자+</span>
          <span>·</span>
          <span>최종 업데이트 2026</span>
        </div>
      </div>

      {/* 신뢰도 범례 */}
      <div className="mb-6 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="font-bold text-green-700 text-sm mb-0.5">검증됨 ★★★★+</div>
          <div className="text-green-600">α≥0.70, 다중 독립 메타분석</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="font-bold text-yellow-700 text-sm mb-0.5">논란있음 ★★★</div>
          <div className="text-yellow-600">일부 신뢰도 미달, 도구 비표준화</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="font-bold text-red-700 text-sm mb-0.5">제한적 ★★ 이하</div>
          <div className="text-red-600">학술 검증 불충분 (해당 없음)</div>
        </div>
      </div>

      {/* 도구별 카드 */}
      <div>
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* 통합 섹션 */}
      <SynthesisSection />
    </div>
  );
}
