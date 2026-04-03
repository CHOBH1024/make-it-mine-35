
import React, { useState } from 'react';
import { SectionTitle } from '@/components/diagnosis/SectionTitle';
import { archetypes } from '@/lib/data';
import { Icon } from '@/components/diagnosis/Icon';
import { Archetype } from '@/lib/types';

export const LibraryView: React.FC = () => {
    const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 fade-in">
            <SectionTitle title="아키타입 도서관" subtitle="9가지 소명의 색깔들을 깊이 있게 탐구합니다." />
            
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                {archetypes.map(t => (
                    <div 
                        key={t.id} 
                        onClick={() => setSelectedArchetype(t)}
                        className="bg-white rounded-2xl paper-card overflow-hidden hover:shadow-2xl hover:border-blue-900/30 transition-all group flex flex-col h-full cursor-pointer transform hover:-translate-y-2"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 relative">
                            <div className="absolute top-6 right-6 text-6xl font-serif font-black text-stone-100 group-hover:text-blue-50 transition-colors select-none">
                                {String(t.id).padStart(2,'0')}
                            </div>
                            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-slate-700 mb-6 group-hover:bg-blue-900 group-hover:text-white transition-all">
                                <Icon name={t.symbol} size={24}/>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 font-serif mb-1 group-hover:text-blue-900 transition-colors">{t.title}</h3>
                            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">{t.engTitle}</p>
                        </div>

                        {/* Verse */}
                        <div className="px-8 py-4 bg-stone-50 border-y border-stone-100 min-h-[5rem] flex items-center justify-center">
                            <p className="text-base text-stone-600 font-serif italic text-center leading-relaxed">"{t.verse}"</p>
                        </div>

                        {/* Summary Content Body */}
                        <div className="p-8 pt-6 flex-grow flex flex-col">
                            <div className="mb-6 flex-grow">
                                <p className="text-slate-600 text-base leading-relaxed line-clamp-4 text-justify">
                                    {t.summary}
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {t.roles.slice(0, 3).map((role, i) => (
                                    <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded border border-stone-200">
                                        {role}
                                    </span>
                                ))}
                                {t.roles.length > 3 && <span className="text-xs text-stone-400 self-center">+ more</span>}
                            </div>

                            <button className="w-full py-3 rounded-xl bg-blue-50 text-blue-900 font-bold text-base hover:bg-blue-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                                <Icon name="BookOpen" size={16}/> 상세 프로필 보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Modal */}
            {selectedArchetype && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedArchetype(null)}
                >
                    <div 
                        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col animate-[scaleUp_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-8 py-6 border-b border-stone-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                                    <Icon name={selectedArchetype.symbol} size={24}/>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-slate-900 leading-none mb-1">{selectedArchetype.title}</h3>
                                    <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">{selectedArchetype.engTitle}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedArchetype(null)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-blue-900 transition-colors">
                                <Icon name="X" size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-12 space-y-12">
                            {/* 1. Identity & Calling */}
                            <section>
                                <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-100 pb-2">
                                    <Icon name="User" size={20}/> 소명과 정체성 (Identity & Calling)
                                </h4>
                                <p className="text-xl text-slate-800 font-serif italic leading-relaxed mb-6 pl-4 border-l-4 border-blue-900">
                                    "{selectedArchetype.verse}"
                                </p>
                                <p className="text-slate-700 leading-loose text-justify text-base whitespace-pre-line">
                                    {selectedArchetype.summary}
                                </p>
                            </section>

                            {/* NEW: Role Model Section (Added) */}
                            <section className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Icon name="Lightbulb" size={100}/>
                                </div>
                                <h4 className="text-lg font-bold text-amber-900 mb-6 flex items-center gap-2 relative z-10">
                                    <Icon name="Crown" size={20}/> 성경적 롤모델 (Biblical Role Model)
                                </h4>
                                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-md shrink-0 border-2 border-white">
                                        <Icon name="User" size={32}/>
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                                            {selectedArchetype.roleModel.name}
                                        </h5>
                                        <p className="text-amber-700 font-bold text-sm uppercase tracking-wide mb-3">
                                            "{selectedArchetype.roleModel.epithet}"
                                        </p>
                                        <p className="text-slate-700 text-base leading-relaxed text-justify mb-4">
                                            {selectedArchetype.roleModel.description}
                                        </p>
                                        <div className="bg-white/60 p-4 rounded-xl border border-amber-100">
                                            <p className="text-slate-600 text-sm italic font-serif">
                                                "{selectedArchetype.roleModel.bibleVerse}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 2. Official Roles */}
                            <section>
                                <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2 border-b border-indigo-100 pb-2">
                                    <Icon name="Briefcase" size={20}/> 추천 공직 포지션 (Recommended Positions)
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {selectedArchetype.roles.map((role, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-900 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* 3. Recommendations (HQ/Field) */}
                            <section>
                                <h4 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2 border-b border-emerald-100 pb-2">
                                    <Icon name="Map" size={20}/> 직무 환경별 가이드 (Work Context)
                                </h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                        <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                                            <Icon name="Castle" size={16}/> 본부 및 행정 (HQ)
                                        </h5>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {selectedArchetype.recommendations?.hq}
                                        </p>
                                    </div>
                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                                        <h5 className="font-bold text-amber-700 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                                            <Icon name="Flame" size={16}/> 현장 목회 (Field)
                                        </h5>
                                        <p className="text-slate-700 text-sm leading-relaxed">
                                            {selectedArchetype.recommendations?.field}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Contribution & Challenges Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                                    <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                                        <Icon name="Crown" size={20}/> 천일국 섭리 기여 (Contribution)
                                    </h4>
                                    <p className="text-slate-700 text-base leading-relaxed text-justify mb-4">
                                        {selectedArchetype.dna.why}
                                    </p>
                                    <div className="pt-4 border-t border-green-200">
                                        <div className="text-sm font-bold text-green-700 mb-2 uppercase">Core Gifts</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedArchetype.traits.via.slice(0,5).map((v, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-green-200 rounded text-sm font-bold text-green-800">{v}</span>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                                    <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                                        <Icon name="AlertTriangle" size={20}/> 혈통적 도전과제 (Challenges)
                                    </h4>
                                    <p className="text-slate-700 text-base leading-relaxed text-justify">
                                        {selectedArchetype.details.caution}
                                    </p>
                                </section>
                            </div>

                             {/* 5. Development Advice */}
                             <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                                <h4 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                                    <Icon name="Sprout" size={20}/> 성장을 위한 조언 (Growth Guide)
                                </h4>
                                <p className="text-slate-800 leading-relaxed text-base">
                                    {selectedArchetype.details.development}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            )}
            
             <style>{`
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
