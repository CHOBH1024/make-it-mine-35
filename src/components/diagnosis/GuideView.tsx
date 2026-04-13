import React from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { SectionTitle } from '@/components/diagnosis/SectionTitle';
import { externalTests, recommendedTests } from '@/lib/data';

export const GuideView: React.FC = () => (
    <div className="max-w-6xl mx-auto px-6 py-20 fade-in">
        <SectionTitle title="진단 지표 가이드" subtitle="내면의 거울을 통해 소명을 비추어 봅니다." />
        <div className="space-y-16">
            {externalTests.map((t, idx) => (
                <div key={t.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200 flex flex-col">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-slate-50 to-white p-8 md:p-12 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center border border-stone-100 ${t.color}`}>
                                <Icon name={t.icon} size={40}/>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Diagnostic Tool 0{idx + 1}</div>
                                <h3 className="text-3xl font-bold text-slate-900 font-serif mb-2">{t.name}</h3>
                                <p className="text-stone-600 font-medium text-lg">{t.desc}</p>
                            </div>
                        </div>
                        <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-900 text-white font-bold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/30 gap-2 shrink-0"
                        >
                            <Icon name="ExternalLink" size={18}/> 무료 진단하기
                        </a>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 space-y-12">
                        {/* 1. Measurement */}
                        <div>
                            <h4 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4 font-serif">
                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm shadow-md">1</span>
                                측정 원리 (What is measured)
                            </h4>
                            <div className="text-slate-700 leading-loose text-justify bg-stone-50 p-8 rounded-2xl border border-stone-100 text-lg whitespace-pre-line">
                                {t.measurement}
                            </div>
                        </div>

                        {/* 2. Understanding */}
                        <div>
                            <h4 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4 font-serif">
                                <span className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center text-sm shadow-md">2</span>
                                섭리적 해석 (Theological Insight)
                            </h4>
                            <div className="text-slate-700 leading-loose text-justify bg-purple-50 p-8 rounded-2xl border border-purple-100 text-lg whitespace-pre-line">
                                {t.understanding}
                            </div>
                        </div>

                        {/* 3. Utilization */}
                        <div>
                            <h4 className="flex items-center gap-3 text-xl font-bold text-slate-900 mb-4 font-serif">
                                <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm shadow-md">3</span>
                                목회 현장 활용 (Pastoral Application)
                            </h4>
                            <div className="text-slate-700 leading-loose text-justify bg-amber-50 p-8 rounded-2xl border border-amber-100 text-lg whitespace-pre-line">
                                {t.utilization}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* 추가 추천 진단 섹션 */}
        <div className="mt-24">
            <div className="text-center mb-12">
                <div className="inline-block bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                    Additional Resources
                </div>
                <h2 className="text-3xl font-bold text-slate-900 font-serif mb-3">이런 진단도 있어요</h2>
                <p className="text-stone-500 text-lg">공식 5대 진단 외에도, 자신의 소명과 역량을 더 깊이 탐구할 수 있는 참고 도구들입니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedTests.map((t) => (
                    <a
                        key={t.id}
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col gap-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100 ${t.color} group-hover:scale-105 transition-transform`}>
                                <Icon name={t.icon} size={24}/>
                            </div>
                            <div className="flex-1">
                                <span className="inline-block text-xs font-bold bg-stone-100 text-stone-500 rounded-full px-2.5 py-0.5 mb-2">{t.tag}</span>
                                <h4 className="font-bold text-slate-900 text-base leading-snug">{t.name}</h4>
                            </div>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed">{t.desc}</p>
                        <div className="flex items-center gap-1.5 text-blue-700 text-sm font-semibold mt-auto group-hover:gap-2.5 transition-all">
                            <Icon name="ExternalLink" size={14}/> 바로 가기
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </div>
);
