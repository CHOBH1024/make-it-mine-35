import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { SectionTitle } from '@/components/diagnosis/SectionTitle';
import { externalTests, detailData, archetypes } from '@/lib/data';
import { Inputs, Big5Level, EQTrait, Archetype } from '@/lib/types';

interface DiagnosisViewProps {
    inputs: Inputs;
    setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
    onFinish: (inputs?: Inputs) => void;
}

interface DiagnosisModalProps {
    type: 'enneagram' | 'big5' | 'anchor' | 'via' | 'eq';
    inputs: Inputs;
    setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
    onClose: () => void;
}

// Progress Bar Component
const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-stone-200 rounded-full h-2.5 mb-8 overflow-hidden">
        <div 
            className="bg-blue-900 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
        ></div>
        <div className="flex justify-between text-sm text-stone-500 mt-2 font-bold px-1">
            <span>진단 시작</span>
            <span>{Math.round(progress)}% 완료</span>
        </div>
    </div>
);

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({ type, inputs, setInputs, onClose }) => {
    const isBig5 = type === 'big5';
    const isVia = type === 'via';
    const isEQ = type === 'eq';

    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const viaList = detailData.via.list || [];
    const eqData = detailData.eq || {};

    const handleBig5Change = (trait: string, value: Big5Level) => {
        setInputs(prev => ({
            ...prev,
            big5: { ...prev.big5, [trait]: value }
        }));
    };

    const handleEQChange = (trait: EQTrait, value: Big5Level) => {
        setInputs(prev => ({
            ...prev,
            eq: { ...prev.eq, [trait]: value }
        }));
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col animate-[scaleUp_0.3s_ease-out]">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-8 py-6 border-b border-stone-100 flex justify-between items-center">
                    <h3 className="text-2xl font-serif font-bold text-blue-900 capitalize flex items-center gap-3">
                        <Icon name={isBig5 ? "Brain" : isVia ? "Sparkles" : isEQ ? "Heart" : type === 'enneagram' ? "Fingerprint" : "Anchor"} className="text-amber-600" />
                        {isBig5 ? "Big 5 성격 프로파일링" : isVia ? "VIA 강점 선택 (5개)" : isEQ ? "EQ 감성지능 프로파일링" : type === 'enneagram' ? "에니어그램 유형 선택" : "커리어 앵커 선택"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-blue-900 transition-colors">
                        <Icon name="X" size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 md:p-10">
                    {isBig5 ? (
                        <div className="space-y-8">
                            <div className="bg-blue-50 p-4 rounded-lg text-base text-blue-800 mb-6 flex gap-3">
                                <Icon name="Zap" size={20} className="shrink-0"/>
                                <div>
                                    <span className="font-bold block mb-1">진단 팁</span>
                                    자신의 평소 모습과 가장 가까운 태도를 선택해주세요. 옳고 그름은 없습니다.
                                </div>
                            </div>
                            {Object.entries(detailData.big5).map(([key, info]) => (
                                <div key={key} className="bg-stone-50 p-6 rounded-xl border border-stone-200 hover:border-blue-200 transition-colors">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 font-serif">{info.name}</h4>
                                            <p className="text-sm text-stone-500 mt-1">{info.desc}</p>
                                        </div>
                                        <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-sm shrink-0">
                                            {(['Low', 'Mid', 'High'] as Big5Level[]).map(level => (
                                                <button 
                                                    key={level} 
                                                    onClick={() => handleBig5Change(key, level)}
                                                    className={`px-5 py-2 rounded-md text-base font-bold transition-all ${
                                                        inputs.big5[key] === level 
                                                            ? (level==='High'?'bg-blue-900 text-white shadow':level==='Low'?'bg-stone-500 text-white shadow':'bg-stone-400 text-white shadow') 
                                                            : 'text-stone-500 hover:bg-stone-100'
                                                    }`}
                                                >
                                                    {level === 'High' ? '높음' : level === 'Mid' ? '보통' : '낮음'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                        <div className={`p-3 rounded transition-colors ${inputs.big5[key] === 'High' ? 'bg-blue-100 text-blue-900 ring-1 ring-blue-300' : 'bg-white text-stone-400 border border-stone-100'}`}>
                                            <span className="font-bold mr-1">High:</span> {info.high}
                                        </div>
                                        <div className={`p-3 rounded transition-colors ${inputs.big5[key] === 'Low' ? 'bg-stone-200 text-stone-800 ring-1 ring-stone-400' : 'bg-white text-stone-400 border border-stone-100'}`}>
                                            <span className="font-bold mr-1">Low:</span> {info.low}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isVia ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-base font-bold text-stone-500">
                                    선택됨: <span className="text-blue-900 text-xl">{inputs.via.length}</span> / 5
                                </span>
                                {inputs.via.length === 5 && <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">선택 완료</span>}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {viaList.map(v => {
                                    const isSelected = inputs.via.includes(v);
                                    const isDisabled = !isSelected && inputs.via.length >= 5;
                                    return (
                                        <button 
                                            key={v} 
                                            disabled={isDisabled}
                                            onClick={() => {
                                                const newVia = isSelected 
                                                    ? inputs.via.filter(i => i !== v) 
                                                    : inputs.via.length < 5 ? [...inputs.via, v] : inputs.via;
                                                setInputs({...inputs, via: newVia});
                                            }} 
                                            className={`px-3 py-3 rounded-lg text-base font-bold transition-all border ${
                                                isSelected 
                                                    ? 'bg-amber-600 border-amber-600 text-white shadow-md transform scale-105' 
                                                    : isDisabled
                                                        ? 'bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed'
                                                        : 'bg-white border-stone-200 text-slate-600 hover:bg-blue-50 hover:border-blue-200'
                                            }`}
                                        >
                                            {v}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : isEQ ? (
                        <div className="space-y-8">
                            <div className="bg-rose-50 p-4 rounded-lg text-base text-rose-800 mb-6 flex gap-3">
                                <Icon name="Heart" size={20} className="shrink-0 mt-0.5"/>
                                <div>
                                    <span className="font-bold block mb-1">EQ 진단 팁</span>
                                    사역 현장에서 자신의 평소 모습을 기준으로 선택하십시오. 이상적인 모습이 아닌 실제 모습을 선택해야 정확한 진단이 됩니다.
                                </div>
                            </div>
                            {Object.entries(eqData).map(([key, info]) => (
                                <div key={key} className="bg-stone-50 p-6 rounded-xl border border-stone-200 hover:border-rose-200 transition-colors">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 font-serif">{info.name}</h4>
                                            <p className="text-sm text-stone-500 mt-1">{info.desc}</p>
                                        </div>
                                        <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-sm shrink-0">
                                            {(['Low', 'Mid', 'High'] as Big5Level[]).map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => handleEQChange(key as EQTrait, level)}
                                                    className={`px-5 py-2 rounded-md text-base font-bold transition-all ${
                                                        inputs.eq[key as EQTrait] === level
                                                            ? (level === 'High' ? 'bg-rose-700 text-white shadow' : level === 'Low' ? 'bg-stone-500 text-white shadow' : 'bg-stone-400 text-white shadow')
                                                            : 'text-stone-500 hover:bg-stone-100'
                                                    }`}
                                                >
                                                    {level === 'High' ? '높음' : level === 'Mid' ? '보통' : '낮음'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                        <div className={`p-3 rounded transition-colors ${inputs.eq[key as EQTrait] === 'High' ? 'bg-rose-100 text-rose-900 ring-1 ring-rose-300' : 'bg-white text-stone-400 border border-stone-100'}`}>
                                            <span className="font-bold mr-1">High:</span> {info.high}
                                        </div>
                                        <div className={`p-3 rounded transition-colors ${inputs.eq[key as EQTrait] === 'Low' ? 'bg-stone-200 text-stone-800 ring-1 ring-stone-400' : 'bg-white text-stone-400 border border-stone-100'}`}>
                                            <span className="font-bold mr-1">Low:</span> {info.low}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {Object.entries(type === 'enneagram' ? detailData.enneagram : detailData.anchor).map(([k, v]) => (
                                <button 
                                    key={k} 
                                    onClick={() => { setInputs({...inputs, [type]: k}); onClose(); }} 
                                    className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                                        inputs[type as 'enneagram'|'anchor'] === k 
                                            ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900' 
                                            : 'border-stone-100 hover:border-blue-200 hover:bg-stone-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`block text-xl font-bold font-serif ${inputs[type as 'enneagram'|'anchor'] === k ? 'text-blue-900' : 'text-slate-900'}`}>
                                            {v.label}
                                        </span>
                                        {inputs[type as 'enneagram'|'anchor'] === k && <Icon name="Check" className="text-blue-900" size={20}/>}
                                    </div>
                                    <span className="text-base text-slate-600">{v.desc}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur px-8 py-6 border-t border-stone-100">
                     <button 
                        onClick={onClose}
                        className="w-full py-4 bg-blue-900 text-white text-lg font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-lg active:scale-[0.99]"
                    >
                        {isBig5 ? "입력 완료" : isVia ? `선택 완료 (${inputs.via.length}/5)` : isEQ ? `EQ 입력 완료` : "닫기"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ inputs, setInputs, onFinish }) => {
    const [activeModal, setActiveModal] = useState<'enneagram' | 'big5' | 'anchor' | 'via' | 'eq' | null>(null);

    // Calculate Progress
    const isEnneagramDone = !!inputs.enneagram;
    const big5Count = Object.values(inputs.big5).filter(v => v !== '').length;
    const isBig5Done = big5Count === 5;
    const isAnchorDone = !!inputs.anchor;
    const isViaDone = inputs.via.length === 5;
    const eqCount = Object.values(inputs.eq).filter(v => v !== '').length;
    const isEQDone = eqCount === 5;

    const progress = useMemo(() => {
        let count = 0;
        if (isEnneagramDone) count += 1;
        if (isAnchorDone) count += 1;
        if (isViaDone) count += 1;
        count += (big5Count / 5); // Big5 counts as 1 total point
        count += (eqCount / 5);   // EQ counts as 1 total point
        return (count / 5) * 100;
    }, [inputs]);

    const isReady = isEnneagramDone && isBig5Done && isAnchorDone && isViaDone && isEQDone;

    const renderCard = (
        type: 'enneagram' | 'big5' | 'anchor' | 'via' | 'eq',
        title: string,
        subtitle: string,
        icon: string,
        colorClass: string,
        isDone: boolean,
        valuePreview?: React.ReactNode
    ) => (
        <div 
            onClick={() => setActiveModal(type as 'enneagram' | 'big5' | 'anchor' | 'via' | 'eq')}
            className={`
                group relative p-6 bg-white border-2 rounded-2xl cursor-pointer transition-all duration-300
                ${isDone 
                    ? 'border-blue-900 shadow-md ring-1 ring-blue-900/10' 
                    : 'border-stone-200 hover:border-amber-400 hover:shadow-lg'
                }
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                        ${isDone ? 'bg-blue-900 text-white' : `bg-stone-100 ${colorClass}`}
                    `}>
                        <Icon name={icon} size={24}/>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-0.5">{subtitle}</p>
                        <p className={`text-xl font-bold font-serif ${isDone ? 'text-blue-900' : 'text-slate-900'}`}>
                            {title}
                        </p>
                    </div>
                </div>
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all
                    ${isDone ? 'bg-blue-100 text-blue-900' : 'text-stone-300 group-hover:text-amber-500'}
                `}>
                    <Icon name={isDone ? "Check" : "ChevronRight"} size={20}/>
                </div>
            </div>
            
            {/* Value Preview Section */}
            <div className="pl-16 min-h-[1.5rem]">
                {isDone ? (
                    <div className="text-base font-medium text-slate-700 animate-[fadeIn_0.5s_ease-out]">
                        {valuePreview}
                    </div>
                ) : (
                    <span className="text-sm text-stone-400">선택되지 않음</span>
                )}
            </div>
        </div>
    );

    const handleManualSelect = (archetype: Archetype) => {
        // Construct synthetic inputs based on the archetype's traits to create a perfect match
        const syntheticInputs: Inputs = {
            enneagram: archetype.traits.enneagram[0],
            anchor: archetype.traits.anchor[0],
            big5: {
                openness: 'Mid',
                conscientiousness: 'Mid',
                extraversion: 'Mid',
                agreeableness: 'Mid',
                neuroticism: 'Mid',
                [archetype.traits.big5]: 'High'
            },
            via: archetype.traits.via.slice(0, 5),
            eq: { awareness: 'Mid', regulation: 'Mid', motivation: 'Mid', empathy: 'Mid', social: 'Mid' }
        };

        setInputs(syntheticInputs);
        onFinish(syntheticInputs);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-16 fade-in">
            <SectionTitle title="성향 프로파일링" subtitle="당신의 내면을 있는 그대로 비추어 주십시오." />
            
            {/* External Links Box */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Icon name="ExternalLink" size={16}/> 
                        무료 진단 링크 (참고용)
                    </h3>
                    <span className="text-sm text-stone-500 bg-stone-100 px-2 py-1 rounded">
                        *이미 진단 결과가 있다면 바로 아래에 입력하세요.
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {externalTests.map(t => (
                        <a key={t.id} href={t.url} target="_blank" rel="noopener noreferrer" 
                           className={`px-3 py-1.5 border rounded-lg text-sm font-bold flex items-center gap-2 transition-colors hover:bg-stone-50 ${t.color.replace('text', 'border')}`}>
                            <Icon name={t.icon} size={12}/> {t.name}
                        </a>
                    ))}
                </div>
            </div>

            <ProgressBar progress={progress} />

            <div className="space-y-4">
                {renderCard(
                    'enneagram', 
                    "에니어그램 (Enneagram)", 
                    "Motivation", 
                    "Fingerprint", 
                    "text-purple-600",
                    isEnneagramDone,
                    <span className="bg-purple-50 text-purple-900 px-2 py-1 rounded-md text-sm font-bold border border-purple-100">
                        {inputs.enneagram ? detailData.enneagram[inputs.enneagram]?.label?.split(':')[0] : ''}
                    </span>
                )}

                {renderCard(
                    'big5', 
                    "Big 5 성격검사", 
                    "Personality", 
                    "Brain", 
                    "text-green-600",
                    isBig5Done,
                    <div className="flex gap-1">
                        {Object.entries(inputs.big5).map(([k, v]) => (
                            <span key={k} title={k} className={`w-2 h-2 rounded-full ${v === 'High' ? 'bg-green-500' : v === 'Mid' ? 'bg-green-200' : 'bg-stone-200'}`}></span>
                        ))}
                        <span className="ml-2 text-sm text-green-700">{big5Count}/5 입력됨</span>
                    </div>
                )}

                {renderCard(
                    'anchor', 
                    "커리어 앵커 (Value)", 
                    "Core Value", 
                    "Anchor", 
                    "text-blue-600",
                    isAnchorDone,
                    <span className="bg-blue-50 text-blue-900 px-2 py-1 rounded-md text-sm font-bold border border-blue-100">
                        {inputs.anchor ? detailData.anchor[inputs.anchor]?.label : ''}
                    </span>
                )}

                {renderCard(
                    'via',
                    "VIA 대표 강점 (5개)",
                    "Signature Strength",
                    "Sparkles",
                    "text-amber-600",
                    isViaDone,
                    <div className="flex flex-wrap gap-1">
                        {inputs.via.map(v => (
                            <span key={v} className="text-xs bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-100 font-bold">
                                {v}
                            </span>
                        ))}
                    </div>
                )}

                {renderCard(
                    'eq',
                    "EQ 감성지능 (Goleman)",
                    "Emotional Intelligence",
                    "Heart",
                    "text-rose-600",
                    isEQDone,
                    <div className="flex gap-1 items-center">
                        {Object.entries(inputs.eq).map(([k, v]) => (
                            <span key={k} title={k} className={`w-2 h-2 rounded-full ${v === 'High' ? 'bg-rose-500' : v === 'Mid' ? 'bg-rose-200' : 'bg-stone-200'}`}></span>
                        ))}
                        <span className="ml-2 text-sm text-rose-700">{eqCount}/5 입력됨</span>
                    </div>
                )}
            </div>

            <div className="mt-12 text-center">
                <button 
                    onClick={() => onFinish()} 
                    disabled={!isReady} 
                    className={`
                        px-16 py-6 rounded-xl text-xl font-bold font-serif shadow-xl transition-all duration-300
                        ${isReady 
                            ? 'bg-blue-900 text-white hover:bg-blue-800 transform hover:-translate-y-1 hover:shadow-2xl' 
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed grayscale'
                        }
                    `}
                >
                    <span className="flex items-center gap-3">
                        소명 아키타입 분석하기
                        {isReady && <Icon name="ArrowRight" />}
                    </span>
                </button>
                {!isReady && (
                    <p className="text-base text-stone-400 mt-4 animate-pulse">
                        * 모든 항목을 입력해야 분석이 가능합니다. ({Math.round(progress)}%)
                    </p>
                )}
            </div>

            {/* Quick Select Section */}
            <div className="mt-20 pt-12 border-t border-stone-200">
                <div className="text-center mb-8">
                    <span className="bg-stone-100 text-stone-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Quick Select</span>
                    <h4 className="text-xl font-bold text-slate-700 font-serif">
                        이미 자신의 유형을 알고 계신가요?
                    </h4>
                    <p className="text-stone-500 text-base mt-2 max-w-lg mx-auto">
                        진단 과정을 건너뛰고 특정 유형의 분석 결과를 바로 확인할 수 있습니다.<br/>
                        아래에서 해당 유형을 선택해주세요.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
                    {archetypes.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => handleManualSelect(t)}
                            className="flex flex-col items-center p-4 rounded-2xl border-2 border-stone-100 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all group h-full"
                        >
                            <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-blue-900 group-hover:text-white mb-3 transition-colors shadow-sm">
                                <Icon name={t.symbol} size={20}/>
                            </div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Type {t.id}</span>
                            <span className="text-xs font-bold text-slate-700 w-full text-center group-hover:text-blue-900 leading-snug break-keep">{t.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {activeModal && (
                <DiagnosisModal 
                    type={activeModal} 
                    inputs={inputs} 
                    setInputs={setInputs} 
                    onClose={() => setActiveModal(null)} 
                />
            )}
            
            <style>{`
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};