
import React, { useState } from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { benefitData, externalTests, archetypes } from '@/lib/data';

interface HomeViewProps {
    onStart: () => void;
}

type HomeTab = 'intro' | 'types' | 'tools' | 'benefits';

export const HomeView: React.FC<HomeViewProps> = ({ onStart }) => {
    const [activeTab, setActiveTab] = useState<HomeTab>('intro');

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 fade-in">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 sticky top-24 z-20 bg-[#fcfbf9]/95 backdrop-blur py-4 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('intro')}
                    className={`px-6 py-3 rounded-full text-lg font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'intro'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg transform scale-105'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-blue-300 hover:text-blue-900'
                    }`}
                >
                    <Icon name="Compass" size={20} /> 소명의 여정 (Intro)
                </button>
                <button
                    onClick={() => setActiveTab('types')}
                    className={`px-6 py-3 rounded-full text-lg font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'types'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg transform scale-105'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-blue-300 hover:text-blue-900'
                    }`}
                >
                    <Icon name="Users" size={20} /> 9가지 목회유형
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`px-6 py-3 rounded-full text-lg font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'tools'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg transform scale-105'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-blue-300 hover:text-blue-900'
                    }`}
                >
                    <Icon name="Dna" size={20} /> 통합 진단 원리
                </button>
                <button
                    onClick={() => setActiveTab('benefits')}
                    className={`px-6 py-3 rounded-full text-lg font-bold transition-all flex items-center gap-2 border-2 ${
                        activeTab === 'benefits'
                            ? 'bg-blue-900 text-white border-blue-900 shadow-lg transform scale-105'
                            : 'bg-white text-stone-500 border-stone-200 hover:border-blue-300 hover:text-blue-900'
                    }`}
                >
                    <Icon name="Sprout" size={20} /> 섭리적 기대효과
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px] animate-[fadeIn_0.5s_ease-out]">
                {activeTab === 'intro' && (
                    <div className="flex flex-col items-center max-w-5xl mx-auto">
                        <div className="inline-flex p-10 rounded-full bg-white border border-stone-200 shadow-xl mb-12 animate-[slideUp_0.5s_ease-out]">
                            <Icon name="Scale" size={100} className="text-blue-900" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-10 font-serif leading-tight text-center">
                            천일국 공직자의 <br/><span className="text-amber-700 italic">그릇을 분별하다</span>
                        </h1>
                        
                        <div className="space-y-12 text-xl text-slate-700 leading-loose text-justify font-serif mb-20 bg-white p-8 md:p-12 rounded-3xl border border-stone-200 shadow-sm">
                            <div>
                                <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                                    <span className="text-5xl text-blue-100 font-black absolute -ml-6 -mt-6 -z-10">01</span>
                                    왜 지금, '공직자 유형 진단'인가?
                                </h3>
                                <p>
                                    천일국 안착시대를 맞이하여 섭리의 패러다임이 근본적으로 변화하고 있습니다. 이제는 <strong>하늘부모님 중심의 새로운 창조의 완성</strong>을 향해 나아가야 할 때입니다. 과거에는 '무조건적인 믿음'과 '나를 지우는 맹목적인 순종'이 미덕이었으나, 이 시대는 하나님께서 창조하신 본연의 모습, 즉 <span className="bg-amber-100 px-2 rounded font-bold text-amber-900 border-b-2 border-amber-200">개성진리체(Individual Truth Body)</span>가 만개하여 <strong>3대 축복의 이상</strong>을 실현하고 하늘부모님께 영광을 돌려야 하는 때입니다.
                                </p>
                            </div>
                            
                            <hr className="border-stone-100"/>

                            <div>
                                <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                                    <span className="text-5xl text-blue-100 font-black absolute -ml-6 -mt-6 -z-10">02</span>
                                    맞지 않는 옷을 입은 고통
                                </h3>
                                <p>
                                    그러나 여전히 현장에서는 많은 공직자들이 자신의 타고난 기질과 맞지 않는 옷을 입고 고군분투하고 있습니다. 치밀한 전략과 행정 능력을 가진 '설계자'가 무작정 거리로 내몰려 전도를 강요받거나, 불같은 열정을 가진 '개척자'가 하루 종일 사무실에 앉아 서류와 씨름하며 영혼이 메말라가고 있습니다. 이는 단순한 업무 비효율의 문제를 넘어, 귀한 공직 인재들을 <span className="underline decoration-red-400 decoration-2 underline-offset-4 font-bold">영적 탈진(Spiritual Burnout)</span>과 정체성의 혼란으로 몰아넣고 있습니다. 다윗에게 사울 왕의 갑옷을 입히면 싸울 수 없습니다. 다윗에게는 물맷돌이, 사울에게는 갑옷이 필요합니다.
                                </p>
                            </div>

                            <hr className="border-stone-100"/>

                            <div>
                                <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                                    <span className="text-5xl text-blue-100 font-black absolute -ml-6 -mt-6 -z-10">03</span>
                                    당신의 '영적 DNA'를 찾는 여정
                                </h3>
                                <p>
                                    본 진단 도구는 이러한 문제를 해결하기 위해 현대 심리학의 검증된 도구들(Enneagram, Big 5, Career Anchor, VIA)을 <strong>통일원리의 인간관(Original Nature)</strong>에 입각하여 재해석하고 융합하였습니다. 이것은 우열을 가리는 평가가 아닙니다. 하나님께서 태초에 당신을 빚으실 때 심어주신 고유한 <strong>'영적 DNA'</strong>를 해독하고, 당신이 섭리의 최전선에서 가장 빛날 수 있는 <strong>'절대 유일의 자리(Unique Position)'</strong>를 찾아가는 나침반입니다. 이제 타인의 기준에 나를 맞추려 애쓰지 마십시오. 당신의 있는 모습 그대로가 섭리에 필요합니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <button onClick={onStart} className="group relative bg-blue-900 text-white px-20 py-8 rounded-3xl text-3xl font-bold font-serif hover:bg-blue-800 transition-all shadow-2xl hover:shadow-blue-900/50 hover:-translate-y-2 overflow-hidden">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="flex items-center gap-4">
                                    소명 아키타입 진단 시작하기 <Icon name="ArrowRight" size={32} />
                                </span>
                            </button>
                            <p className="text-stone-500 font-bold bg-stone-100 px-8 py-3 rounded-full text-lg border border-stone-200">
                                ⏱ 소요 시간: 약 3-5분 | 4가지 심층 진단 도구 통합 분석 | 로그인 불필요
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'types' && (
                    <div>
                        <div className="text-center mb-20 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">9가지 천일국 목회 아키타입 (Archetypes)</h2>
                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed text-justify bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
                                <p>
                                    천일국은 획일적인 벽돌로 지어진 성이 아닙니다. 요한계시록의 새 예루살렘 성이 12가지 보석과 12대문으로 이루어져 있듯, 천일국은 서로 다른 개성과 은사를 가진 공직자들이 조화를 이루는 <strong>유기적인 생명체</strong>입니다. 본 진단은 공직자들의 내면 에너지가 흐르는 중심 센터를 기준으로, 크게 <strong>머리형(Vision), 가슴형(Heart), 장형(Action)</strong>으로 나누고, 이를 다시 세분화하여 총 9가지의 '목회 아키타입'을 도출하였습니다.
                                </p>
                                <p>
                                    이 9가지 유형은 단순히 성격 분류가 아닙니다. 이는 섭리 역사를 이끌어온 중심인물들의 <strong>'영적 원형(Archetype)'</strong>을 상징합니다. 율법으로 이스라엘의 기틀을 닦은 모세(설계자), 십자가 사랑으로 인류를 품은 예수님(부모), 광야에서 외친 세례요한(수호자), 목숨 걸고 이방인에게 나아간 바울(개척자), 그리고 만물을 주관한 요셉(살림꾼) 등. 우리 안에는 이러한 섭리적 영웅들의 DNA가 면면히 흐르고 있습니다. 당신은 어떤 영웅의 심장을 가지고 있습니까?
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {archetypes.map(t => (
                                <div key={t.id} className="bg-white p-10 rounded-[2rem] border border-stone-200 hover:shadow-2xl hover:border-blue-200 transition-all hover:-translate-y-2 group flex flex-col h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-black font-serif z-0 select-none group-hover:opacity-10 transition-opacity">
                                        {t.id}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-900 group-hover:text-white transition-colors shadow-inner">
                                                <Icon name={t.symbol} size={40}/>
                                            </div>
                                            <div>
                                                <span className="text-blue-900 font-bold tracking-widest text-sm uppercase block mb-1">Type {String(t.id).padStart(2,'0')}</span>
                                                <h3 className="text-2xl font-bold text-slate-900 font-serif leading-tight group-hover:text-blue-900 transition-colors">{t.title}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-8">
                                            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-3 pb-3 border-b border-stone-100">{t.engTitle}</p>
                                            <p className="text-slate-600 leading-relaxed text-lg font-serif italic text-justify">
                                                "{t.subtitle}"
                                            </p>
                                        </div>

                                        <p className="text-slate-700 leading-relaxed text-base mb-8 text-justify line-clamp-4 group-hover:line-clamp-none transition-all">
                                            {t.summary}
                                        </p>

                                        <div className="mt-auto bg-stone-50 p-5 rounded-2xl border border-stone-100">
                                            <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Primary Role</span>
                                            <span className="text-blue-900 font-bold text-lg">{t.roles[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-20 bg-gradient-to-br from-blue-900 to-slate-900 p-12 rounded-[3rem] text-center text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6 font-serif">"모든 유형은 하나님 앞에 동등합니다"</h3>
                                <p className="text-xl text-slate-300 leading-loose">
                                    어떤 유형이 더 우월하거나 열등하지 않습니다. 설계자가 없으면 집을 지을 수 없고, 부모가 없으면 자녀가 자랄 수 없으며, 개척자가 없으면 영토를 넓힐 수 없습니다. <br/>
                                    <strong>문제는 '틀림'이 아니라 서로의 '다름'을 이해하지 못하는 무지입니다.</strong> <br/>
                                    이 진단을 통해 나의 자리를 찾고, 타인의 자리를 존중하는 성숙한 천일국 문화를 만들어 갑시다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tools' && (
                    <div>
                        <div className="text-center mb-20 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">영성과 과학의 만남: 4차원 통합 진단</h2>
                            <p className="text-xl text-slate-700 leading-relaxed text-justify bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
                                인간은 단편적인 존재가 아닙니다. 하나의 검사 도구로는 복잡한 인간의 내면을 온전히 설명할 수 없습니다. 본 진단은 공직자의 내면을 입체적이고 전인적으로 조명하기 위해, 전 세계적으로 가장 신뢰받는 4가지 심리 진단 도구를 섭리적 관점에서 재해석하여 융합했습니다. 이는 마치 GPS가 4개의 위성 신호를 받아 정확한 위치를 찾듯, 당신의 <strong>동기(Why), 기질(How), 가치(What), 강점(Strength)</strong>을 다각도로 분석하여 영적 좌표를 정밀하게 탐색합니다.
                            </p>
                        </div>
                        
                        <div className="space-y-16">
                            {externalTests.map((test, index) => (
                                <div key={test.id} className="flex flex-col lg:flex-row gap-10 items-stretch bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-lg hover:shadow-2xl transition-all">
                                    {/* Left: Icon & Title */}
                                    <div className={`lg:w-1/3 rounded-[2rem] flex flex-col items-center justify-center text-center p-10 ${test.color.replace('text-', 'bg-').replace('600', '50')} border-2 ${test.color.replace('text-', 'border-').replace('600', '100')}`}>
                                        <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-md ${test.color}`}>
                                            <Icon name={test.icon} size={48}/>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 font-serif mb-3">{test.name}</h3>
                                        <p className="text-stone-600 font-bold text-lg mb-6">{test.desc}</p>
                                        <div className="mt-auto pt-6 border-t border-black/5 w-full">
                                            <p className="text-sm font-medium opacity-70 italic">"{test.detail}"</p>
                                        </div>
                                    </div>

                                    {/* Right: Detailed Content */}
                                    <div className="lg:w-2/3 space-y-8 py-2">
                                        <div className="group">
                                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3 group-hover:text-blue-900 transition-colors">
                                                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:bg-blue-900 transition-colors">1</span>
                                                과학적 측정 원리 (Measurement)
                                            </h4>
                                            <p className="text-lg text-slate-700 leading-relaxed text-justify bg-stone-50 p-6 rounded-2xl border border-stone-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
                                                {test.measurement}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3 group-hover:text-purple-900 transition-colors">
                                                <span className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center text-sm font-bold shadow-md">2</span>
                                                통일원리적 재해석 (Theological Insight)
                                            </h4>
                                            <p className="text-lg text-slate-700 leading-relaxed text-justify bg-purple-50 p-6 rounded-2xl border border-purple-100 group-hover:bg-purple-50/60 transition-colors">
                                                {test.understanding}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3 group-hover:text-amber-700 transition-colors">
                                                <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:bg-amber-700 transition-colors">3</span>
                                                목회 현장 활용 (Application)
                                            </h4>
                                            <p className="text-lg text-slate-700 leading-relaxed text-justify bg-amber-50 p-6 rounded-2xl border border-amber-100 group-hover:bg-amber-50/60 transition-colors">
                                                {test.utilization}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'benefits' && (
                    <div>
                        <div className="text-center mb-20 max-w-4xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">진단을 통해 변화될 섭리의 미래</h2>
                            <p className="text-xl text-slate-700 leading-relaxed text-justify bg-white p-10 rounded-3xl border border-stone-200 shadow-sm">
                                "지피지기면 백전불태(知彼知己 百戰不殆)"라 했습니다. 나를 알고 섭리를 알면 위태롭지 않습니다. 본 진단은 단순한 개인의 성찰을 넘어, 가정연합 조직 전체의 영적 건강성을 회복하고 천일국 안착을 앞당기는 구체적인 솔루션입니다. 막연했던 '적재적소'의 원칙을 데이터에 기반하여 실현하고, 소모적인 인간관계 갈등을 창조적인 시너지로 전환하는 터닝포인트가 될 것입니다.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 mb-20">
                            {benefitData.map((item, idx) => (
                                <div key={idx} className="flex flex-col bg-white p-10 rounded-[2.5rem] border border-stone-200 hover:border-amber-400 transition-all hover:shadow-2xl hover:-translate-y-1 group h-full">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                            <Icon name={item.icon} size={48} />
                                        </div>
                                        <div>
                                            <span className="text-amber-600 font-bold tracking-widest text-sm uppercase block mb-1">Benefit 0{idx+1}</span>
                                            <h3 className="text-2xl font-bold text-slate-900 font-serif leading-tight">{item.title}</h3>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-800 text-xl font-bold mb-6 leading-relaxed border-b border-stone-100 pb-6">
                                        {item.desc}
                                    </p>
                                    
                                    <div className="mt-auto text-lg text-slate-600 leading-loose text-justify">
                                        {idx === 0 && (
                                            <>
                                                더 이상 "사람이 없어서" 아무나 쓴다는 핑계를 대지 맙시다. 하나님은 이미 각 분야에 필요한 인재를 예비해 두셨습니다. 단지 우리가 그들의 재능을 발견하지 못하고, 전도사에게 행정을 맡기고 행정가에게 설교를 맡기는 실수를 범했을 뿐입니다. <br/>
                                                <strong className="text-blue-900">적재적소(Right Person, Right Place) 배치</strong>는 개인을 살리고 조직을 살리는 섭리 성장의 첫걸음입니다.
                                            </>
                                        )}
                                        {idx === 1 && (
                                            <>
                                                공직은 100미터 달리기 전력질주가 아닌 42.195km 마라톤입니다. 의무감으로 억지로 짜내는 헌신은 오래갈 수 없으며, 결국 영적 고갈을 부릅니다. <br/>
                                                자신의 내면 동기(Anchor)와 일치하는 사역을 할 때, 업무 자체가 에너지를 주는 <strong>'몰입(Flow)'</strong>을 경험하게 됩니다. 이것이 바로 하늘부모님과 하나 되어 창조본연의 기쁨을 누리는 '천일국 라이프스타일'입니다.
                                            </>
                                        )}
                                        {idx === 2 && (
                                            <>
                                                왜 우리는 하나 되지 못할까요? 그것은 서로의 '언어'가 다르기 때문입니다. 비전가에게 꼼꼼한 행정 서류는 고문이고, 살림꾼에게 무계획적인 돌격은 공포입니다. <br/>
                                                서로의 <strong>'다름'이 '틀림'이 아님을 깊이 이해할 때</strong>, 카인과 아벨의 소모적인 갈등은 멈추고 서로의 약점을 보완해주는 진정한 수수작용(Give & Take)이 시작됩니다.
                                            </>
                                        )}
                                        {idx === 3 && (
                                            <>
                                                과거의 '나를 따르라'식 카리스마 리더십만으로는 다변화된 현대 사회를 이끌 수 없습니다. 본 진단은 각 유형별로 경계해야 할 <strong>'그림자(Shadow)'</strong>와 개발해야 할 '성장 과제'를 구체적으로 제시합니다. <br/>
                                                스스로를 끊임없이 객관화하고 혁신하는 지도자만이 식구들의 마음을 얻고, 존경받는 영적 스승이 될 수 있습니다.
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                         <div className="bg-slate-900 p-12 md:p-20 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-4xl md:text-6xl font-bold mb-8 font-serif leading-tight">
                                    이제, 당신 안에 숨겨진 <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">천일국의 보물</span>을 발견할 시간입니다.
                                </h3>
                                <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed font-light">
                                    하늘부모님께서 태초에 당신을 빚으시며 숨겨두신 그 고유한 빛깔을 찾아내십시오.<br/>
                                    그 발견이 당신의 공직 생활을 의무가 아닌 기쁨으로, 희생이 아닌 감사로 변화시킬 것입니다.
                                </p>
                                <button onClick={onStart} className="bg-white text-slate-900 px-16 py-6 rounded-3xl text-2xl font-bold hover:bg-amber-50 hover:text-amber-900 hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-xl ring-4 ring-white/20">
                                    무료 소명 아키타입 진단 시작하기 <Icon name="ArrowRight" size={28}/>
                                </button>
                                <p className="mt-8 text-slate-500 text-base font-medium">
                                    * 본 진단 결과는 개인의 브라우저에만 저장되며 서버로 전송되지 않습니다. 안심하고 솔직하게 답변해 주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
