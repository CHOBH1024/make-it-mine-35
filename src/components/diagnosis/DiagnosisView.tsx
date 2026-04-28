import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { SectionTitle } from '@/components/diagnosis/SectionTitle';
import { externalTests, detailData, archetypes } from '@/lib/data';
import { Inputs, Big5Level, EQTrait, Archetype } from '@/lib/types';

interface DiagnosisViewProps {
    inputs: Inputs;
    setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
    onFinish: (inputs?: Inputs) => void;
    allProfiles: Inputs[];
    activeProfile: number;
    onSwitchProfile: (idx: number) => void;
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

const EQ_QUESTIONS: Record<string, string[]> = {
    awareness: [
        "힘든 심방을 마친 직후 내 감정 상태가 어떤지 즉시 알아차린다",
        "사역 중 화가 날 때 그 원인이 무엇인지 정확히 파악한다",
        "내 감정이 식구들을 대하는 방식에 어떤 영향을 미치는지 인식한다",
        "나의 사역적 강점과 약점을 객관적으로 파악하고 있다",
        "나의 내면 상태(지침·불안·기쁨 등)를 다른 사람에게 솔직하게 표현할 수 있다",
    ],
    regulation: [
        "식구가 무례하게 대할 때 즉각 반응하지 않고 감정을 먼저 다스린다",
        "예상치 못한 사역 변화가 생겨도 침착하게 대처한다",
        "회의 중 날카로운 비판을 받아도 방어적이 되지 않고 경청한다",
        "부정적인 감정이 다음 사역에까지 이어지지 않도록 전환할 수 있다",
        "충동적으로 결정을 내리기보다 감정이 가라앉은 후 판단한다",
    ],
    motivation: [
        "외부 보상이나 인정이 없어도 사역에 열정을 유지한다",
        "어려운 목표를 스스로 설정하고 끝까지 추구한다",
        "실패하거나 비판을 받아도 사명감으로 다시 일어난다",
        "사역이 힘들어도 '왜 이 일을 하는가'를 스스로 되새기며 동기를 유지한다",
        "단기 성과보다 장기적인 섭리적 목표를 더 중요하게 여긴다",
    ],
    empathy: [
        "식구의 말투나 표정에서 말하지 않은 감정 상태를 읽어낸다",
        "상담 중 상대방이 무엇을 필요로 하는지 직감적으로 안다",
        "나와 다른 가치관이나 배경을 가진 식구의 입장도 충분히 이해할 수 있다",
        "힘든 식구를 만날 때 해결책보다 먼저 공감을 표현한다",
        "타인의 감정에 영향을 받는 편이며 그들의 아픔이 나의 아픔으로 느껴진다",
    ],
    social: [
        "갈등 상황에서 양쪽이 모두 수긍할 수 있는 해결책을 찾아낸다",
        "처음 만나는 사람과도 짧은 시간 안에 신뢰 관계를 형성한다",
        "팀 내 분위기가 가라앉아 있을 때 자연스럽게 분위기를 끌어올린다",
        "다양한 성격의 사람들로 구성된 팀에서도 협업을 원활하게 이끈다",
        "설득이 필요한 상황에서 논리보다 관계와 신뢰를 먼저 활용한다",
    ],
};

const ENNEAGRAM_KEYWORDS: Record<string, string> = {
    '1': '원칙·완벽', '2': '돌봄·관계', '3': '성취·인정',
    '4': '정체성·독창', '5': '지식·독립', '6': '충성·안전',
    '7': '자유·즐거움', '8': '힘·도전', '9': '평화·화합',
};

const ANCHOR_HINTS: Record<string, string> = {
    managerial: "조직 전체를 이끌고 책임질 때 가장 보람을 느낀다",
    expert: "특정 분야의 깊은 전문성을 쌓고 인정받을 때 보람을 느낀다",
    autonomy: "내 방식대로 자율적으로 사역할 수 있을 때 최선을 발휘한다",
    security: "안정적인 환경과 예측 가능한 미래가 보장될 때 헌신한다",
    entrepreneurial: "새로운 것을 만들고 창조적 도전을 할 때 살아있음을 느낀다",
    service: "타인을 돕고 세상에 의미 있는 기여를 할 때 보람을 느낀다",
    challenge: "불가능해 보이는 문제를 해결하는 도전 자체에서 에너지를 얻는다",
    lifestyle: "사역·가정·개인 삶의 균형이 유지될 때 지속적으로 헌신할 수 있다",
};

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
    const [viaSearch, setViaSearch] = useState('');
    const [eqAnswers, setEqAnswers] = useState<Record<string, number[]>>({
        awareness: [0,0,0,0,0], regulation: [0,0,0,0,0], motivation: [0,0,0,0,0],
        empathy: [0,0,0,0,0], social: [0,0,0,0,0],
    });

