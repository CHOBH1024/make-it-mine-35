import React, { useState } from 'react';
import { big5Data } from '@/lib/validity/big5';
import { enneagramData } from '@/lib/validity/enneagram';
import { anchorData } from '@/lib/validity/anchor';
import { viaData, eqData } from '@/lib/validity/via-eq';
import { integrationData } from '@/lib/validity/integration';

type ToolData = typeof big5Data | typeof enneagramData | typeof anchorData | typeof viaData | typeof eqData;

const tools: ToolData[] = [big5Data, enneagramData, anchorData, viaData, eqData];

const levelColors: Record<string, string> = {
  "치명적 한계": "bg-red-50 border-red-300 text-red-800",
  "주의": "bg-yellow-50 border-yellow-300 text-yellow-800",
  "참고": "bg-blue-50 border-blue-300 text-blue-800",
};

const levelIcons: Record<string, string> = {
  "치명적 한계": "✗",
  "주의": "⚠",
  "참고": "ℹ",
};

function ReliabilityStars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-lg ${i <= score ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-500 ml-1 self-center">({score}/5)</span>
    </div>
  );
}

function ToolSection({ tool, isOpen, onToggle }: { tool: ToolData; isOpen: boolean; onToggle: () => void }) {
  const [activeTab, setActiveTab] = useState<'evidence' | 'limits'>('evidence');
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow"
            style={{ backgroundColor: tool.color }}
          >
            {tool.title[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-lg font-bold text-gray-900">{tool.title}</h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: tool.badgeColor }}
              >
                {tool.badge}
              </span>
            </div>
            <p className="text-sm text-gray-500">{tool.subtitle}</p>
            <ReliabilityStars score={tool.reliabilityScore} />
          </div>
        </div>
        <span className={`text-2xl text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ↓
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-6">
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {tool.overview}
          </div>

          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'evidence'
                  ? 'text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeTab === 'evidence' ? { backgroundColor: tool.color } : {}}
            >
              학술 근거
            </button>
            <button
              onClick={() => setActiveTab('limits')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === 'limits'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              한계점 & 주의사항
            </button>
          </div>

          {activeTab === 'evidence' && (
            <div className="space-y-5">
              {tool.academicEvidence.map((ev, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                  <div
                    className="px-5 py-3 font-bold text-sm text-white"
                    style={{ backgroundColor: tool.color }}
                  >
                    {ev.title}
                  </div>
                  <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed">
                    {ev.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'limits' && (
            <div className="space-y-4">
              {tool.limitations.map((lim, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${levelColors[lim.level] || 'bg-gray-50 border-gray-200'}`}
                >
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

function IntegrationSection() {
  const [showCases, setShowCases] = useState(false);
  const [showRefs, setShowRefs] = useState(false);
  return (
    <div className="mt-10 space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">5개 도구 통합 모델의 타당성</h2>
        <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-line">
          {integrationData.rationale.content}
        </p>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowCases(!showCases)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 text-left"
        >
          <h2 className="text-lg font-bold text-gray-900">기업 활용 사례 (6개사)</h2>
          <span className="text-gray-400 text-xl">{showCases ? '↑' : '↓'}</span>
        </button>
        {showCases && (
          <div className="border-t border-gray-100 px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationData.corporateCases.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-base text-gray-900">{c.company}</span>
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

      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowRefs(!showRefs)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 text-left"
        >
          <h2 className="text-lg font-bold text-gray-900">참고문헌 ({integrationData.references.length}편)</h2>
          <span className="text-gray-400 text-xl">{showRefs ? '↑' : '↓'}</span>
        </button>
        {showRefs && (
          <div className="border-t border-gray-100 px-6 py-5">
            <ol className="space-y-2">
              {integrationData.references.map((ref, i) => (
                <li key={i} className="text-xs text-gray-600 leading-relaxed flex gap-2">
                  <span className="text-gray-400 font-mono shrink-0">[{i + 1}]</span>
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

export function ValidityView() {
  const [openTool, setOpenTool] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10 text-center">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-3">
          Academic Validity Report
        </div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif mb-3">학술 타당성 보고서</h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          이 진단 시스템에서 사용하는 5개 도구(Big Five·에니어그램·커리어 앵커·VIA·EQ)의 학술적 근거,
          신뢰도·타당도 데이터, 기업 활용 현황, 한계점을 APA 인용 기준으로 종합 검토한 보고서입니다.
        </p>
        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-400">
          <span>참고문헌 {integrationData.references.length}편</span>
          <span>·</span>
          <span>6개국 기업 사례</span>
          <span>·</span>
          <span>최종 업데이트 2026</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="font-bold text-green-700 text-base mb-0.5">검증됨</div>
          <div className="text-green-600">α≥0.70, 다중 메타분석</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="font-bold text-yellow-700 text-base mb-0.5">논란있음</div>
          <div className="text-yellow-600">일부 신뢰도 미달, 도구 비표준화</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <div className="font-bold text-red-700 text-base mb-0.5">제한적</div>
          <div className="text-red-600">학술 검증 부족 (해당 도구 없음)</div>
        </div>
      </div>

      <div>
        {tools.map((tool) => (
          <ToolSection
            key={tool.id}
            tool={tool}
            isOpen={openTool === tool.id}
            onToggle={() => setOpenTool(openTool === tool.id ? null : tool.id)}
          />
        ))}
      </div>

      <IntegrationSection />
    </div>
  );
}
