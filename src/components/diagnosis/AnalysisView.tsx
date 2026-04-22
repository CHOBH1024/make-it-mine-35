
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { detailData, managementProfiles } from '@/lib/data';
import { educationContent } from '@/lib/educationData';
import { Archetype, Inputs, SavedAnalysis } from '@/lib/types';
import { TeamBuilder } from '@/components/diagnosis/TeamBuilder';
import { generateAnalysisPdf } from '@/lib/generatePdf';
import { buildShareUrl, copyToClipboard, webShare } from '@/lib/share';

interface AnalysisViewProps {
    results: Archetype[];
    inputs: Inputs;
    onRestore: (inputs: Inputs) => void;
}

// --- Radar Chart Component ---
const ArchetypeRadarChart: React.FC<{ data: Archetype[] }> = ({ data }) => {
    // Sort by ID to ensure consistent axes position (Type 1 is always top)
    const sortedData = [...data].sort((a, b) => a.id - b.id);
    
    const size = 320;
    const center = size / 2;
    const radius = 100;
    const maxScore = Math.max(...data.map(d => d.score || 0)) || 1; // Prevent div by 0

    // Helper to calculate coordinates
    const getCoords = (score: number, index: number, total: number, scaleRadius: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2; // Start at 12 o'clock
        const normalizedScore = score / maxScore;
        const x = center + scaleRadius * normalizedScore * Math.cos(angle);
        const y = center + scaleRadius * normalizedScore * Math.sin(angle);
        return { x, y };
    };

    // Generate Polygon Points
    const points = sortedData.map((d, i) => {
        const { x, y } = getCoords(d.score || 0, i, 9, radius);
        return `${x},${y}`;
    }).join(' ');

    // Generate Background Levels (Grid)
    const levels = [0.25, 0.5, 0.75, 1];

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full">
                {/* Background Circles/Polygons */}
                {levels.map((level, lvlIdx) => (
                    <polygon
                        key={lvlIdx}
                        points={sortedData.map((_, i) => {
                            const { x, y } = getCoords(maxScore, i, 9, radius * level);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#e7e5e4" // stone-200
                        strokeWidth="1"
                        strokeDasharray={lvlIdx === levels.length - 1 ? "0" : "4 4"}
                    />
                ))}

                {/* Axes Lines */}
                {sortedData.map((_, i) => {
                    const { x, y } = getCoords(maxScore, i, 9, radius);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="#e7e5e4"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon
                    points={points}
                    fill="rgba(30, 58, 138, 0.2)" // blue-900 with opacity
                    stroke="#1e3a8a" // blue-900
                    strokeWidth="2.5"
                    className="drop-shadow-md transition-all duration-1000 ease-out animate-[scaleUp_1s_ease-out]"
                />

                {/* Data Points (Dots) */}
                {sortedData.map((d, i) => {
                    const { x, y } = getCoords(d.score || 0, i, 9, radius);
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={d.score === maxScore ? "#f59e0b" : "#1e3a8a"} // Amber for max, Blue for others
                            className="transition-all duration-1000"
                        />
                    );
                })}

                {/* Labels */}
                {sortedData.map((d, i) => {
                    const { x, y } = getCoords(maxScore, i, 9, radius + 25);
                    // Adjust text anchor based on position
                    const anchor = Math.abs(x - center) < 10 ? 'middle' : x > center ? 'start' : 'end';
                    return (
                        <g key={i}>
                            <text
                                x={x}
                                y={y}
                                textAnchor={anchor}
                                alignmentBaseline="middle"
                                className={`text-[10px] md:text-xs font-bold fill-slate-600 font-serif ${d.score === maxScore ? 'fill-blue-900 font-black' : ''}`}
                            >
                                {d.id}. {d.title}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Helper to convert Big5 to MBTI-like code for display
const getMBTI = (big5: Inputs['big5']): string => {
    let mbti = '';
    mbti += big5.extraversion === 'High' ? 'E' : big5.extraversion === 'Low' ? 'I' : 'x';
    mbti += big5.openness === 'High' ? 'N' : big5.openness === 'Low' ? 'S' : 'x';
    mbti += big5.agreeableness === 'High' ? 'F' : big5.agreeableness === 'Low' ? 'T' : 'x';
    mbti += big5.conscientiousness === 'High' ? 'J' : big5.conscientiousness === 'Low' ? 'P' : 'x';
    return mbti.replace(/x/g, '-'); 
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ results, inputs, onRestore }) => {
    const [tab, setTab] = useState<'details' | 'cross_analysis' | 'growth' | 'practical' | 'prayer' | 'hr' | 'team' | 'management' | 'education'>('details');
    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
    const [saveName, setSaveName] = useState('');
    const [showSaveUI, setShowSaveUI] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Primary result is the first element
    const result = results.length > 0 ? results[0] : null;

    // Load saved analyses
    useEffect(() => {
        const stored = localStorage.getItem('cig_saved_analyses');
        if (stored) {
            try {
                setSavedAnalyses(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse saved analyses", e);
            }
        }
    }, []);

    const handleSaveAnalysis = () => {
        if (!saveName.trim()) {
            alert("저장할 이름을 입력해주세요.");
            return;
        }
        if (!result) return;

        const newAnalysis: SavedAnalysis = {
            id: Date.now().toString(),
            name: saveName,
            inputs: inputs,
            resultTitle: result.title,
            createdAt: Date.now()
        };

        const updated = [newAnalysis, ...savedAnalyses];
        setSavedAnalyses(updated);
        localStorage.setItem('cig_saved_analyses', JSON.stringify(updated));
        setSaveName('');
        setShowSaveUI(false);
        alert("분석 결과가 저장되었습니다.");
    };

    const handleDeleteAnalysis = (id: string) => {
        if (confirm("정말 이 기록을 삭제하시겠습니까?")) {
            const updated = savedAnalyses.filter(a => a.id !== id);
            setSavedAnalyses(updated);
            localStorage.setItem('cig_saved_analyses', JSON.stringify(updated));
        }
    };

    const handleLoadAnalysis = (analysis: SavedAnalysis) => {
        if (confirm(`'${analysis.name}' 기록을 불러오시겠습니까? 현재 화면의 분석 내용은 변경됩니다.`)) {
            onRestore(analysis.inputs);
        }
    };

    // Calculate match metrics for the primary result
    const matchMetrics = useMemo(() => {
        if (!result) return null;

        const dominantTrait = result.traits.big5;
        const userLevel = inputs.big5[dominantTrait];
        const isBig5Match = userLevel === 'High';
        const isAnchorMatch = result.traits.anchor.includes(inputs.anchor);
        const matchedVia = inputs.via.filter(v => result.traits.via.includes(v));
        
        return { isBig5Match, isAnchorMatch, matchedVia, userLevel };
    }, [result, inputs]);

    if (!result || !matchMetrics) return null;

    const userMBTI = getMBTI(inputs.big5);
    const userAnchorLabel = detailData.anchor[inputs.anchor]?.label;
    const maxScore = Math.max(...results.map(r => r.score || 0));

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 fade-in">
            {/* Save/Load Control Bar */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Icon name="User" className="text-blue-900"/> 분석 결과 대시보드
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={async () => {
                            if (!result) return;
                            setIsGeneratingPdf(true);
                            try {
                                await generateAnalysisPdf(result, results, inputs);
                            } catch (e) {
                                console.error('PDF generation failed', e);
                                alert('PDF 생성에 실패했습니다.');
                            } finally {
                                setIsGeneratingPdf(false);
                            }
                        }}
                        disabled={isGeneratingPdf}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 text-base border border-blue-200 disabled:opacity-50"
                    >
                    <Icon name="Download" size={16}/> {isGeneratingPdf ? 'PDF 생성 중...' : 'PDF 다운로드'}
                    </button>
                    <button 
                        onClick={async () => {
                            const url = buildShareUrl(inputs);
                            const ok = await copyToClipboard(url);
                            if (ok) {
                                setCopySuccess(true);
                                setTimeout(() => setCopySuccess(false), 2000);
                            }
                        }}
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold hover:bg-green-100 transition-colors flex items-center gap-2 text-base border border-green-200"
                    >
                        <Icon name="Link2" size={16}/> {copySuccess ? '복사됨!' : '링크 복사'}
                    </button>
                    <button 
                        onClick={() => {
                            if (!result) return;
                            const url = buildShareUrl(inputs);
                            webShare(
                                `목회공직자 유형: ${result.title}`,
                                `${result.subtitle} - Cheon Il Guk 목회공직자 유형진단 결과를 확인해보세요!`,
                                url
                            );
                        }}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2 text-base border border-indigo-200"
                    >
                        <Icon name="Share2" size={16}/> 공유하기
                    </button>
                    <button 
                        onClick={() => setShowSaveUI(!showSaveUI)}
                        className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold hover:bg-amber-100 transition-colors flex items-center gap-2 text-base border border-amber-200"
                    >
                        <Icon name="Save" size={16}/> 결과 저장
                    </button>
                    {savedAnalyses.length > 0 && (
                        <div className="relative group">
                            <button className="px-4 py-2 bg-stone-50 text-stone-700 rounded-lg font-bold hover:bg-stone-100 transition-colors flex items-center gap-2 text-base border border-stone-200">
                                <Icon name="BookOpen" size={16}/> 불러오기 ({savedAnalyses.length})
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden hidden group-hover:block z-50">
                                <div className="p-3 bg-stone-50 border-b border-stone-100 text-sm font-bold text-stone-500">저장된 분석 기록</div>
                                <div className="max-h-64 overflow-y-auto">
                                    {savedAnalyses.map(a => (
                                        <div key={a.id} className="p-3 hover:bg-blue-50 border-b border-stone-50 flex justify-between items-center group/item transition-colors cursor-pointer" onClick={() => handleLoadAnalysis(a)}>
                                            <div>
                                                <div className="font-bold text-slate-800 text-base">{a.name}</div>
                                                <div className="text-sm text-stone-500 mt-0.5">{a.resultTitle} • {new Date(a.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteAnalysis(a.id); }}
                                                className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                <Icon name="X" size={14}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save UI Panel */}
            {showSaveUI && (
                <div className="mb-8 bg-amber-50 p-6 rounded-2xl border border-amber-200 animate-[slideUp_0.3s_ease-out]">
                    <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                        <Icon name="Save" size={18}/> 현재 분석 결과 저장하기
                    </h4>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={saveName}
                            onChange={(e) => setSaveName(e.target.value)}
                            placeholder="저장할 이름 (예: 홍길동 2024년 1분기)"
                            className="flex-grow px-4 py-2 rounded-lg border border-amber-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        />
                        <button 
                            onClick={handleSaveAnalysis}
                            className="px-6 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                        >
                            저장
                        </button>
                    </div>
                </div>
            )}

            {/* Common Header Section */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 text-center relative mb-12">
                <div className="bg-slate-900 p-12 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <span className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-amber-400 text-sm font-bold tracking-[0.2em] uppercase mb-6">Cheon Il Guk Archetype</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4">{result.title}</h2>
                    <p className="text-xl text-slate-400 font-serif italic mb-8">{result.engTitle}</p>
                    <p className="text-lg md:text-xl text-stone-200 font-serif max-w-4xl mx-auto leading-relaxed border-l-4 border-amber-600 pl-6">"{result.verse}"</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center gap-2 md:gap-4 mb-12 border-b border-stone-200 sticky top-20 bg-[#fcfbf9] z-30 pt-4 overflow-x-auto">
                <button 
                    onClick={() => setTab('details')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='details' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="User" size={20} /> 상세
                </button>
                <button 
                    onClick={() => setTab('cross_analysis')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='cross_analysis' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Activity" size={20} /> 교차분석
                </button>
                <button 
                    onClick={() => setTab('growth')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='growth' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Sprout" size={20} /> 성장가이드
                </button>
                <button 
                    onClick={() => setTab('practical')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='practical' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Briefcase" size={20} /> 실전가이드
                </button>
                <button 
                    onClick={() => setTab('prayer')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='prayer' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Heart" size={20} /> 기도/묵상
                </button>
                <button 
                    onClick={() => setTab('hr')} 
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='hr' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Building" size={20} /> 인사 배치
                </button>
                <button
                    onClick={() => setTab('team')}
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='team' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="Users" size={20} /> 팀 시뮬레이션
                </button>
                <button
                    onClick={() => setTab('management')}
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='management' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="BarChart2" size={20} /> 경영학 프로파일
                </button>
                <button
                    onClick={() => setTab('education')}
                    className={`pb-4 px-3 text-base md:text-xl font-serif transition-all flex items-center gap-2 whitespace-nowrap ${tab==='education' ? 'text-blue-900 font-bold border-b-4 border-blue-900' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <Icon name="GraduationCap" size={20} /> 교육 커리큘럼
                </button>
            </div>

            {/* Content Body */}
            <div className="slide-up">
                {/* Details and Cross Analysis Tabs retained as is, adding render logic for new growth guide structure */}
                {tab === 'details' && (
                    <div className="space-y-16">
                        {/* 1. Identity & Theology */}
                        <section className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8">
                                <h3 className="text-3xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
                                    <Icon name="BookOpen" className="text-blue-900"/> 
                                    정체성 및 섭리적 맥락
                                </h3>
                                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mb-8">
                                    <h4 className="text-xl font-bold text-slate-900 mb-4 font-serif">"{result.subtitle}"</h4>
                                    <p className="text-xl text-slate-700 leading-loose text-justify font-serif mb-6">{result.summary}</p>
                                    <div className="bg-blue-50 p-6 rounded-xl text-blue-900 text-base leading-relaxed border border-blue-100">
                                        <strong><Icon name="Briefcase" className="inline mr-2" size={16}/>공직 가이드:</strong> {result.details.guide}
                                    </div>
                                </div>

                                {/* DNA Table */}
                                <h3 className="text-3xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
                                    <Icon name="Dna" className="text-purple-600"/> 
                                    섭리적 DNA (작동원리)
                                </h3>
                                <div className="grid md:grid-cols-3 gap-0 border border-stone-200 rounded-3xl overflow-hidden shadow-lg mb-8">
                                    <div className="bg-white p-6 md:border-r border-stone-200">
                                        <div className="text-sm font-bold text-stone-400 tracking-widest mb-2">BEHAVIOR</div>
                                        <h4 className="text-xl font-serif font-bold text-slate-900 mb-3">HOW (행동)</h4>
                                        <p className="text-slate-600 leading-relaxed text-base">{result.dna.how}</p>
                                    </div>
                                    <div className="bg-stone-50 p-6 md:border-r border-stone-200">
                                        <div className="text-sm font-bold text-stone-400 tracking-widest mb-2">STRENGTH</div>
                                        <h4 className="text-xl font-serif font-bold text-slate-900 mb-3">WHAT (강점)</h4>
                                        <p className="text-slate-600 leading-relaxed text-base">{result.dna.what}</p>
                                    </div>
                                    <div className="bg-white p-6">
                                        <div className="text-sm font-bold text-stone-400 tracking-widest mb-2">MOTIVATION</div>
                                        <h4 className="text-xl font-serif font-bold text-slate-900 mb-3">WHY (동기)</h4>
                                        <p className="text-slate-600 leading-relaxed text-base">{result.dna.why}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: Development & Caution */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl">
                                    <h3 className="text-xl font-bold text-white mb-4 font-serif flex items-center gap-2"><Icon name="Sprout" className="text-green-400"/> 필수 성장 과제</h3>
                                    <p className="text-slate-300 text-base leading-relaxed text-justify opacity-90">{result.details.development}</p>
                                </div>
                                <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
                                    <h3 className="text-xl font-bold text-amber-800 mb-4 font-serif flex items-center gap-2"><Icon name="AlertTriangle"/> 섭리적 주의사항</h3>
                                    <p className="text-slate-700 text-base leading-relaxed text-justify">{result.details.caution}</p>
                                </div>
                            </div>
                        </section>

                        {/* NEW: Enhanced Role Model Section */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Crown" className="text-amber-500"/> 
                                성경적 롤모델 & 레퍼런스
                            </h3>
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-stone-200">
                                <div className="grid lg:grid-cols-5">
                                    {/* Left: Visual & Profile */}
                                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-blue-900 p-10 text-white relative overflow-hidden flex flex-col justify-center">
                                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                        <div className="absolute -right-10 -bottom-10 opacity-20"><Icon name="BookOpen" size={200}/></div>
                                        
                                        <div className="relative z-10">
                                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-2 border-amber-400/50 shadow-lg mb-6">
                                                <Icon name="User" size={48} className="text-amber-400"/>
                                            </div>
                                            <div className="text-amber-400 font-bold tracking-widest uppercase text-sm mb-2">Biblical Model</div>
                                            <h4 className="text-4xl font-serif font-bold mb-2">{result.roleModel.name}</h4>
                                            <p className="text-lg text-blue-200 italic font-serif mb-6">"{result.roleModel.epithet}"</p>
                                            
                                            <div className="space-y-4 border-t border-white/10 pt-6">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Leadership Style</span>
                                                    <p className="text-white font-medium text-base">{result.roleModel.leadershipStyle}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Narrative & Lesson */}
                                    <div className="lg:col-span-3 p-10 bg-white">
                                        <div className="mb-8">
                                            <h5 className="font-bold text-slate-900 text-xl mb-4 flex items-center gap-2 font-serif">
                                                <Icon name="History" className="text-blue-900"/> 인물 탐구 (Biblical Context)
                                            </h5>
                                            <p className="text-slate-700 text-lg leading-loose text-justify font-serif">
                                                {result.roleModel.description}
                                            </p>
                                        </div>
                                        
                                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-6">
                                            <h5 className="font-bold text-amber-800 text-lg mb-2 flex items-center gap-2">
                                                <Icon name="Link" size={18}/> 아키타입 연결점
                                            </h5>
                                            <p className="text-slate-700 leading-relaxed">
                                                {result.roleModel.connection}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-4 items-start p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <Icon name="Zap" className="text-blue-600 mt-1 shrink-0" size={20}/>
                                                <div>
                                                    <span className="font-bold text-blue-900 block mb-1">Modern Lesson</span>
                                                    <p className="text-slate-700">{result.roleModel.lesson}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-stone-100 rounded-xl border-l-4 border-stone-400 italic text-slate-600 font-serif">
                                                "{result.roleModel.bibleVerse}"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* NEW: Enhanced Sub-Type Exploration Section */}
                        <section className="bg-stone-50 p-8 lg:p-12 rounded-[2.5rem] border border-stone-200">
                            <h3 className="text-3xl font-bold text-slate-900 mb-3 font-serif flex items-center gap-3">
                                <Icon name="ZoomIn" className="text-blue-900"/> 
                                세부 유형 탐색 (Deep Dive)
                            </h3>
                            <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
                                같은 유형이라도 집중하는 섭리적 포인트가 다릅니다. 각 세부 유형의 강점과 그림자(Risk)를 이해하면 더 정교한 자기 발전이 가능합니다.
                            </p>
                            
                            <div className="grid lg:grid-cols-3 gap-6">
                                {result.subTypes?.map((sub, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 group cursor-default flex flex-col overflow-hidden">
                                        {/* Card Header */}
                                        <div className="p-8 pb-4">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-900 group-hover:text-white transition-colors shadow-inner">
                                                    <Icon name={sub.symbol} size={28}/>
                                                </div>
                                                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                                    {sub.keyFocus}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-bold text-slate-900 font-serif mb-2">{sub.title}</h4>
                                            <p className="text-slate-500 text-sm font-medium italic mb-6">
                                                "{sub.catchphrase}"
                                            </p>
                                            <p className="text-slate-600 leading-relaxed text-justify mb-6">
                                                {sub.description}
                                            </p>
                                        </div>

                                        {/* Card Footer - Strength & Risk */}
                                        <div className="mt-auto bg-stone-50 p-6 border-t border-stone-100 text-sm space-y-3">
                                            <div className="flex gap-3">
                                                <Icon name="ThumbsUp" size={16} className="text-blue-600 shrink-0 mt-0.5"/>
                                                <div>
                                                    <span className="font-bold text-blue-900 block mb-0.5">Strength</span>
                                                    <span className="text-slate-600 leading-snug">{sub.strength}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Icon name="AlertTriangle" size={16} className="text-amber-600 shrink-0 mt-0.5"/>
                                                <div>
                                                    <span className="font-bold text-amber-900 block mb-0.5">Risk (Shadow)</span>
                                                    <span className="text-slate-600 leading-snug">{sub.risk}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Contextual Recommendations (HQ vs Field) */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Map" className="text-emerald-600"/> 
                                직무 환경별 역할 제안 (Contextual Roles)
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl border-l-8 border-slate-700 shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Icon name="Castle" size={120} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-3">
                                        <span className="bg-slate-100 p-2 rounded-lg text-slate-700"><Icon name="Castle" size={24}/></span>
                                        본부 및 행정 (HQ)
                                    </h4>
                                    <p className="text-slate-700 text-lg leading-loose text-justify font-medium relative z-10">
                                        {result.recommendations?.hq}
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border-l-8 border-amber-600 shadow-lg relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Icon name="Flame" size={120} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-3">
                                        <span className="bg-amber-50 p-2 rounded-lg text-amber-600"><Icon name="Flame" size={24}/></span>
                                        현장 목회 (Field Ministry)
                                    </h4>
                                    <p className="text-slate-700 text-lg leading-loose text-justify font-medium relative z-10">
                                        {result.recommendations?.field}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Roles & Prediction */}
                        <section>
                             <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Compass" className="text-red-500"/> 
                                공직 생활 시뮬레이션
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                                    <h4 className="text-xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-2"><Icon name="Activity"/> 행동 패턴 예측</h4>
                                    <p className="text-slate-700 text-lg leading-relaxed text-justify italic border-l-4 border-slate-300 pl-4 bg-slate-50 py-4 pr-4 rounded-r-lg">
                                        "{result.prediction}"
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                                    <h4 className="text-xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-2"><Icon name="Briefcase"/> 주요 활동 시나리오</h4>
                                    <ul className="space-y-3">
                                        {result.activities.map((act, i) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700 text-base">
                                                <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                                {act}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Cross Analysis Tab Content (Keep existing code structure, just ensure it renders) */}
                {tab === 'cross_analysis' && (
                    <div className="space-y-16">
                        {/* 1. Holistic Chart (Refactored with Radar Chart) */}
                        <section>
                             <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Activity" className="text-amber-600"/> 
                                전체 아키타입 분포도 (Holistic Analysis)
                            </h3>
                            <div className="bg-white p-8 lg:p-12 rounded-2xl border border-stone-200 shadow-sm">
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    {/* Left: Radar Chart */}
                                    <div className="flex justify-center order-2 lg:order-1 bg-slate-50 rounded-3xl p-6">
                                        <ArchetypeRadarChart data={results} />
                                    </div>
                                    
                                    {/* Right: Ranking & Insight */}
                                    <div className="order-1 lg:order-2 space-y-6">
                                        <div>
                                            <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif">당신의 섭리적 스펙트럼</h4>
                                            <p className="text-slate-600 mb-6 text-base leading-relaxed text-justify">
                                                당신의 내면에는 하나의 색깔만 있는 것이 아닙니다. 
                                                <strong className="text-blue-900"> {result.title}</strong>(이)가 주된 성향이지만, 
                                                그래프의 모양을 통해 당신에게 잠재된 <strong className="text-amber-600">보조 은사(Secondary Gift)</strong>와 
                                                상대적으로 개발이 필요한 영역을 한눈에 확인할 수 있습니다.
                                                그래프가 넓고 고르게 분포할수록 다양한 사역을 감당할 수 있는 균형 잡힌 리더십을 의미합니다.
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-3 h-80 overflow-y-auto pr-2 custom-scrollbar">
                                            {results.map((r, idx) => {
                                                const percentage = ((r.score || 0) / maxScore) * 100;
                                                const isTop = idx === 0;
                                                return (
                                                    <div key={r.id} className="relative group">
                                                        <div className="flex justify-between items-end mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm font-bold w-6 ${isTop ? 'text-blue-900' : 'text-slate-400'}`}>
                                                                    {idx + 1}
                                                                </span>
                                                                <span className={`text-base font-bold ${isTop ? 'text-blue-900' : 'text-slate-700'}`}>
                                                                    {r.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-stone-400 font-mono">{Math.round(r.score || 0)} pts</span>
                                                        </div>
                                                        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                                                            <div 
                                                                className={`h-2.5 rounded-full transition-all duration-1000 ${isTop ? 'bg-blue-900' : 'bg-stone-300 group-hover:bg-blue-300'}`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Comparative Analysis */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Scale" className="text-amber-600"/> 
                                나의 속성 vs 아키타입 비교 (Gap Analysis)
                            </h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* MBTI / Behavior */}
                                <div className={`p-6 rounded-2xl border-2 ${matchMetrics.isBig5Match ? 'bg-blue-50 border-blue-200' : 'bg-white border-stone-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><Icon name="Activity" size={18}/> 행동양식 (MBTI/Big5)</h4>
                                        {matchMetrics.isBig5Match && <span className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">일치</span>}
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 mb-2">INPUT: {userMBTI}</div>
                                    <p className="text-base text-slate-600 mb-4">
                                        {matchMetrics.isBig5Match 
                                            ? `귀하의 특성이 이 아키타입의 주요 특성(${detailData.big5[result.traits.big5].name})과 잘 부합합니다.` 
                                            : `이 아키타입은 '${detailData.big5[result.traits.big5].name}' 성향이 강합니다. 귀하와는 접근 방식에 차이가 있을 수 있습니다.`}
                                    </p>
                                </div>

                                {/* Anchor / Motivation */}
                                <div className={`p-6 rounded-2xl border-2 ${matchMetrics.isAnchorMatch ? 'bg-blue-50 border-blue-200' : 'bg-white border-stone-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><Icon name="Anchor" size={18}/> 동기요인 (앵커)</h4>
                                        {matchMetrics.isAnchorMatch ? 
                                            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">일치</span> : 
                                            <span className="bg-stone-100 text-stone-600 text-sm font-bold px-2 py-1 rounded">관점 차이</span>
                                        }
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 mb-2">INPUT: {userAnchorLabel}</div>
                                    <p className="text-base text-slate-600 mb-4">
                                        {matchMetrics.isAnchorMatch 
                                            ? "직업적 가치관이 아키타입의 방향성과 일치하여 높은 섭리적 만족도가 예상됩니다."
                                            : `이 유형은 보통 '${result.traits.anchor.map(a => detailData.anchor[a].label).join(', ')}' 지향적입니다. 상호 보완적 노력이 필요합니다.`}
                                    </p>
                                </div>

                                {/* VIA / Strength */}
                                <div className="p-6 rounded-2xl border-2 bg-blue-50 border-blue-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2"><Icon name="Sparkles" size={18}/> 핵심강점 (VIA)</h4>
                                        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded">{matchMetrics.matchedVia.length}건 일치</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {matchMetrics.matchedVia.map(v => (
                                            <span key={v} className="px-2 py-1 bg-white border border-blue-200 rounded text-sm font-bold text-blue-800">{v}</span>
                                        ))}
                                        {matchMetrics.matchedVia.length === 0 && <span className="text-base text-stone-400">일치하는 주요 강점이 없습니다.</span>}
                                    </div>
                                    <p className="text-base text-slate-600">
                                        귀하의 강점 중 {matchMetrics.matchedVia.length > 0 ? matchMetrics.matchedVia.join(', ') : '일부'} 특성이 이 아키타입의 DNA와 공명합니다.
                                    </p>
                                </div>
                            </div>
                        </section>

                         {/* 4. Input Summary (Previously 'detail' tab content) */}
                         <section>
                             <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Fingerprint" className="text-stone-400"/> 
                                나의 진단 데이터 원본
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-start gap-4">
                                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><Icon name="Fingerprint"/></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Enneagram: {detailData.enneagram[inputs.enneagram]?.label}</h4>
                                        <p className="text-base text-slate-600 mt-1">{detailData.enneagram[inputs.enneagram]?.desc}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-start gap-4">
                                    <div className="p-3 bg-green-50 rounded-lg text-green-600"><Icon name="Brain"/></div>
                                    <div className="w-full">
                                        <h4 className="font-bold text-slate-900 mb-2">Big 5 Profile ({userMBTI})</h4>
                                        <div className="grid grid-cols-5 gap-2 text-sm text-center">
                                            {Object.entries(inputs.big5).map(([key, level]) => (
                                                <div key={key} className={`p-2 rounded ${level==='High'?'bg-green-100 font-bold':level==='Low'?'bg-stone-100 text-stone-400':'bg-stone-50'}`}>
                                                    {key.slice(0,1).toUpperCase()}{key.slice(1,3)}: {level}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Icon name="Anchor"/></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Career Anchor: {detailData.anchor[inputs.anchor]?.label}</h4>
                                        <p className="text-base text-slate-600 mt-1">{detailData.anchor[inputs.anchor]?.desc}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-start gap-4">
                                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Icon name="Sparkles"/></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2">Signature Strengths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {inputs.via.map(v=><span key={v} className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-sm font-bold">{v}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* NEW: Expanded Growth Guide Tab */}
                {tab === 'growth' && (
                     <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
                        <section className="text-center mb-8">
                             <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">
                                공직자를 위한 4차원 성장 로드맵
                            </h3>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                당신의 아키타입이 가진 잠재력을 100% 발휘하기 위한 구체적인 훈련법입니다.<br/>
                                <strong className="text-blue-900">영성, 직무, 리더십, 관계</strong>의 4가지 영역에서 균형 잡힌 성장을 이루십시오.
                            </p>
                        </section>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* 1. Spiritual Discipline */}
                            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl group hover:border-purple-300 transition-all">
                                <div className="bg-purple-50 p-8 border-b border-purple-100 flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shadow-sm"><Icon name="Dumbbell" size={32}/></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-purple-900 font-serif">1. 내적 영성 훈련 (Inner Spirit)</h4>
                                        <p className="text-sm text-purple-700 opacity-80">무너지지 않는 내면의 힘을 기르는 정성</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h5 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{result.growthGuide.discipline.title}</h5>
                                    <p className="text-slate-600 leading-loose text-justify mb-6 whitespace-pre-line">
                                        {result.growthGuide.discipline.description}
                                    </p>
                                    <div className="bg-purple-50/50 rounded-xl p-5 border border-purple-100">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block mb-3">Action Items</span>
                                        <ul className="space-y-2">
                                            {result.growthGuide.discipline.actionItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <Icon name="Check" size={16} className="text-purple-500 mt-1 shrink-0"/> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Professional Skill */}
                            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl group hover:border-blue-300 transition-all">
                                <div className="bg-blue-50 p-8 border-b border-blue-100 flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shadow-sm"><Icon name="Briefcase" size={32}/></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-blue-900 font-serif">2. 직무 전문성 (Outer Competence)</h4>
                                        <p className="text-sm text-blue-700 opacity-80">섭리적 성과를 창출하는 실체적 기술</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h5 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{result.growthGuide.skill.title}</h5>
                                    <p className="text-slate-600 leading-loose text-justify mb-6 whitespace-pre-line">
                                        {result.growthGuide.skill.description}
                                    </p>
                                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-3">Skill Up Strategy</span>
                                        <ul className="space-y-2">
                                            {result.growthGuide.skill.actionItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <Icon name="Check" size={16} className="text-blue-500 mt-1 shrink-0"/> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Leadership Coaching */}
                            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl group hover:border-amber-300 transition-all">
                                <div className="bg-amber-50 p-8 border-b border-amber-100 flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shadow-sm"><Icon name="Crown" size={32}/></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-amber-900 font-serif">3. 리더십 스타일 (Leadership)</h4>
                                        <p className="text-sm text-amber-700 opacity-80">사람을 얻고 조직을 이끄는 지혜</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h5 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{result.growthGuide.leadership.title}</h5>
                                    <p className="text-slate-600 leading-loose text-justify mb-6 whitespace-pre-line">
                                        {result.growthGuide.leadership.description}
                                    </p>
                                    <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100">
                                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-3">Coaching Points</span>
                                        <ul className="space-y-2">
                                            {result.growthGuide.leadership.actionItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <Icon name="Check" size={16} className="text-amber-500 mt-1 shrink-0"/> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Relationship & Communication */}
                            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl group hover:border-green-300 transition-all">
                                <div className="bg-green-50 p-8 border-b border-green-100 flex items-center gap-4">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-xl shadow-sm"><Icon name="HeartHandshake" size={32}/></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-green-900 font-serif">4. 관계와 소통 (Relationship)</h4>
                                        <p className="text-sm text-green-700 opacity-80">갈등을 넘어 화합으로 가는 대화법</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h5 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{result.growthGuide.relationship.title}</h5>
                                    <p className="text-slate-600 leading-loose text-justify mb-6 whitespace-pre-line">
                                        {result.growthGuide.relationship.description}
                                    </p>
                                    <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-3">Communication Tips</span>
                                        <ul className="space-y-2">
                                            {result.growthGuide.relationship.actionItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
                                                    <Icon name="Check" size={16} className="text-green-500 mt-1 shrink-0"/> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Checklist & Education */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 bg-stone-50 border border-stone-200 rounded-3xl p-10">
                                <h4 className="text-2xl font-bold text-slate-900 mb-6 font-serif flex items-center gap-3">
                                    <Icon name="ListChecks" className="text-blue-600" size={28}/>
                                    이번 주 실천 체크리스트 (Weekly Routine)
                                </h4>
                                <div className="space-y-4">
                                    {result.growthGuide.checklist.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-blue-300 transition-colors group cursor-pointer">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-400 font-bold flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <p className="text-lg text-slate-700 font-medium group-hover:text-slate-900">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-indigo-900 text-white rounded-3xl p-10 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 p-6 opacity-10"><Icon name="GraduationCap" size={120}/></div>
                                <h4 className="text-xl font-bold text-indigo-200 mb-4 uppercase tracking-widest">Recommended Education</h4>
                                <h3 className="text-3xl font-serif font-bold mb-6 leading-tight">
                                    추천 학습 분야 및<br/>전공 가이드
                                </h3>
                                <p className="text-lg text-indigo-100 leading-relaxed relative z-10">
                                    {result.growthGuide.education}
                                </p>
                            </div>
                        </div>
                     </div>
                )}
                
                {/* NEW: Practical Guide Tab */}
                {tab === 'practical' && (
                    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
                        <section className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">
                                공직 실전 가이드
                            </h3>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                일선 현장에서 바로 적용할 수 있는 구체적인 행동 지침과 갈등 해결 시나리오입니다.
                            </p>
                        </section>

                        {/* Weekly Plan */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Calendar" className="text-emerald-600"/> 
                                주간 업무 루틴 (Weekly Schedule)
                            </h3>
                            <div className="grid md:grid-cols-7 gap-3">
                                {result.weeklyPlan && Object.entries(result.weeklyPlan).map(([day, task]) => {
                                    const dayLabels: Record<string, string> = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };
                                    const dayColors: Record<string, string> = { mon: 'border-blue-200 bg-blue-50', tue: 'border-green-200 bg-green-50', wed: 'border-purple-200 bg-purple-50', thu: 'border-amber-200 bg-amber-50', fri: 'border-red-200 bg-red-50', sat: 'border-indigo-200 bg-indigo-50', sun: 'border-rose-200 bg-rose-50' };
                                    return (
                                        <div key={day} className={`p-4 rounded-2xl border-2 ${dayColors[day] || 'bg-white border-stone-200'} flex flex-col`}>
                                            <div className="text-2xl font-black text-slate-900 mb-2 text-center">{dayLabels[day]}</div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{task as string}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Conflict Scenarios */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="AlertTriangle" className="text-red-500"/> 
                                갈등 시나리오 & 대응법 (Conflict Resolution)
                            </h3>
                            <div className="space-y-8">
                                {result.conflictScenarios?.map((scenario, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                        <div className="bg-slate-800 text-white p-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">S{idx + 1}</span>
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Situation</span>
                                            </div>
                                            <p className="text-lg font-medium leading-relaxed">{scenario.situation}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-0">
                                            <div className="p-6 border-r border-b md:border-b-0 border-stone-100 bg-red-50/30">
                                                <h5 className="flex items-center gap-2 text-red-700 font-bold mb-3">
                                                    <Icon name="X" size={18} className="bg-red-100 rounded-full p-0.5"/> ✗ 이렇게 하면 안 됩니다
                                                </h5>
                                                <p className="text-slate-700 leading-relaxed">{scenario.wrongResponse}</p>
                                            </div>
                                            <div className="p-6 bg-green-50/30">
                                                <h5 className="flex items-center gap-2 text-green-700 font-bold mb-3">
                                                    <Icon name="Check" size={18} className="bg-green-100 rounded-full p-0.5"/> ✓ 이렇게 하세요
                                                </h5>
                                                <p className="text-slate-700 leading-relaxed">{scenario.rightResponse}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-amber-50 border-t border-amber-100">
                                            <p className="text-amber-900 font-bold text-sm flex items-start gap-2">
                                                <Icon name="Lightbulb" size={16} className="shrink-0 mt-0.5"/>
                                                <span><strong>원칙:</strong> {scenario.principle}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Practical Tips */}
                        <section>
                            <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Zap" className="text-amber-500"/> 
                                실전 DO & DON'T (Practical Tips)
                            </h3>
                            <div className="space-y-8">
                                {result.practicalTips?.map((tip, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                        <div className="p-8 border-b border-stone-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{tip.category}</span>
                                            </div>
                                            <h4 className="text-2xl font-bold text-slate-900 font-serif mb-3">{tip.title}</h4>
                                            <p className="text-slate-600 text-lg leading-relaxed">{tip.description}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-0">
                                            <div className="p-6 border-r border-stone-100 bg-green-50/30">
                                                <h5 className="flex items-center gap-2 text-green-800 font-bold mb-4 text-lg">
                                                    <Icon name="ThumbsUp" size={20}/> DO — 이렇게 하세요
                                                </h5>
                                                <ul className="space-y-3">
                                                    {tip.doList.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                                            <Icon name="Check" size={16} className="text-green-500 mt-1 shrink-0"/>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-6 bg-red-50/30">
                                                <h5 className="flex items-center gap-2 text-red-800 font-bold mb-4 text-lg">
                                                    <Icon name="AlertTriangle" size={20}/> DON'T — 이것만은 피하세요
                                                </h5>
                                                <ul className="space-y-3">
                                                    {tip.dontList.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                                            <Icon name="X" size={16} className="text-red-400 mt-1 shrink-0"/>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Motto Quotes */}
                        <section className="bg-gradient-to-br from-slate-900 to-blue-900 p-12 rounded-[2.5rem] text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold text-amber-400 mb-8 font-serif text-center flex items-center justify-center gap-3">
                                    <Icon name="Quote" size={24}/> {result.title}의 좌우명
                                </h3>
                                <div className="space-y-6">
                                    {result.mottoQuotes?.map((quote, idx) => (
                                        <p key={idx} className="text-xl text-slate-200 font-serif italic text-center leading-relaxed">
                                            "{quote}"
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* NEW: Prayer & Meditation Tab */}
                {tab === 'prayer' && (
                    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
                        <section className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">
                                기도와 묵상 가이드
                            </h3>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                당신의 아키타입에 맞춘 영적 훈련과 기도문입니다.<br/>
                                매일 아침과 저녁, 하나님과 깊이 만나는 시간을 가지십시오.
                            </p>
                        </section>

                        {result.prayerGuide && (
                            <>
                                {/* Morning & Noon & Evening & Special Prayers */}
                                <section className="grid lg:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-3xl border border-amber-200 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 opacity-10">
                                            <Icon name="Sun" size={120}/>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                                    <Icon name="Sun" size={24}/>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-amber-900 font-serif">아침 기도문</h4>
                                                    <p className="text-sm text-amber-700">Morning Prayer</p>
                                                </div>
                                            </div>
                                            <p className="text-lg text-slate-800 leading-loose font-serif italic text-justify">
                                                "{result.prayerGuide.morningPrayer}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Noon Prayer */}
                                    <div className="bg-gradient-to-br from-sky-50 to-cyan-50 p-10 rounded-3xl border border-sky-200 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 opacity-10">
                                            <Icon name="CloudSun" size={120}/>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600">
                                                    <Icon name="CloudSun" size={24}/>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-sky-900 font-serif">낮 기도문</h4>
                                                    <p className="text-sm text-sky-700">Noon Prayer</p>
                                                </div>
                                            </div>
                                            <p className="text-lg text-slate-800 leading-loose font-serif italic text-justify">
                                                "{result.prayerGuide.noonPrayer}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Evening Reflection */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-10 rounded-3xl border border-indigo-200 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 opacity-10">
                                            <Icon name="Moon" size={120}/>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                                    <Icon name="Moon" size={24}/>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-indigo-900 font-serif">저녁 성찰</h4>
                                                    <p className="text-sm text-indigo-700">Evening Reflection</p>
                                                </div>
                                            </div>
                                            <p className="text-lg text-slate-800 leading-loose font-serif italic text-justify">
                                                "{result.prayerGuide.eveningReflection}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Special Prayer */}
                                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-10 rounded-3xl border border-rose-200 relative overflow-hidden">
                                        <div className="absolute -top-4 -right-4 opacity-10">
                                            <Icon name="Flame" size={120}/>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                                                    <Icon name="Flame" size={24}/>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-rose-900 font-serif">특별 기도문</h4>
                                                    <p className="text-sm text-rose-700">Special Prayer (위기·결단의 순간)</p>
                                                </div>
                                            </div>
                                            <p className="text-lg text-slate-800 leading-loose font-serif italic text-justify">
                                                "{result.prayerGuide.specialPrayer}"
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Weekly Focus */}
                                <section>
                                    <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                        <Icon name="Calendar" className="text-purple-600"/> 
                                        요일별 영성 포커스 (Weekly Spiritual Focus)
                                    </h3>
                                    <div className="grid md:grid-cols-7 gap-3">
                                        {result.prayerGuide.weeklyFocus?.map((focus, idx) => {
                                            const colors = ['bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-purple-50 border-purple-200', 'bg-amber-50 border-amber-200', 'bg-red-50 border-red-200', 'bg-indigo-50 border-indigo-200', 'bg-rose-50 border-rose-200'];
                                            // Parse "월: 겸손 — ..." format
                                            const parts = focus.split(' — ');
                                            const dayAndTheme = parts[0] || '';
                                            const description = parts[1] || '';
                                            const [day, theme] = dayAndTheme.split(': ');
                                            
                                            return (
                                                <div key={idx} className={`p-4 rounded-2xl border-2 ${colors[idx] || 'bg-white border-stone-200'} text-center flex flex-col`}>
                                                    <div className="text-2xl font-black text-slate-900 mb-1">{day}</div>
                                                    <div className="text-base font-bold text-blue-900 mb-2">{theme}</div>
                                                    <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* Motto Quotes in Prayer Context */}
                                <section className="bg-white rounded-3xl border border-stone-200 p-10 shadow-lg">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-8 font-serif text-center flex items-center justify-center gap-3">
                                        <Icon name="BookOpen" className="text-amber-600" size={24}/> 묵상 말씀 카드
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {result.mottoQuotes?.map((quote, idx) => (
                                            <div key={idx} className="bg-stone-50 p-6 rounded-2xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-default">
                                                <p className="text-slate-700 font-serif italic leading-relaxed text-center">
                                                    "{quote}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                )}
                
                {/* HR Deployment Tab */}
                {tab === 'hr' && (
                    <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
                        <section className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">
                                인사 배치 & 성과 관리
                            </h3>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                유형 분석을 기반으로 배치 적합도, KPI 템플릿, 생애주기 로드맵을 제공합니다.
                            </p>
                        </section>

                        {/* Deployment Fit */}
                        {result.deploymentFit && (
                            <section className="space-y-10">
                                <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                    <Icon name="MapPin" className="text-emerald-600"/> 
                                    인사 배치 종합 분석
                                </h3>

                                {/* HR Recommendation Banner */}
                                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2 font-serif">
                                            <Icon name="FileText" size={20} className="text-amber-400"/> 커리어 종합 권고사항
                                        </h4>
                                        <p className="text-slate-200 leading-loose text-sm">{result.deploymentFit.hrRecommendation}</p>
                                    </div>
                                </div>

                                {/* Score Bars + DISC Profile */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8">
                                        <h4 className="text-xl font-bold text-slate-900 mb-6 font-serif">본부 vs 현장 적합도</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-slate-700 flex items-center gap-2"><Icon name="Building" size={16} className="text-blue-600"/> 본부 (HQ)</span>
                                                    <span className="font-bold text-blue-900">{result.deploymentFit.hqScore}/10</span>
                                                </div>
                                                <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-full transition-all duration-1000" style={{width: `${result.deploymentFit.hqScore * 10}%`}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-slate-700 flex items-center gap-2"><Icon name="MapPin" size={16} className="text-green-600"/> 현장 (Field)</span>
                                                    <span className="font-bold text-green-900">{result.deploymentFit.fieldScore}/10</span>
                                                </div>
                                                <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-green-500 to-green-700 h-full rounded-full transition-all duration-1000" style={{width: `${result.deploymentFit.fieldScore * 10}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                                            <p className="text-slate-700 leading-relaxed text-sm">{result.deploymentFit.reasoning}</p>
                                        </div>
                                    </div>

                                    {/* DISC Profile */}
                                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl border border-purple-200 shadow-lg p-8">
                                        <h4 className="text-xl font-bold text-purple-900 mb-4 font-serif flex items-center gap-2">
                                            <Icon name="User" className="text-purple-600"/> DISC 적성 프로파일
                                        </h4>
                                        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-purple-100">
                                            <span className="text-lg font-black text-purple-800">{result.deploymentFit.discProfile.primaryType}</span>
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed mb-4">{result.deploymentFit.discProfile.description}</p>
                                        <div className="bg-purple-100/50 rounded-xl p-4 border border-purple-200">
                                            <h5 className="font-bold text-purple-800 text-sm mb-1">📌 배치 적합 근거</h5>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.discProfile.fitReason}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ideal Departments & Warning */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-8">
                                        <h4 className="text-xl font-bold text-emerald-900 mb-4 font-serif flex items-center gap-2">
                                            <Icon name="Check" className="text-emerald-600"/> 추천 배치 부서
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {result.deploymentFit.idealDepartments.map((dept, idx) => (
                                                <span key={idx} className="bg-white px-4 py-2 rounded-full border border-emerald-200 text-emerald-800 font-bold text-sm shadow-sm">
                                                    {dept}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-red-50 rounded-3xl border border-red-200 p-8">
                                        <h4 className="text-xl font-bold text-red-900 mb-4 font-serif flex items-center gap-2">
                                            <Icon name="AlertTriangle" className="text-red-500"/> 배치 주의 영역
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.deploymentFit.warningPlacements.map((warn, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700">
                                                    <Icon name="X" size={16} className="text-red-400 mt-1 shrink-0"/>
                                                    <span className="text-sm">{warn}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Placement Principles */}
                                <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Icon name="Scale" size={24} className="text-white"/></div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white font-serif">배치 원칙 및 근거</h4>
                                            <p className="text-sm text-blue-100">유형 분석 및 커리어 가이드 기반</p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {result.deploymentFit.placementPrinciples.map((principle, idx) => (
                                            <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-800 font-black text-sm shrink-0">{idx + 1}</div>
                                                    <h5 className="font-bold text-slate-900 text-base">{principle.title}</h5>
                                                </div>
                                                <p className="text-slate-700 text-sm leading-relaxed ml-11 mb-3">{principle.description}</p>
                                                <div className="ml-11 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                                    <p className="text-xs text-blue-800 font-medium">📋 근거: {principle.basis}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Organization Expectation */}
                                {result.deploymentFit.organizationExpectation && (
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200 shadow-lg p-8">
                                    <h4 className="text-xl font-bold text-indigo-900 mb-6 font-serif flex items-center gap-2">
                                        <Icon name="Users" className="text-indigo-600"/> 조직이 이 유형에게 기대하는 것
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-xl p-4 border border-indigo-200">
                                            <h5 className="font-bold text-indigo-800 text-sm mb-2">핵심 역할</h5>
                                            <p className="text-slate-800 font-semibold text-base">{result.deploymentFit.organizationExpectation.role}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-indigo-200">
                                            <h5 className="font-bold text-indigo-800 text-sm mb-3">구체적 기대 사항</h5>
                                            <ul className="space-y-2">
                                                {result.deploymentFit.organizationExpectation.expectations.map((exp, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <Icon name="ChevronRight" size={14} className="text-indigo-400 mt-0.5 shrink-0"/>
                                                        <span>{exp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-indigo-100/60 rounded-xl p-4 border border-indigo-200">
                                            <h5 className="font-bold text-indigo-800 text-sm mb-1">함께하면 시너지 나는 유형</h5>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.organizationExpectation.idealPartner}</p>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Onboarding Steps */}
                                <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Icon name="Route" size={24} className="text-white"/></div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white font-serif">온보딩 로드맵 (신입→안착)</h4>
                                            <p className="text-sm text-emerald-100">단계별 과업 및 멘토 배정</p>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {result.deploymentFit.onboardingSteps.map((step, idx) => {
                                            const stepColors = ['bg-emerald-100 text-emerald-800', 'bg-blue-100 text-blue-800', 'bg-amber-100 text-amber-800', 'bg-purple-100 text-purple-800'];
                                            const borderColors = ['border-emerald-200', 'border-blue-200', 'border-amber-200', 'border-purple-200'];
                                            return (
                                                <div key={idx} className={`p-5 rounded-2xl border-2 ${borderColors[idx]} bg-stone-50/50`}>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                                        <span className={`${stepColors[idx]} px-3 py-1 rounded-full text-sm font-bold w-fit`}>{step.phase}</span>
                                                        <span className="text-slate-500 text-sm font-medium">{step.period}</span>
                                                        <span className="text-slate-500 text-xs">| 멘토: <span className="font-bold text-slate-700">{step.mentor}</span></span>
                                                    </div>
                                                    <ul className="grid sm:grid-cols-2 gap-2">
                                                        {step.tasks.map((task, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                                <Icon name="Check" size={14} className="text-emerald-500 mt-0.5 shrink-0"/>
                                                                <span>{task}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Salary Structure + Central Hiring */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-slate-50 to-stone-50 rounded-3xl border border-stone-200 shadow-lg p-8">
                                        <h4 className="text-xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-2">
                                            <Icon name="Wallet" className="text-slate-600"/> 인건비 구조
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-white rounded-xl p-4 border border-stone-200">
                                                <span className="text-xs text-slate-500">직급 기준</span>
                                                <p className="font-bold text-slate-900">{result.deploymentFit.salaryStructure.grade}</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-stone-200">
                                                <span className="text-xs text-slate-500">중앙 인건비 지원</span>
                                                <p className="font-bold text-emerald-700">{result.deploymentFit.salaryStructure.centralSupport ? '✅ 협회 직접 지원 대상' : '❌ 교구 자체 부담'}</p>
                                            </div>
                                            <div className="bg-white rounded-xl p-4 border border-stone-200">
                                                <span className="text-xs text-slate-500">비고</span>
                                                <p className="text-sm text-slate-700 leading-relaxed">{result.deploymentFit.salaryStructure.note}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-200 shadow-lg p-8">
                                        <h4 className="text-xl font-bold text-rose-900 mb-4 font-serif flex items-center gap-2">
                                            <Icon name="ShieldCheck" className="text-rose-600"/> 중앙 채용 관리 원칙
                                        </h4>
                                        <p className="text-slate-700 text-sm leading-loose">{result.deploymentFit.centralHiringNote}</p>
                                    </div>
                                </div>

                                {/* HR Placement Guide */}
                                {result.deploymentFit.hrPlacementGuide && (
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 shadow-lg overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg"><Icon name="TrendingUp" size={24} className="text-white"/></div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white font-serif">인사 배치 가이드</h4>
                                            <p className="text-sm text-emerald-100">단기 · 중기 · 장기 성장 경로 및 인사 주의사항</p>
                                        </div>
                                    </div>
                                    <div className="p-6 grid md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                            <h5 className="font-bold text-emerald-800 text-sm mb-2">단기 (1~3년)</h5>
                                            <p className="text-sm text-slate-700 leading-relaxed">{result.deploymentFit.hrPlacementGuide.shortTerm}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                            <h5 className="font-bold text-emerald-800 text-sm mb-2">중기 (4~7년)</h5>
                                            <p className="text-sm text-slate-700 leading-relaxed">{result.deploymentFit.hrPlacementGuide.midTerm}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-teal-200">
                                            <h5 className="font-bold text-teal-800 text-sm mb-2">장기 (8년 이상)</h5>
                                            <p className="text-sm text-slate-700 leading-relaxed">{result.deploymentFit.hrPlacementGuide.longTerm}</p>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                            <h5 className="font-bold text-amber-800 text-sm mb-2">인사 주의사항</h5>
                                            <p className="text-sm text-slate-700 leading-relaxed">{result.deploymentFit.hrPlacementGuide.watchOut}</p>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </section>
                        )}

                        {/* KPI Template */}
                        {result.kpiTemplate && (
                            <section>
                                <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                    <Icon name="Target" className="text-amber-500"/> 
                                    유형별 KPI 템플릿 (Performance Indicators)
                                </h3>
                                <div className="space-y-6">
                                    {/* Quantitative */}
                                    <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                        <div className="bg-blue-50 p-6 border-b border-blue-100 flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Icon name="BarChart3" size={24}/></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-blue-900 font-serif">정량 지표 (Quantitative)</h4>
                                                <p className="text-sm text-blue-700">측정 가능한 업무 성과</p>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {result.kpiTemplate.quantitative.map((kpi, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-800 font-black text-lg shrink-0">
                                                        {kpi.weight}%
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h5 className="font-bold text-slate-900">{kpi.name}</h5>
                                                        <p className="text-sm text-slate-600">{kpi.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Providential */}
                                    <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                        <div className="bg-purple-50 p-6 border-b border-purple-100 flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Icon name="Sparkles" size={24}/></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-purple-900 font-serif">섭리 지표 (Providential)</h4>
                                                <p className="text-sm text-purple-700">섭리적 요청에 따른 사역 성과</p>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {result.kpiTemplate.providential.map((kpi, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-800 font-black text-lg shrink-0">
                                                        {kpi.weight}%
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h5 className="font-bold text-slate-900">{kpi.name}</h5>
                                                        <p className="text-sm text-slate-600">{kpi.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Growth */}
                                    <div className="bg-white rounded-3xl border border-stone-200 shadow-lg overflow-hidden">
                                        <div className="bg-green-50 p-6 border-b border-green-100 flex items-center gap-3">
                                            <div className="p-2 bg-green-100 text-green-700 rounded-lg"><Icon name="TrendingUp" size={24}/></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-green-900 font-serif">역량/성장 지표 (Growth)</h4>
                                                <p className="text-sm text-green-700">자기 계발과 역량 성장</p>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {result.kpiTemplate.growth.map((kpi, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-800 font-black text-lg shrink-0">
                                                        {kpi.weight}%
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h5 className="font-bold text-slate-900">{kpi.name}</h5>
                                                        <p className="text-sm text-slate-600">{kpi.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Evaluation Tip */}
                                    <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200">
                                        <h4 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
                                            <Icon name="Lightbulb" className="text-amber-600"/> 평가 시 유의사항
                                        </h4>
                                        <p className="text-slate-700 leading-relaxed">{result.kpiTemplate.evaluationTip}</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Career Roadmap */}
                        {result.careerRoadmap && (
                            <section>
                                <h3 className="text-3xl font-bold text-blue-900 mb-8 font-serif flex items-center gap-3">
                                    <Icon name="Route" className="text-indigo-600"/> 
                                    생애주기 성장 로드맵 (Career Roadmap)
                                </h3>
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-200 hidden lg:block"></div>
                                    <div className="space-y-8">
                                        {result.careerRoadmap.stages.map((stage, idx) => {
                                            const stageColors = [
                                                'border-emerald-200 bg-emerald-50',
                                                'border-blue-200 bg-blue-50',
                                                'border-amber-200 bg-amber-50',
                                                'border-purple-200 bg-purple-50'
                                            ];
                                            const dotColors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500'];
                                            const iconNames: Array<'Sprout' | 'TrendingUp' | 'Crown' | 'Star'> = ['Sprout', 'TrendingUp', 'Crown', 'Star'];
                                            return (
                                                <div key={idx} className="relative lg:pl-20">
                                                    {/* Timeline dot */}
                                                    <div className={`absolute left-6 w-5 h-5 rounded-full ${dotColors[idx]} border-4 border-white shadow-md hidden lg:block`} style={{top: '2rem'}}></div>
                                                    <div className={`rounded-3xl border-2 ${stageColors[idx]} shadow-lg overflow-hidden`}>
                                                        <div className="p-8">
                                                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                                                <div className={`w-12 h-12 ${dotColors[idx]} rounded-xl flex items-center justify-center text-white`}>
                                                                    <Icon name={iconNames[idx]} size={24}/>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-2xl font-bold text-slate-900 font-serif">{stage.stage} ({stage.period})</h4>
                                                                    <p className="text-slate-600 font-medium">{stage.focus}</p>
                                                                </div>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-6">
                                                                <div>
                                                                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                                        <Icon name="ListChecks" size={16}/> 핵심 과업
                                                                    </h5>
                                                                    <ul className="space-y-2">
                                                                        {stage.tasks.map((task, i) => (
                                                                            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                                                                <Icon name="Check" size={14} className="text-emerald-500 mt-0.5 shrink-0"/>
                                                                                <span>{task}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="bg-white/50 p-4 rounded-xl border border-stone-200">
                                                                    <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm">
                                                                        <Icon name="AlertTriangle" size={14}/> 이 시기의 리스크
                                                                    </h5>
                                                                    <p className="text-slate-700 text-sm leading-relaxed">{stage.risk}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Retirement Vision */}
                                <div className="mt-8 bg-gradient-to-br from-slate-900 to-indigo-900 p-10 rounded-3xl text-white relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-400/50">
                                            <Icon name="Sunset" size={32} className="text-amber-400"/>
                                        </div>
                                        <h4 className="text-2xl font-bold text-amber-400 mb-4 font-serif">은퇴 후 비전 (Retirement Vision)</h4>
                                        <p className="text-lg text-slate-200 leading-loose font-serif italic">
                                            "{result.careerRoadmap.retirementVision}"
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {tab === 'team' && (
                    <TeamBuilder myArchetype={result} />
                )}

                {tab === 'management' && (() => {
                    const profile = managementProfiles.find(p => p.archetypeId === result.id);
                    if (!profile) return <div className="text-stone-400 text-center py-16">경영학 프로파일 데이터를 준비 중입니다.</div>;
                    return (
                        <div className="space-y-10 fade-in">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white rounded-3xl p-8 md:p-10">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Management Profile</div>
                                <h3 className="text-2xl md:text-3xl font-bold font-serif mb-2">{result.title} — 경영학적 직무 역할 분석</h3>
                                <p className="opacity-80 text-sm md:text-base">Mintzberg · Belbin · Quinn · McClelland 이론 기반 | 기독교 역사 롤모델</p>
                            </div>

                            {/* 4 Theory Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Mintzberg */}
                                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <Icon name="Briefcase" size={20} className="text-blue-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">Mintzberg (1973)</div>
                                            <div className="font-bold text-slate-900">관리자 역할 이론</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {profile.mintzberg.roles.map(r => (
                                            <span key={r} className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">{r}</span>
                                        ))}
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed">{profile.mintzberg.description}</p>
                                </div>

                                {/* Belbin */}
                                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                            <Icon name="Users" size={20} className="text-purple-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">Belbin (1981)</div>
                                            <div className="font-bold text-slate-900">팀 역할 이론</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {profile.belbin.roles.map(r => (
                                            <span key={r} className="bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-100">{r}</span>
                                        ))}
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed">{profile.belbin.description}</p>
                                </div>

                                {/* Quinn */}
                                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <Icon name="Compass" size={20} className="text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">Quinn CVF (1988)</div>
                                            <div className="font-bold text-slate-900">경쟁가치 리더십</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {profile.quinn.roles.map(r => (
                                            <span key={r} className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">{r}</span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-emerald-600 font-semibold mb-2">{profile.quinn.quadrant}</div>
                                    <p className="text-stone-600 text-sm leading-relaxed">{profile.quinn.description}</p>
                                </div>

                                {/* McClelland */}
                                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                            <Icon name="Flame" size={20} className="text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">McClelland (1961)</div>
                                            <div className="font-bold text-slate-900">동기 욕구 이론</div>
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 mb-3">
                                        <span className="text-amber-800 text-sm font-bold">{profile.mcclelland.dominantNeed}</span>
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed">{profile.mcclelland.description}</p>
                                </div>
                            </div>

                            {/* Historical Role Model */}
                            <div className="bg-gradient-to-br from-stone-50 to-amber-50 border border-amber-200 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <Icon name="BookMarked" size={24} className="text-amber-700" />
                                    <h4 className="text-xl font-bold text-slate-900 font-serif">기독교 역사 롤모델</h4>
                                </div>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3">
                                        <div className="text-2xl font-bold text-slate-900 font-serif mb-1">{profile.historicalModel.name}</div>
                                        <div className="text-sm text-stone-500 font-medium">{profile.historicalModel.period}</div>
                                    </div>
                                    <div className="md:w-2/3 space-y-3">
                                        <p className="text-slate-700 leading-relaxed">{profile.historicalModel.description}</p>
                                        <div className="bg-white border border-amber-100 rounded-xl p-4">
                                            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">이론과의 연결</div>
                                            <p className="text-stone-600 text-sm leading-relaxed">{profile.historicalModel.connection}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {tab === 'education' && result && (() => {
                    const edu = educationContent.find(e => e.archetypeId === result.id);
                    if (!edu) return <div className="p-8 text-stone-400">교육 데이터를 불러올 수 없습니다.</div>;
                    return (
                        <div className="space-y-10 px-2">
                            {/* Core Competencies */}
                            <section className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
                                    <Icon name="Target" className="text-blue-600"/> 핵심 역량 개발 목표
                                </h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {edu.coreCompetencies.map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">{i+1}</div>
                                            <span className="font-bold text-slate-800">{c}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* HR Placement Guide (compact) */}
                            {result.deploymentFit?.hrPlacementGuide && (
                                <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-8">
                                    <h3 className="text-2xl font-bold text-emerald-900 mb-6 font-serif flex items-center gap-3">
                                        <Icon name="TrendingUp" className="text-emerald-600"/> 단계별 인사 배치 가이드
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                            <p className="text-sm font-bold text-emerald-700 mb-1">단기 (1~3년)</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.hrPlacementGuide.shortTerm}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                            <p className="text-sm font-bold text-emerald-700 mb-1">중기 (4~7년)</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.hrPlacementGuide.midTerm}</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-teal-200">
                                            <p className="text-sm font-bold text-teal-700 mb-1">장기 (8년 이상)</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.hrPlacementGuide.longTerm}</p>
                                        </div>
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                            <p className="text-sm font-bold text-amber-700 mb-1">인사 주의사항</p>
                                            <p className="text-slate-700 text-sm leading-relaxed">{result.deploymentFit.hrPlacementGuide.watchOut}</p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Recommended Books */}
                            <section className="bg-white rounded-3xl border border-stone-200 shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
                                    <Icon name="Library" className="text-indigo-600"/> 추천 도서
                                </h3>
                                <div className="space-y-4">
                                    {edu.books.map((b, i) => (
                                        <div key={i} className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100">
                                            <div className="w-10 h-14 bg-blue-900 rounded text-white flex items-center justify-center text-lg font-black shrink-0">{i+1}</div>
                                            <div>
                                                <p className="font-bold text-slate-900">{b.title}</p>
                                                <p className="text-sm text-stone-500 mb-1">{b.author}</p>
                                                <p className="text-sm text-slate-600 leading-relaxed">{b.reason}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Spiritual Discipline + Warning */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <section className="bg-rose-50 rounded-3xl border border-rose-200 p-8">
                                    <h3 className="text-xl font-bold text-rose-900 mb-4 font-serif flex items-center gap-2">
                                        <Icon name="Sunrise" className="text-rose-600"/> 영성 훈련
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed">{edu.spiritualDiscipline}</p>
                                </section>
                                <section className="bg-stone-50 rounded-3xl border border-stone-200 p-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif flex items-center gap-2">
                                        <Icon name="AlertTriangle" className="text-amber-600"/> 번아웃 경고 신호
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed mb-3">{edu.warningSign}</p>
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="text-xs font-bold text-green-700 mb-1">회복 방법</p>
                                        <p className="text-slate-700 text-sm">{edu.recoveryTip}</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};
