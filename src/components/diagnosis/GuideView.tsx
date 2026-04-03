import React from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { SectionTitle } from '@/components/diagnosis/SectionTitle';
import { externalTests } from '@/lib/data';

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
    </div>
);