    const calcEQLevel = (answers: number[]): Big5Level | '' => {
        if (answers.some(a => a === 0)) return '';
        const sum = answers.reduce((a, b) => a + b, 0);
        return sum >= 13 ? 'High' : sum >= 8 ? 'Mid' : 'Low';
    };

    useEffect(() => {
        if (!isEQ) return;
        setInputs(prev => {
            const newEq = { ...prev.eq };
            (Object.keys(eqAnswers) as EQTrait[]).forEach(trait => {
                const lvl = calcEQLevel(eqAnswers[trait]);
                if (lvl) newEq[trait] = lvl;
            });
            return { ...prev, eq: newEq };
        });
    }, [eqAnswers]);

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
                                    <span className="font-bold block mb-1">결과 해석 방법 (bigfive-test.com 기준)</span>
                                    각 특성의 백분위 점수를 아래 기준으로 변환하여 선택하세요.
                                    <div className="flex gap-3 mt-2 flex-wrap">
                                        <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-sm font-bold">60% 이상 → 높음</span>
                                        <span className="bg-stone-400 text-white px-2 py-0.5 rounded text-sm font-bold">40~60% → 보통</span>
                                        <span className="bg-stone-600 text-white px-2 py-0.5 rounded text-sm font-bold">40% 미만 → 낮음</span>
                                    </div>
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
                            <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-800 flex gap-2 mb-2">
                                <Icon name="Sparkles" size={16} className="shrink-0 mt-0.5"/>
                                <span><span className="font-bold">결과 해석:</span> viacharacter.org 검사 결과 상위 5개 강점을 아래에서 찾아 선택하세요.</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <input
                                    type="text"
                                    placeholder="강점 검색..."
                                    value={viaSearch}
                                    onChange={e => setViaSearch(e.target.value)}
                                    className="flex-grow px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                                />
                                <span className="text-base font-bold text-stone-500 shrink-0">
                                    <span className="text-blue-900 text-xl">{inputs.via.length}</span> / 5
                                    {inputs.via.length === 5 && <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded ml-2">완료</span>}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {viaList.filter(v => v.includes(viaSearch)).map(v => {
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
                            {/* 진행도 */}
                            {(() => {
                                const totalAnswered = Object.values(eqAnswers).flat().filter(a => a > 0).length;
                                return (
                                    <div>
                                        <div className="flex justify-between text-sm font-bold mb-1">
                                            <span className="text-rose-700">진행도</span>
                                            <span className="text-rose-900">{totalAnswered} / 25 문항</span>
                                        </div>
                                        <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-600 rounded-full transition-all duration-300" style={{width: `${(totalAnswered/25)*100}%`}}/>
                                        </div>
                                    </div>
                                );
                            })()}
                            <div className="bg-rose-50 p-4 rounded-lg text-sm text-rose-800 flex gap-2">
                                <Icon name="Heart" size={16} className="shrink-0 mt-0.5"/>
                                <span>사역 현장에서 <span className="font-bold">실제 내 모습</span>을 기준으로 답하세요. 이상적인 모습이 아닌 평소 행동 패턴을 선택해야 정확한 진단이 됩니다.</span>
                            </div>
                            {Object.entries(eqData).map(([key, info]) => {
                                const questions = EQ_QUESTIONS[key] || [];
                                const answers = eqAnswers[key] || [];
                                const level = calcEQLevel(answers);
                                const dimDone = answers.every(a => a > 0);
                                return (
                                    <div key={key} className={`rounded-2xl border-2 overflow-hidden transition-all ${dimDone ? 'border-rose-300 shadow-md' : 'border-stone-200'}`}>
                                        <div className={`px-6 py-4 flex items-center justify-between ${dimDone ? 'bg-rose-50' : 'bg-stone-50'}`}>
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900 font-serif">{info.name}</h4>
                                                <p className="text-xs text-stone-500 mt-0.5">{info.desc}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-black shrink-0 ${
                                                !level ? 'bg-stone-200 text-stone-500' :
                                                level === 'High' ? 'bg-rose-600 text-white' :
                                                level === 'Mid' ? 'bg-amber-500 text-white' : 'bg-stone-500 text-white'
                                            }`}>
                                                {!level ? '미완료' : level === 'High' ? '높음' : level === 'Mid' ? '보통' : '낮음'}
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {questions.map((q, qi) => (
                                                <div key={qi} className={`p-4 rounded-xl border ${answers[qi] > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-stone-100'}`}>
                                                    <p className="text-sm text-slate-700 mb-3 font-medium leading-relaxed">
                                                        <span className="text-rose-400 font-black mr-1">Q{qi+1}.</span> {q}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        {[{score:1,label:'전혀 아니다'},{score:2,label:'보통이다'},{score:3,label:'매우 그렇다'}].map(opt => (
                                                            <button
                                                                key={opt.score}
                                                                onClick={() => {
                                                                    const newA = [...answers]; newA[qi] = opt.score;
                                                                    setEqAnswers(prev => ({...prev, [key]: newA}));
                                                                }}
                                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                                                                    answers[qi] === opt.score
                                                                        ? opt.score === 3 ? 'bg-rose-600 text-white border-rose-600 shadow'
                                                                        : opt.score === 2 ? 'bg-amber-500 text-white border-amber-500 shadow'
                                                                        : 'bg-stone-500 text-white border-stone-500 shadow'
                                                                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                                                                }`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-600 flex gap-2 mb-4">
                                <Icon name="Info" size={16} className="shrink-0 mt-0.5 text-blue-500"/>
                                {type === 'enneagram'
                                    ? "검사 결과 가장 높은 점수의 유형을 선택하세요. 날개(Wing)가 있다면 주 유형 기준으로 선택하세요."
                                    : "점수가 가장 높은 앵커 1개를 선택하세요. 동점이라면 '이것을 잃으면 안 된다'고 느끼는 항목을 선택하세요."}
                            </div>
                            {Object.entries(type === 'enneagram' ? detailData.enneagram : detailData.anchor).map(([k, v]) => (
                                <button
                                    key={k}
                                    onClick={() => { setInputs({...inputs, [type]: k}); onClose(); }}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                                        inputs[type as 'enneagram'|'anchor'] === k
                                            ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900'
                                            : 'border-stone-100 hover:border-blue-200 hover:bg-stone-50'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className={`block text-lg font-bold font-serif ${inputs[type as 'enneagram'|'anchor'] === k ? 'text-blue-900' : 'text-slate-900'}`}>
                                                {v.label}
                                            </span>
                                            {type === 'enneagram' && ENNEAGRAM_KEYWORDS[k] && (
                                                <span className="inline-block mt-1 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{ENNEAGRAM_KEYWORDS[k]}</span>
                                            )}
                                            {type === 'anchor' && ANCHOR_HINTS[k] && (
                                                <span className="block mt-1 text-xs text-stone-500 italic">"{ANCHOR_HINTS[k]}"</span>
                                            )}
                                        </div>
                                        {inputs[type as 'enneagram'|'anchor'] === k && <Icon name="Check" className="text-blue-900 shrink-0" size={20}/>}
                                    </div>
                                    <span className="text-sm text-slate-600 mt-2 block">{v.desc}</span>
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

const PROFILE_LABELS = ['나', '파트너 1', '파트너 2'];

const profileCompletionPct = (p: Inputs): number => {
    let count = 0;
    if (p.enneagram) count += 1;
    if (p.anchor) count += 1;
    if (p.via.length === 5) count += 1;
    count += Object.values(p.big5).filter(v => v !== '').length / 5;
    count += Object.values(p.eq).filter(v => v !== '').length / 5;
    return (count / 5) * 100;
};

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({ inputs, setInputs, onFinish, allProfiles, activeProfile, onSwitchProfile }) => {
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

            {/* 다중 프로필 스위처 */}
            <div className="flex gap-3 mb-8">
                {allProfiles.map((profile, idx) => {
                    const pct = profileCompletionPct(profile);
                    const isDone = pct >= 100;
                    const isActive = activeProfile === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => onSwitchProfile(idx)}
                            className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${
                                isActive
                                    ? 'border-blue-900 bg-blue-50 shadow-md ring-1 ring-blue-900/10'
                                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-stone-500'}`}>
                                    {PROFILE_LABELS[idx]}
                                </span>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                    isDone
                                        ? 'bg-green-100 text-green-700'
                                        : isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-stone-100 text-stone-400'
                                }`}>
                                    {isDone ? '완료' : `${Math.round(pct)}%`}
                                </span>
                            </div>
                            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : 'bg-blue-600'}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </button>
                    );
                })}
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
                        {PROFILE_LABELS[activeProfile]} 소명 아키타입 분석하기
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