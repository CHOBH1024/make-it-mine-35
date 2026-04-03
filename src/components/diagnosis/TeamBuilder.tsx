
import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/diagnosis/Icon';
import { Archetype, SavedTeam } from '@/lib/types';
import { archetypes } from '@/lib/data';

interface TeamBuilderProps {
    myArchetype: Archetype;
}

type Category = 'VISION' | 'STRUCTURE' | 'RELATION' | 'ACTION';

// Helper to categorize archetypes
const getCategory = (id: number): Category => {
    if ([1, 8, 3].includes(id)) return 'VISION'; // Head/Will: 설계자, 비전가, 수호자
    if ([4, 6].includes(id)) return 'STRUCTURE'; // Body/Form: 살림꾼, 교육가
    if ([2, 7, 9].includes(id)) return 'RELATION'; // Heart: 부모, 중재자, 예술가
    if ([5].includes(id)) return 'ACTION'; // Hands/Feet: 기동대장
    return 'VISION';
};

const getCategoryInfo = (cat: Category) => {
    switch(cat) {
        case 'VISION': return { label: "비전 (Vision)", color: "text-purple-700 bg-purple-50 border-purple-200", icon: "Crown" };
        case 'STRUCTURE': return { label: "체계 (System)", color: "text-blue-700 bg-blue-50 border-blue-200", icon: "Castle" };
        case 'RELATION': return { label: "관계 (Relation)", color: "text-pink-700 bg-pink-50 border-pink-200", icon: "HeartHandshake" };
        case 'ACTION': return { label: "실행 (Action)", color: "text-amber-700 bg-amber-50 border-amber-200", icon: "Flame" };
    }
};

// Specific Team Role Definitions for each Archetype ID with Visuals
const teamRoleDefinitions: Record<number, { roleName: string; contribution: string; task: string; icon: string; theme: string }> = {
    1: { 
        roleName: "규율 반장 (Discipline Officer)", 
        contribution: "팀의 원칙과 마감을 엄격하게 관리하고 의사결정 과정을 바로잡아 '창조 질서'를 확립합니다.", 
        task: "일정/마일스톤 관리(PM), 회의록 작성 및 규정 준수 검수",
        icon: "Scale",
        theme: "slate"
    },
    2: { 
        roleName: "케어 매니저 (Care Manager)", 
        contribution: "팀원들의 영적/정서적 상태를 살피고 딱딱한 업무 관계를 '식구'의 인연으로 승화시킵니다.", 
        task: "팀 빌딩 및 회식 기획, 갈등 발생 시 심정적 중재 및 상담",
        icon: "HeartHandshake",
        theme: "pink"
    },
    3: { 
        roleName: "영적 나침반 (Spiritual Compass)", 
        contribution: "팀이 성과에 취해 섭리적 본질을 잃지 않도록 경계하고 '하늘의 뜻'에 방향을 정렬시킵니다.", 
        task: "기획안의 원리적 타당성 검토, 회의 전 훈독회 인도, 비전 정렬",
        icon: "Compass",
        theme: "purple"
    },
    4: { 
        roleName: "보급관 (Supply Officer)", 
        contribution: "풍년과 흉년을 대비하며 섭리의 물적 토대를 빈틈없이 관리하여 후방을 든든히 지킵니다.", 
        task: "예산 집행 관리, 비품 구입 및 장소 예약, 행정 절차 및 영수증 처리",
        icon: "Briefcase",
        theme: "blue"
    },
    5: { 
        roleName: "선봉장 (Vanguard)", 
        contribution: "가장 험난한 최전선에 먼저 뛰어들어 패배주의를 깨뜨리고 '할 수 있다'는 불을 지릅니다.", 
        task: "외부 VIP 섭외, 현장 답사 및 개척, 난관 돌파 및 분위기 쇄신",
        icon: "Flame",
        theme: "red"
    },
    6: { 
        roleName: "전략가 (Strategist)", 
        contribution: "추상적인 아이디어를 논리적인 체계로 정리하여 외부인들도 이해할 수 있는 정교한 논리를 만듭니다.", 
        task: "제안서/기획서 작성, PT 제작 및 발표, 데이터 분석 및 리서치",
        icon: "Map",
        theme: "indigo"
    },
    7: { 
        roleName: "피스메이커 (Peacemaker)", 
        contribution: "구성원 간의 미묘한 갈등을 조기에 감지하고 중재하여 '원팀(One Team)'의 조화를 만듭니다.", 
        task: "회의 진행(Moderator) 및 발언권 조율, 대외 협력 및 연락 창구",
        icon: "Wheat",
        theme: "green"
    },
    8: { 
        roleName: "혁신가 (Innovator)", 
        contribution: "낡은 관습을 깨고 '새 술을 새 부대'에 담아 섭리를 시대에 맞게 갱신하고 트렌드를 선도합니다.", 
        task: "아이디어 발제, 트렌드 벤치마킹, 프로토타입(시안) 제작",
        icon: "Sparkles",
        theme: "amber"
    },
    9: { 
        roleName: "감성 디렉터 (Art Director)", 
        contribution: "천일국의 문화를 아름답게 표현하여 삭막한 조직에 예술적 영성을 불어넣고 심금을 울립니다.", 
        task: "홍보물 디자인, 영상 편집, 공간 연출 및 데코레이션",
        icon: "Feather",
        theme: "rose"
    }
};

const getThemeClasses = (theme: string) => {
    switch(theme) {
        case 'slate': return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', iconBg: 'bg-slate-100', accent: 'border-slate-400' };
        case 'pink': return { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', iconBg: 'bg-pink-100', accent: 'border-pink-400' };
        case 'purple': return { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100', accent: 'border-purple-400' };
        case 'blue': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100', accent: 'border-blue-400' };
        case 'red': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconBg: 'bg-red-100', accent: 'border-red-400' };
        case 'indigo': return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', iconBg: 'bg-indigo-100', accent: 'border-indigo-400' };
        case 'green': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconBg: 'bg-green-100', accent: 'border-green-400' };
        case 'amber': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100', accent: 'border-amber-400' };
        case 'rose': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', iconBg: 'bg-rose-100', accent: 'border-rose-400' };
        default: return { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', iconBg: 'bg-stone-100', accent: 'border-stone-400' };
    }
};

interface ChemistryData {
    title: string;
    desc: string;
    strength: string;
    weakness: string;
    score: number;
    advice: string;
    communication: string;
    conflictTrigger: string;
    futureForecast: string;
    meetingStyle: string;
    decisionMethod: string;
    leaderStaffDynamic: string;
    pastorMemberDynamic: string;
    strategicGoal: string;
    strategicTheme: string;
    actionPlanShort: string;
    actionPlanLong: string;
    careerRoadmap: string;
    tags: string[];
}

// 1. Same Type Analysis Logic (Mirror Effect)
const getSameTypeChemistry = (archetype: Archetype): ChemistryData => {
    const info = getCategoryInfo(getCategory(archetype.id));
    return {
        title: "거울 속의 자아 (Mirror Reflection)",
        desc: `같은 '${archetype.title}' 유형의 만남입니다. 서로 설명하지 않아도 통하는 '소울메이트'와 같습니다. 일처리 속도가 매우 빠르고 가치관의 충돌이 없습니다. 하지만, 이는 곧 서로의 단점도 똑같다는 뜻입니다. 사각지대(Blind Spot)가 두 배로 커지며, 서로의 실수를 교정해주지 못하고 '공명'하여 문제를 키울 위험이 큽니다.`,
        strength: "압도적인 업무 속도, 완벽한 공감대, 불필요한 논쟁 생략, 강력한 초기 추진력",
        weakness: "집단 사고(Groupthink)의 위험, 동일한 약점의 증폭, 다양성 부족, 경쟁심 유발",
        score: 60,
        advice: "반드시 제3의 유형(다른 관점)을 객원 멤버로 초청하여 '감시자' 역할을 맡기십시오. 서로 '잘한다'고 칭찬만 하다가 절벽으로 갈 수 있습니다.",
        communication: "말하지 않아도 아는 텔레파시 소통. 그러나 외부인은 이들의 대화를 이해하지 못해 소외됨.",
        conflictTrigger: "서로의 단점이 상대방에게서 보일 때 혐오감을 느낌(동족혐오). 또는 같은 자리를 두고 경쟁할 때.",
        futureForecast: "초기에는 급속도로 성장하나, 예상치 못한 외부 변수에 취약하여 한순간에 무너질 수 있음.",
        meetingStyle: "속전속결. 만장일치로 5분 만에 끝남.",
        decisionMethod: "직관적 동의. '느낌 아니까'로 결정.",
        leaderStaffDynamic: "리더의 복제인간 같은 참모. 편하지만 리더를 보완해주지는 못함.",
        pastorMemberDynamic: "목회자와 성향이 같은 식구들만 남고, 다른 성향의 식구들은 떠나는 '끼리끼리' 공동체.",
        strategicGoal: `${archetype.dna.why}`,
        strategicTheme: "동질성의 극대화와 경계 (Maximizing Homogeneity)",
        actionPlanShort: "외부 전문가 그룹(자문단)을 구성하여 객관적 피드백 받기.",
        actionPlanLong: "의도적으로 나와 정반대인 사람을 후계자나 파트너로 영입하기.",
        careerRoadmap: "전문성을 심화하되, 협소해지지 않도록 주의",
        tags: [info.label, "Same Type", "Mirror"]
    };
};

const getDyadChemistry = (c1: Category, c2: Category): ChemistryData => {
    const cats = [c1, c2].sort();
    const key = cats.join('-');
    const info1 = getCategoryInfo(c1);
    const info2 = getCategoryInfo(c2);

    const baseData = {
        tags: [info1.label, info2.label],
        score: 0
    };

    switch(key) {
        case 'VISION-VISION': return {
            ...baseData,
            title: "영적 주체들의 연합 (Alliance of Subjects)",
            desc: "두 분은 섭리의 '방향'과 '본질'을 놓고 밤새워 토론할 수 있는 영적 도반입니다. 꿈꾸는 크기만큼 섭리의 지평을 넓힐 수 있으나, 구체적인 실행 없이 말 잔치로 끝나거나 실체 없는 '구름 위의 성'만 짓다 끝날 위험이 큽니다.",
            strength: "강력한 영적 동기부여, 섭리적 방향성의 거시적 일치, 서로의 원대한 꿈을 지지하는 계시적 대화",
            weakness: "실체적 기반의 부재, 구체적인 실행 계획(Action Plan) 결여, 난관 봉착 시 현실 도피적 경향",
            score: 70,
            advice: "말씀(Logos)은 육신(Flesh)을 입어야 완성됩니다. 회의 끝에 반드시 '누가, 언제, 무엇을, 얼마의 예산으로' 할 것인지 기록하는 실무 서기를 두십시오.",
            communication: "추상적이고 신학적인 언어, 서로 말을 끊고 아이디어를 얹으며 흥분하는 상승 대화 패턴.",
            conflictTrigger: "서로 '네가 실무를 하겠지'라고 미루다 마감일에 아무것도 진행되지 않았음을 확인했을 때.",
            futureForecast: "원대한 '천일국 헌법'은 만들었으나, 정작 그것을 지키고 살아갈 백성이 없는 공허한 상황.",
            meetingStyle: "끝장 토론형. 섭리의 역사부터 미래까지 이야기하다가 정작 오늘 결정해야 할 사항은 못 정함.",
            decisionMethod: "영감 의존형. '기도해 보니 이렇더라'는 직관에 의해 결정.",
            leaderStaffDynamic: "리더가 거창한 지시를 내리면 스태프도 거창하게 화답하지만, 구체적인 보고서는 안 씀.",
            pastorMemberDynamic: "목회자가 비전을 선포하면 식구는 '아멘'하지만, '그래서 헌금을 얼마나 내라는 거지?' 의문.",
            strategicGoal: "신학적 비전의 커리큘럼화 및 교재 편찬",
            strategicTheme: "말씀의 실체화 (Substantiation of Logos)",
            actionPlanShort: "3개월 내: 뜬구름 잡는 비전을 정리하여 '표준 강의안' 1건 완성 및 시범 강의.",
            actionPlanLong: "1년 내: 정리된 말씀을 바탕으로 '평생 교육원' 설립 또는 정기 아카데미 런칭.",
            careerRoadmap: "비전가1: 사상연구원장 (이론) | 비전가2: 부흥단장 (설파)"
        };
        case 'STRUCTURE-VISION': return {
            ...baseData,
            title: "주체와 대상의 창조적 수수작용 (Subject-Object Unity)",
            desc: "비전(마음)과 체계(몸)가 만난 가장 이상적인 '심신일체' 모델입니다. 비전가가 원대한 청사진을 제시하면 체계가가 이를 현실적인 계획으로 치환하여 뒷받침합니다. 무형의 뜻을 유형의 실적으로 안착시키는 최적의 조합입니다.",
            strength: "비전의 실체화 능력, 안정과 성장의 균형, 높은 업무 완결성, 상호 보완적 신뢰 관계",
            weakness: "속도 조절 갈등, 혁신(가보지 않은 길)과 안정(검증된 길)의 충돌",
            score: 98,
            advice: "비전가는 체계가의 제동을 '불신'으로 오해하지 말고, 체계가는 '안 된다'는 말 대신 '이렇게 하면 된다'는 대안을 제시하십시오.",
            communication: "비전가는 'Why'를 말하고 체계가는 'How'를 묻는 상호보완적 대화.",
            conflictTrigger: "비전가가 절차를 무시하고 독단적으로 섭리를 강행하거나, 체계가가 예산을 핑계로 비전을 축소할 때.",
            futureForecast: "내실과 외형을 모두 갖춘 섭리적 모델 교회가 건축되어 타 교회의 벤치마킹 대상이 됨.",
            meetingStyle: "가장 생산적인 회의. 비전가가 아이디어를 던지면 체계가가 엑셀을 켜고 시뮬레이션함.",
            decisionMethod: "합의형. 비전가가 방향을 잡고 체계가가 리스크를 체크.",
            leaderStaffDynamic: "리더(비전)가 꿈을 꾸면 스태프(체계)가 그것을 매뉴얼로 만드는 완벽한 비서실장 관계.",
            pastorMemberDynamic: "목회자가 비전을 제시하면 핵심 식구가 살림을 맡아 빈틈없이 뒷받침함.",
            strategicGoal: "자립형 모델 교회 구축 및 시스템 표준화",
            strategicTheme: "시스템에 의한 섭리 (Providence by System)",
            actionPlanShort: "3개월 내: 교회/조직의 정관 및 재무 규정 정비, 주간 업무 보고 체계 확립.",
            actionPlanLong: "1년 내: 재정 자립도 100% 달성 및 '운영 매뉴얼' 배포.",
            careerRoadmap: "비전가: 교구장 (조직 총괄) | 체계가: 사무총장 (살림 총괄)"
        };
        case 'ACTION-VISION': return {
            ...baseData,
            title: "출애굽의 기적 (Exodus Command)",
            desc: "말씀(Vision)과 실천(Action)이 결합된 강력한 개척자 팀입니다. 모세와 여호수아처럼 거친 광야를 돌파하며 불가능을 가능으로 만듭니다. 일단 저지르고 보는 행동력 덕분에 섭리의 속도가 비약적으로 빨라집니다.",
            strength: "압도적인 추진력, 빠른 섭리 완성, 역동적인 현장 변화, 두려움 없는 도전",
            weakness: "디테일 부족, 잦은 시행착오로 인한 자원 낭비, '믿으면 된다' 식의 무모함",
            score: 85,
            advice: "속도보다 중요한 것은 방향과 안전입니다. 정기적인 점검(Review) 시간을 강제로 편성하고, 꼼꼼한 실무자를 보강하십시오.",
            communication: "짧고 간결하며 직설적. '돌격 앞으로', '무조건 된다' 식의 선동적 구호.",
            conflictTrigger: "결과가 나쁠 때 서로 '네 믿음이 부족했다', '네 전략이 틀렸다'며 영적 비난을 할 때.",
            futureForecast: "외연은 급격히 확장되었으나 내실이 부족하여, 추후 보수 공사가 필요할 수 있음.",
            meetingStyle: "작전회의형. 서서 지도 펴놓고 '언제 출발할까'만 논의함.",
            decisionMethod: "톱다운(Top-down)형. 리더가 결정하면 즉시 실행.",
            leaderStaffDynamic: "리더가 '고지 점령'을 외치면 스태프는 총 들고 뛰어나감. 번아웃 주의.",
            pastorMemberDynamic: "목회자가 '건축합시다!' 하면 식구들이 집 팔아서 헌금하는 뜨거운 부흥회 분위기.",
            strategicGoal: "신규 식구 전도 및 섭리 영토 확장",
            strategicTheme: "중단 없는 전진 (Unstoppable Advance)",
            actionPlanShort: "3개월 내: 전도 특공대 조직 및 거리 캠페인 100회, 신규 식구 30명 목표.",
            actionPlanLong: "1년 내: 지교회 1개 개척 및 지역 사회 영향력 1위 달성.",
            careerRoadmap: "비전가: 개척교회장 (영토 확장) | 행동가: CARP 현장 소장 (실적 달성)"
        };
        case 'RELATION-STRUCTURE': return {
            ...baseData,
            title: "가정교회의 안주인 (Home Church Keepers)",
            desc: "안정적인 울타리(체계) 안에서 식구들을 따뜻하게 돌보는(관계) 어머니 같은 팀입니다. 웅장한 비전보다는 현재 있는 식구들을 살뜰히 챙기고 이탈을 막는 데 최적화되어 있습니다.",
            strength: "가장 안정적인 목회 환경, 높은 식구 만족도, 식구 정착률 증가, 따뜻한 조직 문화",
            weakness: "야성 상실, 현상 유지 편향, 새로운 변화에 대한 거부감, 폐쇄성",
            score: 88,
            advice: "내부의 평안함에 안주하지 말고 창문을 열어 바깥바람을 쐬어야 합니다. 우리끼리의 천국이 되지 않도록 전도 목표를 세우십시오.",
            communication: "부드럽고 예의 바르며, 갈등을 극도로 회피하는 조심스러운 화법.",
            conflictTrigger: "체계가가 원칙을 내세워 식구를 차갑게 대하거나, 관계가가 사적인 정으로 공금을 유용할 때.",
            futureForecast: "내적으로 단단한 가족이 되지만, 새로운 피가 수혈되지 않아 고령화될 위험.",
            meetingStyle: "반상회형. 다과를 먹으며 안부를 묻고 시작해서 공지를 부드럽게 전달.",
            decisionMethod: "만장일치 지향형. 한 사람이라도 반대하면 결정을 미룸.",
            leaderStaffDynamic: "리더가 꼼꼼히 챙기면서 스태프의 사정을 봐주는 가족 같은 관계.",
            pastorMemberDynamic: "목회자가 식구들의 숟가락 개수까지 아는 친밀한 관계.",
            strategicGoal: "새식구 정착률 제고 및 축복가정 관리",
            strategicTheme: "양육과 돌봄 (Nurture and Care)",
            actionPlanShort: "3개월 내: 전 식구 심방 완료 및 구역 조직 재편.",
            actionPlanLong: "1년 내: 식구 이탈률 0% 도전, 3대권이 함께하는 주일학교 시스템.",
            careerRoadmap: "관계가: 가정국장 (내적 목회) | 체계가: 교회 사무장 (살림 목회)"
        };
        default: return {
            ...baseData,
            title: "복합 섭리팀 (Hybrid Providence)", desc: "서로 다른 특성이 섞여 있어 초기에는 조율이 필요하지만, 장기적으로는 상호 보완을 통해 독특한 시너지를 낼 수 있습니다.", strength: "다양한 관점 수용, 상호 보완 가능성", weakness: "명확한 색깔 부족, 초기 소통 비용 발생", score: 80, advice: "서로의 다름을 인정하고, 각자의 강점을 발휘할 수 있는 명확한 역할 분담(R&R)이 필수적입니다.",
            communication: "초기에는 용어 정의부터 서로 달라 노력이 필요함.", conflictTrigger: "우선순위(일 vs 관계)에 대한 관점 차이.", futureForecast: "리더의 조율 능력에 따라 오합지졸 또는 어벤져스가 됨.",
            meetingStyle: "혼합형. 상황에 따라 유연하게 진행.", decisionMethod: "다수결 또는 합의.", leaderStaffDynamic: "상호 존중을 바탕으로 한 수평적 관계 지향.", pastorMemberDynamic: "다양성을 인정하는 열린 목회.",
            strategicGoal: "팀 빌딩 및 역할 정립", strategicTheme: "화합과 조율 (Harmony & Tuning)", actionPlanShort: "워크숍을 통한 서로의 강점 이해하기.", actionPlanLong: "공동의 성공 경험을 위한 단기 프로젝트 완수.", careerRoadmap: "각자의 강점을 살린 전문 분야 개척"
        };
    }
};

const getTriadChemistry = (c1: Category, c2: Category, c3: Category): ChemistryData => {
    const cats = [c1, c2, c3].sort();
    const key = cats.join('-');
    const tags = [getCategoryInfo(c1).label, getCategoryInfo(c2).label, getCategoryInfo(c3).label];
    
    const baseData = { tags, score: 0 };

    switch(key) {
        case 'RELATION-STRUCTURE-VISION': // V-S-R
            return {
                ...baseData,
                title: "이상적 사위기대 (Ideal Four Position Foundation)",
                desc: "하늘(비전), 땅(체계), 사람(관계)이 만난 섭리의 가장 이상적인 '안착 시대' 모델입니다. 비전가가 방향을 잡고, 체계가가 길을 닦으며, 관계가가 사람들을 이끌고 그 길을 갑니다. 3대상이 하나 되어 어떤 시련이 와도 무너지지 않는 자생력을 갖습니다.",
                strength: "완벽한 삼각 구도, 정책과 현장의 일치, 지속 가능한 성장, 리스크 최소화",
                weakness: "합의 과정에 시간이 걸림, 야성(Wildness) 부족으로 인한 돌파력 저하",
                score: 98,
                advice: "안주하지 않으려면 끊임없이 새로운 목표를 갱신해야 합니다. 결정적인 순간에는 책임을 질 리더를 명확히 하십시오.",
                communication: "비전(미래), 현실(현재), 사람(감정) 이야기가 골고루 오가는 성숙한 대화.",
                conflictTrigger: "비전가가 앞서가려 할 때 체계가가 제동 걸고, 관계가가 눈치 보는 상황.",
                futureForecast: "1년 후 내실과 외형을 갖춘 모델 교회로 선정되어 교단의 표준이 됨.",
                meetingStyle: "국회 의사당형. 치열하게 토론하지만 합리적 결론 도출.",
                decisionMethod: "삼권분립형. 비전 제안 -> 관계 동의 -> 체계 승인.",
                leaderStaffDynamic: "누가 리더가 되어도 나머지 둘이 보좌하는 '어벤져스' 팀.",
                pastorMemberDynamic: "목회자는 존경받고, 장로는 신뢰받고, 권사는 사랑받는 교회.",
                strategicGoal: "천일국 모델 교회 구축 및 복제",
                strategicTheme: "완전한 균형 (Perfect Balance)",
                actionPlanShort: "3개월 내: 비전 선포식, 부서별 R&R 재정립, 소그룹 리더 세우기.",
                actionPlanLong: "1년 내: 출석 식구 20% 성장, 재정 투명성 확보, 봉사 프로그램 정례화.",
                careerRoadmap: "비전가: 본부장 | 체계가: 재단 이사장 | 관계가: 수련원장"
            };
        case 'ACTION-RELATION-VISION': // V-R-A
            return {
                ...baseData,
                title: "성령의 부흥단 (The Revival Trinity)",
                desc: "말씀(비전), 사랑(관계), 실천(행동)이 결합된 '오순절 다락방'과 같은 팀입니다. 체계에 얽매이지 않고 성령의 이끄심을 따라 움직이며 폭발적인 에너지를 발휘합니다. 하지만 담을 그릇(행정)이 없어 부흥의 불길이 흩어질 위험이 있습니다.",
                strength: "강력한 영적 파동, 빠른 현장 장악력, 폭발적 전도, 식구들의 뜨거운 헌신",
                weakness: "체계 부족으로 인한 혼란, 재정 관리 허점, 지속 가능성 위기",
                score: 95,
                advice: "부흥의 불길을 담을 '그릇(체계)'을 외부에서라도 빌려오십시오. 기록과 재정 관리 훈련이 필요합니다.",
                communication: "은혜와 간증이 넘치는 대화. '할 수 있다', '하나님이 하셨다'는 격려.",
                conflictTrigger: "일이 꼬이거나 재정 사고가 났을 때 책임 소재를 따지지 못해 문제가 커짐.",
                futureForecast: "수많은 전도 실적을 냈으나 관리가 안 되어 정착률은 미지수.",
                meetingStyle: "기도회형. 회의하다가 통성기도하고 감동으로 결정.",
                decisionMethod: "만장일치 결의형. 분위기에 휩쓸려 결정.",
                leaderStaffDynamic: "리더가 깃발 들면 스태프들이 춤추며 따라감.",
                pastorMemberDynamic: "매일이 축제요 부흥회. 하지만 행정 처리가 늦어 민원 발생 가능.",
                strategicGoal: "지역 복음화 및 대형 집회 성공",
                strategicTheme: "영적 대각성 (Spiritual Awakening)",
                actionPlanShort: "3개월 내: 100일 특별 정성 및 노방 전도, 부흥 집회 3회.",
                actionPlanLong: "1년 내: 신규 전도 120명, 문화 예술 선교단 창단.",
                careerRoadmap: "비전가: 부흥사 | 행동가: 선교 소장 | 관계가: 목양 담당"
            };
        case 'ACTION-STRUCTURE-VISION': // V-S-A
            return {
                ...baseData,
                title: "천일국 건설단 (Construction Corps)",
                desc: "오직 과업 달성을 위해 뭉친 특수부대입니다. 비전-행동-체계가 톱니바퀴처럼 맞물려 불가능해 보이는 목표를 최단기간에 돌파해냅니다. 성전 건축이나 기관 설립 등 외형적 확장에 최적화되어 있습니다.",
                strength: "최고의 업무 효율, 목표 초과 달성, 신속한 섭리 진행, 빈틈없는 일처리",
                weakness: "심정의 고갈, 구성원의 도구화, 삭막한 분위기, 부상자 발생",
                score: 90,
                advice: "일은 성공했으나 사람은 잃을 수 있습니다. 업무 외적인 '티타임'과 '친교'를 의무적으로 편성하십시오.",
                communication: "군대식 보고와 지시. 감정 호소는 '나약함'으로 취급.",
                conflictTrigger: "성과 부진 시 상호 비난, 행동가의 독단과 체계가의 통제가 충돌.",
                futureForecast: "외적 성전은 웅장하게 완공되었으나, 내부는 차갑게 식어있을 수 있음.",
                meetingStyle: "작전 상황실형. 데이터 띄워놓고 달성률 체크.",
                decisionMethod: "목표 지향적 독재. 효율성이 최고 가치.",
                leaderStaffDynamic: "강력한 리더십과 유능한 참모. 퇴근 후엔 남남.",
                pastorMemberDynamic: "교회는 성장하고 건물도 짓지만, 식구들은 피로감을 호소.",
                strategicGoal: "성전 건축 및 섭리 기관 설립",
                strategicTheme: "실체적 기매 구축 (Foundation Building)",
                actionPlanShort: "3개월 내: 건축 기금 모금, 부지 매입 및 인허가 완료.",
                actionPlanLong: "1년 내: 성전 봉헌식 및 섭리 기업 흑자 전환.",
                careerRoadmap: "비전가: CEO | 행동가: 건설본부장 | 체계가: 감사실장"
            };
        default: return { 
            ...baseData, title: "복합 섭리팀 (Hybrid Providence)", desc: "서로 다른 특성이 섞여 있어 초기에는 조율이 필요하지만, 장기적으로는 상호 보완을 통해 독특한 시너지를 낼 수 있습니다.", strength: "다양한 관점 수용, 상호 보완 가능성", weakness: "명확한 색깔 부족, 초기 소통 비용 발생", score: 80, advice: "서로의 다름을 인정하고, 각자의 강점을 발휘할 수 있는 명확한 역할 분담(R&R)이 필수적입니다.", 
            communication: "초기에는 용어 정의부터 서로 달라 노력이 필요함.", conflictTrigger: "우선순위(일 vs 관계)에 대한 관점 차이.", futureForecast: "리더의 조율 능력에 따라 결과가 달라짐.",
            meetingStyle: "혼합형.", decisionMethod: "다수결 또는 합의.", leaderStaffDynamic: "수평적 관계 지향.", pastorMemberDynamic: "다양성 인정.",
            strategicGoal: "팀 빌딩 및 역할 정립", strategicTheme: "화합과 조율 (Harmony & Tuning)", actionPlanShort: "워크숍을 통한 강점 이해.", actionPlanLong: "단기 프로젝트 완수.",
            careerRoadmap: "각자의 강점 개발"
        };
    }
};

// Dynamic Analyzer for Large Teams (4-5 members)
const getLargeTeamChemistry = (team: Archetype[]): ChemistryData => {
    const categories = team.map(m => getCategory(m.id));
    const counts = { VISION: 0, STRUCTURE: 0, RELATION: 0, ACTION: 0 };
    categories.forEach(c => counts[c]++);
    
    // Count exact archetype ID duplicates for detailed homogeneity check
    const idCounts: Record<number, number> = {};
    team.forEach(m => { idCounts[m.id] = (idCounts[m.id] || 0) + 1; });
    const maxDuplicate = Math.max(...Object.values(idCounts));
    
    const sortedCats = (Object.keys(counts) as Category[]).sort((a, b) => counts[b] - counts[a]);
    const missing = sortedCats.filter(c => counts[c] === 0);
    const isBalanced = missing.length === 0;

    // --- 1. Homogeneity Check (Groupthink Risk) ---
    if (maxDuplicate >= 3) {
        const dominantId = Object.keys(idCounts).find(k => idCounts[parseInt(k)] === maxDuplicate);
        const domArchetype = team.find(m => m.id === parseInt(dominantId!));
        return {
            title: `${domArchetype?.title} 중심의 획일화 조직 (Homogeneous Organization)`,
            desc: `팀의 과반수가 '${domArchetype?.title}' 유형으로 구성되어 있습니다. 의사결정이 매우 빠르고 갈등이 거의 없지만, 이는 '집단 사고(Groupthink)'의 징후일 수 있습니다. 모두가 같은 방향만 바라보느라 다가오는 절벽을 보지 못할 위험이 큽니다. 외부의 변화에 둔감하며, '우리끼리' 문화가 강해져 새로운 인재가 들어오기 힘듭니다.`,
            strength: "강력한 응집력, 빠른 속도, 편안한 소통, 가치관의 일치",
            weakness: "치명적인 사각지대, 비판 기능 상실, 혁신 저항, 고인물화",
            score: 50, // Low score due to risk
            advice: "의도적으로 반대 의견을 내는 '레드팀(Red Team)' 역할을 지정하고, 외부 전문가의 객관적인 진단을 정기적으로 받아야 합니다.",
            communication: "은어와 약어만 써도 통하는 폐쇄적 소통.",
            conflictTrigger: "내부 갈등은 없으나, 외부의 비판에 대해 집단적으로 방어하며 적대시함.",
            futureForecast: "특정 기능은 비대해지고 나머지는 퇴화한 기형적 구조로 굳어짐.",
            meetingStyle: "서로 칭찬하고 동의하다 끝남.",
            decisionMethod: "만장일치. 이견이 없음.",
            leaderStaffDynamic: "모두가 리더와 같은 생각을 하여 충성도는 높으나 직언은 없음.",
            pastorMemberDynamic: "특정 성향의 식구들만 남는 편향된 교회.",
            strategicGoal: "조직의 다양성 확보 (Diversity)",
            strategicTheme: "이질적인 요소의 수용 (Acceptance of Differences)",
            actionPlanShort: "다른 유형의 객원 멤버 영입 및 권한 부여.",
            actionPlanLong: "채용 및 인사 배치 시 다양성 쿼터제 도입.",
            careerRoadmap: "유사성 탈피 및 타 분야 학습",
            tags: ["High Risk", "Homogeneity", "Groupthink"]
        };
    }

    // --- 2. Balanced Team ---
    if (isBalanced) {
        return {
            title: "천일국 원탁회의 (Cheon Il Guk Roundtable)",
            desc: "비전, 체계, 관계, 실행의 4대 섭리 요소가 모두 갖추어진 이상적인 '실체 안착형' 조직입니다. 사위기대가 완성되어 어떤 시련에도 흔들리지 않는 자생력을 가졌습니다.",
            strength: "풍부한 인적 자원, 다양한 관점의 융합, 대규모 프로젝트 수행 가능, 위기 대응력",
            weakness: "의사결정 속도가 다소 느릴 수 있음, 만장일치에 대한 강박, 배가 산으로 갈 위험",
            score: 99,
            advice: "완벽한 구성을 가졌으므로, 이제는 속도를 높여야 합니다. 각 분과별 책임 권한을 강화하고(Empowerment), 불필요한 회의를 줄이십시오.",
            communication: "다양한 의견이 오가며 깊이 있는 토론이 가능하나 시간이 오래 걸림.",
            conflictTrigger: "각 부서의 입장이 팽팽하여 합의점을 찾지 못하고 지루한 공방전이 될 때.",
            futureForecast: "안정적인 성장을 통해 교단의 표준이 되는 거대 조직으로 발전함.",
            meetingStyle: "정기 임원 회의형. 안건과 식순이 필요함.",
            decisionMethod: "분과 위임형 또는 숙의 민주주의.",
            leaderStaffDynamic: "조직화된 위계 질서와 역할 분담이 명확함.",
            pastorMemberDynamic: "체계적인 양육 시스템을 통해 식구들이 관리됨.",
            strategicGoal: "종합 섭리 모델 완성",
            strategicTheme: "완전한 조화 (Perfect Harmony)",
            actionPlanShort: "조직도 및 업무 분장(R&R) 확정, 정기 회의체 구성.",
            actionPlanLong: "분기별 목표 달성 및 부서별 확장, 후계자 양성.",
            careerRoadmap: "각자의 전문성을 살린 분과장/팀장 역할 수행",
            tags: ["Balanced", "Ideal", "Roundtable"]
        };
    }

    // --- 3. Missing Factor Analysis (Specific Scenarios) ---
    // Identify what is MISSING to give specific advice
    const missingVision = counts.VISION === 0;
    const missingStructure = counts.STRUCTURE === 0;
    const missingRelation = counts.RELATION === 0;
    const missingAction = counts.ACTION === 0;

    let title = "불균형 조직";
    let desc = "";
    let forecast = "";
    let advice = "";
    let weakness = "";
    let theme = "";
    let shortPlan = "";
    let longPlan = "";

    if (missingVision) {
        title = "방향 잃은 선박 (Ship without Compass)";
        desc = "실무 능력(구조, 실행)과 인화(관계)는 좋으나, 조직이 나아갈 거시적인 '비전'과 '철학'이 부재합니다. 열심히 노를 젓지만 배가 제자리를 맴돌거나 엉뚱한 곳으로 갈 수 있습니다.";
        weakness = "장기적 목표 부재, 영적 동기 부여 약화, 반복되는 업무에 대한 매너리즘";
        forecast = "현상 유지에는 성공하지만, 시대의 변화를 읽지 못해 서서히 도태될 위험이 큼.";
        advice = "지금 당장 '우리는 왜 존재하는가?'를 묻는 비전 워크숍을 여십시오. 외부의 비전가(Visionary)를 고문으로 위촉하여 방향 설정을 의뢰해야 합니다.";
        theme = "목적의 재발견 (Rediscovery of Purpose)";
        shortPlan = "조직의 미션 스테이트먼트(Mission Statement) 재작성.";
        longPlan = "향후 3년 중장기 발전 계획 수립 및 선포식.";
    } else if (missingStructure) {
        title = "모래 위의 성 (Castle on Sand)";
        desc = "열정(비전, 실행)과 사랑(관계)은 넘치지만, 이를 담을 '그릇(체계)'이 없습니다. 은혜로운 집회 후 재정이 펑크나거나, 열심히 전도한 식구가 관리 부실로 떠나가는 일이 반복됩니다.";
        weakness = "행정력 부재, 재정 사고 위험, 업무의 비효율, 기록 및 매뉴얼 없음";
        forecast = "초기에는 폭발적으로 부흥하나, 조직이 커질수록 관리 한계에 부딪혀 내부 붕괴될 수 있음.";
        advice = "은혜를 쏟지 않으려면 그릇을 준비해야 합니다. 재미없고 딱딱해 보여도 '행정 매뉴얼'과 '회계 시스템'을 도입하고 지킬 사람을 세우십시오.";
        theme = "기반 다지기 (Foundation Building)";
        shortPlan = "주간 업무 보고 및 회계 결재 라인 확립.";
        longPlan = "ERP 도입 및 모든 업무의 표준 매뉴얼(SOP)화.";
    } else if (missingRelation) {
        title = "차가운 기계 조직 (Cold Machine)";
        desc = "목표(비전)와 전략(체계, 실행)은 완벽하지만, 그 안에서 일하는 '사람'에 대한 배려가 빠져 있습니다. 일은 효율적으로 돌아가지만 구성원들은 부속품처럼 느껴져 영적 고갈을 호소합니다.";
        weakness = "구성원 번아웃, 높은 이직률, 삭막한 분위기, 소통 단절";
        forecast = "단기 성과는 탁월하지만, 결정적인 순간에 내부 결속력이 깨져 인재들이 대거 이탈할 것임.";
        advice = "일(Work)보다 사람(Human)을 먼저 챙기십시오. 회의 시작 전 10분간의 '티타임'을 의무화하고, 서로의 고충을 듣는 '상담 시간'을 마련해야 합니다.";
        theme = "심정 문화 회복 (Restoration of Heart)";
        shortPlan = "매월 1회 '업무 없는 날(No-Work Day)' 지정 및 친교 활동.";
        longPlan = "사내 심리 상담 프로그램 도입 및 멘토링 제도 운영.";
    } else if (missingAction) {
        title = "탁상공론 클럽 (Armchair Critics)";
        desc = "비전도 좋고, 계획도 치밀하고, 사이도 좋지만, 정작 현장에 나가 부딪히는 '행동'이 없습니다. 회의실에서는 세계를 구원했지만, 문밖을 나서면 아무 일도 일어나지 않습니다.";
        weakness = "실행력 제로, 현장 감각 저하, 두려움과 회피, 이론에만 치우침";
        forecast = "완벽한 계획서만 수북이 쌓인 채, 경쟁 조직에게 모든 기회를 뺏기고 쇠락할 것임.";
        advice = "완벽하지 않아도 좋으니 일단 저지르십시오(Just Do It). 책상에서 일어나 현장으로 나가는 '강제성'을 부여해야 합니다. 실패를 허용하는 문화를 만드십시오.";
        theme = "야성의 회복 (Restoration of Wildness)";
        shortPlan = "매주 1회 현장(거리) 활동 의무화 및 결과 보고.";
        longPlan = "실패 박람회 개최 및 도전적인 파일럿 프로젝트 3건 런칭.";
    } else {
        // Fallback for complex mix
        title = "복합 기능 수행팀 (Multi-Function Team)";
        desc = `다양한 재능이 모여있으나 ${missing.map(m=>getCategoryInfo(m).label).join(', ')} 영역의 보완이 시급합니다. 현재 구성원들이 해당 역할을 나누어 맡아야 합니다.`;
        weakness = `누락된 ${missing.map(m=>getCategoryInfo(m).label).join(', ')} 기능의 부재`;
        advice = "정기적인 워크숍을 통해 서로의 R&R을 명확히 하고, 누락된 기능을 누가 담당할지 정하십시오.";
        theme = "상호 보완 (Mutual Complementation)";
        forecast = "리더의 조율 능력에 따라 성패가 갈림.";
        shortPlan = "역할 재분배 워크숍.";
        longPlan = "부족한 기능을 채워줄 파트너 영입.";
    }

    const tags = sortedCats.map(c => getCategoryInfo(c).label);

    return {
        title, desc, strength: "풍부한 인적 자원, 다양한 관점의 융합", weakness, score: 80 - (missing.length * 10), advice, tags,
        communication: "서로 다른 언어를 사용하여 오해가 발생할 수 있으니 '통역'이 필요함.",
        conflictTrigger: "결핍된 기능으로 인해 발생하는 사고(예: 재정사고, 번아웃)가 갈등의 원인이 됨.",
        futureForecast: forecast,
        meetingStyle: "혼합형. 상황에 따라 유연하게 진행.",
        decisionMethod: "다수결 원칙 또는 리더의 직관.",
        leaderStaffDynamic: "상호 존중을 바탕으로 한 수평적 관계 지향.",
        pastorMemberDynamic: "다양성을 인정하는 열린 목회.",
        strategicGoal: "결핍 요소(Missing Link) 보완",
        strategicTheme: theme,
        actionPlanShort: shortPlan,
        actionPlanLong: longPlan,
        careerRoadmap: "각자의 강점을 살리되 부족한 기능을 순환 보직으로 경험"
    };
};

// --- New AI Suggestions Logic ---
interface TeamSuggestion {
    title: string;
    type: 'DYAD' | 'TRIAD';
    members: Archetype[];
    reason: string;
    synergy: string;
}

const getTeamSuggestions = (me: Archetype): TeamSuggestion[] => {
    const suggestions: TeamSuggestion[] = [];

    // 1. Dyad Suggestion (Best Partner)
    const bestPartnerId = parseInt(me.partners.best.role.split('.')[0]);
    const bestPartner = archetypes.find(a => a.id === bestPartnerId);
    if (bestPartner) {
        suggestions.push({
            title: "최고의 듀오 (Best Duo)",
            type: 'DYAD',
            members: [bestPartner],
            reason: me.partners.best.reason,
            synergy: "상호 보완적인 강점으로 시너지 극대화"
        });
    }

    // 2. Triad Suggestion (Golden Triangle)
    // Simplified Logic: Hardcoded ideal triads per archetype ID to ensure V-S-R or other high synergy
    let triadPartnerIds: number[] = [];
    let triadReason = "";
    
    switch(me.id) {
        case 1: triadPartnerIds = [4, 2]; triadReason = "설계자(본질) + 살림꾼(현실) + 부모(관계) = 가장 안정적인 이상적 사위기대"; break;
        case 2: triadPartnerIds = [1, 4]; triadReason = "부모(관계) + 설계자(본질) + 살림꾼(현실) = 사랑과 원칙이 조화된 목회"; break;
        case 3: triadPartnerIds = [5, 2]; triadReason = "수호자(영성) + 기동대장(실천) + 부모(관계) = 강력한 영적 부흥과 돌봄"; break;
        case 4: triadPartnerIds = [8, 7]; triadReason = "살림꾼(관리) + 비전가(혁신) + 중재자(조율) = 안정 속의 점진적 개혁"; break;
        case 5: triadPartnerIds = [3, 2]; triadReason = "기동대장(실천) + 수호자(방향) + 부모(포용) = 식구를 잃지 않는 전도 확장"; break;
        case 6: triadPartnerIds = [3, 9]; triadReason = "교육가(논리) + 수호자(영성) + 예술가(감성) = 지성, 영성, 감성의 완벽한 조화"; break;
        case 7: triadPartnerIds = [1, 5]; triadReason = "중재자(평화) + 설계자(질서) + 기동대장(돌파) = 갈등 없는 목표 달성"; break;
        case 8: triadPartnerIds = [4, 7]; triadReason = "비전가(꿈) + 살림꾼(현실) + 중재자(소통) = 실현 가능한 미래 혁신"; break;
        case 9: triadPartnerIds = [6, 3]; triadReason = "예술가(문화) + 교육가(진리) + 수호자(영성) = 깊이 있는 심정 문화 안착"; break;
        default: triadPartnerIds = [2, 4]; triadReason = "가장 보편적이고 안정적인 협력 모델"; break;
    }

    const triadPartners = triadPartnerIds.map(id => archetypes.find(a => a.id === id)).filter((a): a is Archetype => !!a);
    
    if (triadPartners.length === 2) {
        suggestions.push({
            title: "황금 삼각형 (Golden Triad)",
            type: 'TRIAD',
            members: triadPartners,
            reason: triadReason,
            synergy: "3대상이 하나 되어 어떤 시련에도 무너지지 않는 자생력 확보"
        });
    }

    return suggestions;
};

export const TeamBuilder: React.FC<TeamBuilderProps> = ({ myArchetype }) => {
    const [partners, setPartners] = useState<Archetype[]>([]);
    const [teamName, setTeamName] = useState('');
    const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('cig_saved_teams');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSavedTeams(parsed);
            } catch (e) {
                console.error("Failed to parse saved teams", e);
            }
        }
    }, []);

    // Changed: Allow duplicates and selection of same type
    const addPartner = (archetype: Archetype) => {
        if (partners.length < 4) { 
            setPartners([...partners, archetype]);
        } else {
            alert("팀 시뮬레이션은 본인 포함 최대 5명까지만 가능합니다.");
        }
    };

    const removePartner = (index: number) => {
        const newPartners = [...partners];
        newPartners.splice(index, 1);
        setPartners(newPartners);
    };

    const applySuggestion = (members: Archetype[]) => {
        setPartners(members);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see analysis
    };

    const handleSaveTeam = () => {
        if (partners.length === 0) {
            alert("파트너를 최소 1명 이상 선택해주세요.");
            return;
        }
        if (!teamName.trim()) {
            alert("팀 이름을 입력해주세요.");
            return;
        }

        if (savedTeams.some(t => t.name.trim() === teamName.trim())) {
             alert("이미 동일한 이름의 팀이 존재합니다. 다른 이름을 사용해주세요.");
             return;
        }

        const newTeam: SavedTeam = {
            id: Date.now().toString(),
            name: teamName,
            myArchetypeId: myArchetype.id,
            partnerIds: partners.map(p => p.id),
            createdAt: Date.now()
        };

        const updatedTeams = [newTeam, ...savedTeams];
        setSavedTeams(updatedTeams);
        localStorage.setItem('cig_saved_teams', JSON.stringify(updatedTeams));
        setTeamName('');
        alert("팀이 저장되었습니다.");
    };

    const handleDeleteTeam = (id: string) => {
        if (confirm("정말 이 팀 기록을 삭제하시겠습니까?")) {
            const updatedTeams = savedTeams.filter(t => t.id !== id);
            setSavedTeams(updatedTeams);
            localStorage.setItem('cig_saved_teams', JSON.stringify(updatedTeams));
        }
    };

    const handleLoadTeam = (team: SavedTeam) => {
        if (team.myArchetypeId !== myArchetype.id) {
            if (!confirm("이 팀은 다른 아키타입(본인)을 기준으로 생성되었습니다. 그래도 불러오시겠습니까? 결과가 다를 수 있습니다.")) {
                return;
            }
        }
        
        const loadedPartners = team.partnerIds
            .map(id => archetypes.find(a => a.id === id))
            .filter((a): a is Archetype => !!a);
            
        setPartners(loadedPartners);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const team = [myArchetype, ...partners];
    const isDyad = team.length === 2;
    const isTriad = team.length === 3;
    const isLarge = team.length >= 4;
    const categories = team.map(m => getCategory(m.id));
    
    // Get Suggestions
    const suggestions = getTeamSuggestions(myArchetype);

    // --- Rich Analysis Logic ---
    let teamAnalysis: ChemistryData = {
        title: "팀 시뮬레이션 대기 중",
        desc: "파트너를 선택하면 분석 결과가 여기에 표시됩니다.",
        strength: "",
        weakness: "",
        advice: "",
        score: 0,
        tags: [],
        communication: "",
        conflictTrigger: "",
        futureForecast: "",
        meetingStyle: "",
        decisionMethod: "",
        leaderStaffDynamic: "",
        pastorMemberDynamic: "",
        strategicGoal: "",
        strategicTheme: "",
        actionPlanShort: "",
        actionPlanLong: "",
        careerRoadmap: ""
    };

    // Logic Selection
    if (isDyad) {
        // Detect Same Type Dyad
        if (team[0].id === team[1].id) {
            teamAnalysis = getSameTypeChemistry(team[0]);
        } else {
            teamAnalysis = getDyadChemistry(categories[0], categories[1]);
        }
    } else if (isTriad) {
        teamAnalysis = getTriadChemistry(categories[0], categories[1], categories[2]);
    } else if (isLarge) {
        teamAnalysis = getLargeTeamChemistry(team);
    }

    const renderAnalysis = () => {
        if (team.length < 2) return (
            <div className="text-center text-stone-400 py-24 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center min-h-[500px] hover:bg-stone-100 transition-colors">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-stone-100">
                    <Icon name="Users" size={48} className="text-stone-300"/>
                </div>
                <h4 className="text-2xl font-bold text-slate-600 mb-3 font-serif">팀 시뮬레이션 시작하기</h4>
                <p className="max-w-md mx-auto leading-relaxed text-slate-500">
                    위 리스트에서 함께할 파트너를 선택해보세요.<br/>
                    <strong className="text-blue-900">최대 5명</strong>까지 팀을 구성하여 <strong>심층적인 섭리적 화학 반응</strong>을 시뮬레이션할 수 있습니다.
                </p>
            </div>
        );

        return (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                {/* Save Team Bar */}
                <div className="bg-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                    <div className="text-white flex items-center gap-2">
                        <Icon name="Save" size={20} className="text-amber-400"/>
                        <span className="font-bold">현재 팀 저장하기 ({team.length}명)</span>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input 
                            type="text" 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="팀 이름 (예: 2024 기획팀)"
                            className="flex-grow md:w-64 px-4 py-2 rounded-lg text-sm bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-amber-500 placeholder-slate-400"
                        />
                        <button 
                            onClick={handleSaveTeam}
                            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <Icon name="Save" size={16}/> 저장
                        </button>
                    </div>
                </div>

                {/* 1. Main Dashboard Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                            <Icon name="Users" size={200} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {teamAnalysis.tags.slice(0,5).map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold border border-white/20 uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight word-keep break-keep">{teamAnalysis.title}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-8">
                                <div className="flex items-center gap-3">
                                    <div className="text-sm text-slate-300 uppercase tracking-widest font-bold text-xs">Chemistry<br/>Score</div>
                                    <span className={`text-5xl font-black tracking-tight ${teamAnalysis.score < 70 ? 'text-red-400' : 'text-amber-400'}`}>{teamAnalysis.score}</span>
                                </div>
                                <div className="hidden md:block h-12 w-px bg-white/20"></div>
                                <div className="text-base text-slate-300 max-w-lg leading-relaxed">
                                    {isDyad 
                                        ? "2인(Dyad) 관계는 서로를 마주보는 거울과 같습니다. '주체와 대상'의 수수작용이 원만할 때 섭리는 발전합니다." 
                                        : isTriad 
                                            ? "3인(Triad) 팀은 '사위기대'의 기초입니다. 하늘부모님을 중심에 두고 3대상이 하나 될 때 이상적인 기초가 닦입니다."
                                            : "4인 이상의 대규모 팀은 '천일국'의 축소판입니다. 다양한 은사가 조화를 이루어 섭리의 완성 완결을 향해 나아갑니다."
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 md:p-10">
                        {/* Strategic Goal Section */}
                        <div className="mb-12 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="Target" size={150}/></div>
                            <h4 className="text-amber-400 font-bold tracking-widest uppercase mb-2 text-sm">Strategic Mission</h4>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{teamAnalysis.strategicGoal || "분석 중..."}</h2>
                            <p className="text-blue-200 text-xl font-medium italic">"{teamAnalysis.strategicTheme || "..."}"</p>
                        </div>

                        {/* Analysis Description */}
                        <div className="mb-12">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                                <Icon name="Activity" className="text-blue-900"/> 팀 섭리적 DNA 분석 (Analysis)
                            </h4>
                            <p className="text-lg md:text-2xl text-slate-700 leading-loose text-justify border-l-4 border-blue-900 pl-6 md:pl-8 py-6 bg-slate-50/50 rounded-r-xl break-keep shadow-sm">
                                {teamAnalysis.desc}
                            </p>
                        </div>

                        {/* Light & Shadow Grid */}
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 relative group transition-all hover:shadow-md">
                                <div className="absolute top-6 right-6 text-green-200 group-hover:text-green-300 transition-colors">
                                    <Icon name="ThumbsUp" size={48}/>
                                </div>
                                <h5 className="font-bold text-green-900 mb-6 flex items-center gap-2 text-lg">
                                    <Icon name="CheckCircle" size={24}/> 섭리적 강점 (Providential Light)
                                </h5>
                                <ul className="space-y-6 relative z-10">
                                    {teamAnalysis.strength.split(',').map((s, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-700">
                                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full mt-3 shrink-0 shadow-sm"></span>
                                            <span className="font-medium text-green-900/90 leading-loose text-lg md:text-xl break-keep">{s.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 relative group transition-all hover:shadow-md">
                                <div className="absolute top-6 right-6 text-red-200 group-hover:text-red-300 transition-colors">
                                    <Icon name="AlertTriangle" size={48}/>
                                </div>
                                <h5 className="font-bold text-red-900 mb-6 flex items-center gap-2 text-lg">
                                    <Icon name="XCircle" size={24}/> 주의할 그림자 (Shadow)
                                </h5>
                                <ul className="space-y-6 relative z-10">
                                    {teamAnalysis.weakness.split(',').map((s, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-700">
                                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mt-3 shrink-0 shadow-sm"></span>
                                            <span className="font-medium text-red-900/90 leading-loose text-lg md:text-xl break-keep">{s.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Action Plan */}
                        <div className="mb-12">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl font-serif">
                                <Icon name="Map" className="text-emerald-600"/> 단계별 실행 로드맵 (Action Plan)
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                                    <h5 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                        <Icon name="History" size={20}/> 단기 과제 (3개월) - 착수
                                    </h5>
                                    <p className="text-slate-700 leading-relaxed text-lg font-medium">{teamAnalysis.actionPlanShort || "계획 수립 중..."}</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                                    <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <Icon name="Flag" size={20}/> 장기 과제 (1년) - 안착
                                    </h5>
                                    <p className="text-slate-700 leading-relaxed text-lg font-medium">{teamAnalysis.actionPlanLong || "계획 수립 중..."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Unified Team Member Strategy Section (New Unified Design) */}
                        <div className="bg-stone-50 p-8 md:p-10 rounded-[2.5rem] border border-stone-200 mb-12">
                            <h4 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-3">
                                <Icon name="Users" className="text-blue-900"/> 팀원별 통합 역할 및 성장 전략 (Member Strategy)
                            </h4>
                            
                            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {team.map((member, idx) => {
                                    const roleInfo = teamRoleDefinitions[member.id];
                                    const theme = getThemeClasses(roleInfo.theme);
                                    const isMe = idx === 0;

                                    return (
                                        <div key={idx} className={`bg-white rounded-3xl overflow-hidden border-2 transition-all hover:shadow-xl group flex flex-col h-full relative ${isMe ? 'border-blue-900 ring-4 ring-blue-900/5' : 'border-stone-200 hover:border-blue-300'}`}>
                                            {/* Remove Button for Partners */}
                                            {!isMe && (
                                                <button 
                                                    onClick={() => removePartner(idx - 1)} // idx 0 is self
                                                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-200"
                                                    title="이 파트너 제거"
                                                >
                                                    <Icon name="X" size={16}/>
                                                </button>
                                            )}

                                            {/* Header Banner */}
                                            <div className={`px-6 py-4 border-b ${theme.border} ${theme.bg} flex justify-between items-center`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm ${theme.text}`}>
                                                        <Icon name={member.symbol} size={20}/>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold opacity-60 uppercase tracking-wider">{member.engTitle}</div>
                                                        <div className="font-bold text-slate-900 text-lg leading-none">{member.title}</div>
                                                    </div>
                                                </div>
                                                {isMe && <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">YOU</span>}
                                            </div>

                                            <div className="p-6 flex-grow flex flex-col gap-6">
                                                {/* Assigned Role Badge */}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md shrink-0 ${theme.bg} ${theme.text}`}>
                                                        <Icon name={roleInfo.icon} size={24}/>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-0.5">Assigned Team Role</div>
                                                        <div className="text-xl font-bold font-serif text-slate-800">{roleInfo.roleName}</div>
                                                        <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-3">{roleInfo.contribution}</p>
                                                    </div>
                                                </div>

                                                {/* Biblical Model Badge */}
                                                <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3 border border-stone-100">
                                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-amber-600 shadow-sm border border-stone-100 shrink-0">
                                                        <Icon name="Lightbulb" size={16}/>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-stone-400 uppercase">Biblical Model</span>
                                                        <div className="text-sm font-bold text-slate-700">{member.roleModel.name} <span className="text-stone-400 font-normal text-xs">- {member.roleModel.epithet}</span></div>
                                                    </div>
                                                </div>

                                                <div className="w-full h-px bg-stone-100"></div>

                                                {/* Recommendations */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-700">
                                                            <Icon name="Map" size={14} className="text-blue-500"/> 직무 환경 (Work Context)
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                                                <span className="font-bold text-blue-800">[본부]</span> {member.recommendations.hq}
                                                            </div>
                                                            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 text-xs text-slate-600 leading-relaxed">
                                                                <span className="font-bold text-amber-800">[현장]</span> {member.recommendations.field}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-700">
                                                            <Icon name="TrendingUp" size={14} className="text-purple-500"/> 커리어 패스 (Career Path)
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {member.roles.slice(0,3).map((r, i) => (
                                                                <span key={i} className="px-2 py-1 bg-white border border-stone-200 rounded text-[10px] font-bold text-slate-600 shadow-sm">
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                         {/* Meeting & Decision Report */}
                         <div className="mb-12 bg-indigo-50/50 rounded-2xl border border-indigo-100 p-8 md:p-10">
                            <h4 className="font-bold text-indigo-900 mb-6 flex items-center gap-2 text-xl font-serif">
                                <Icon name="ListChecks" className="text-indigo-600"/> 협업 및 의사결정 스타일 (Collaboration)
                            </h4>
                            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                                <div className="bg-white p-6 md:p-8 rounded-xl border border-indigo-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Icon name="Users" size={24}/></div>
                                        <h5 className="font-bold text-slate-800 text-xl">회의 분위기 (Meeting Style)</h5>
                                    </div>
                                    <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify break-keep">{teamAnalysis.meetingStyle || "분석 중..."}</p>
                                </div>
                                <div className="bg-white p-6 md:p-8 rounded-xl border border-indigo-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Icon name="Gavel" size={24}/></div>
                                        <h5 className="font-bold text-slate-800 text-xl">의사결정 방식 (Decision Making)</h5>
                                    </div>
                                    <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify break-keep">{teamAnalysis.decisionMethod || "분석 중..."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Relational Dynamics Report */}
                        <div className="mb-12 bg-slate-100 rounded-2xl border border-slate-200 p-8 md:p-10">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-xl font-serif">
                                <Icon name="Activity" className="text-slate-600"/> 관계 역학 시뮬레이션 (Relationship Dynamics)
                            </h4>
                            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                                <div className="relative pl-6 md:pl-8 border-l-4 border-blue-800 py-2">
                                    <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-xl">
                                        <Icon name="Briefcase" size={20}/> 리더(상사) vs 팔로워(참모)
                                    </h5>
                                    <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify italic break-keep">
                                        "{teamAnalysis.leaderStaffDynamic || "분석 중..."}"
                                    </p>
                                </div>
                                <div className="relative pl-6 md:pl-8 border-l-4 border-amber-600 py-2">
                                    <h5 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-xl">
                                        <Icon name="Church" size={20}/> 목회자 vs 식구(장로/권사)
                                    </h5>
                                    <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify italic break-keep">
                                        "{teamAnalysis.pastorMemberDynamic || "분석 중..."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Deep Dive Section (Communication & Conflict) */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-12">
                            <div className="border border-stone-200 rounded-2xl p-8 md:p-10 bg-white shadow-sm">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xl">
                                    <Icon name="MessageCircle" className="text-blue-500"/> 소통 스타일 (Communication)
                                </h5>
                                <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify break-keep">
                                    {teamAnalysis.communication}
                                </p>
                            </div>
                            <div className="border border-stone-200 rounded-2xl p-8 md:p-10 bg-white shadow-sm">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xl">
                                    <Icon name="Zap" className="text-amber-500"/> 갈등 트리거 (Conflict Trigger)
                                </h5>
                                <p className="text-lg md:text-xl text-slate-700 leading-loose text-justify break-keep">
                                    {teamAnalysis.conflictTrigger}
                                </p>
                            </div>
                        </div>

                        {/* Future Forecast */}
                        <div className="bg-stone-900 text-stone-200 p-10 md:p-14 rounded-2xl mb-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h5 className="font-bold text-white mb-6 flex items-center gap-2 text-xl relative z-10">
                                <Icon name="Compass" className="text-amber-400"/> 1년 후 미래 예측 (Forecast)
                            </h5>
                            <p className="leading-loose text-justify relative z-10 font-serif italic text-xl md:text-3xl opacity-90 break-keep">
                                "{teamAnalysis.futureForecast}"
                            </p>
                        </div>

                        {/* Action Item */}
                        <div className="bg-amber-50 p-8 md:p-12 rounded-2xl border-2 border-amber-200/60 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                            <div className="bg-amber-100 p-5 rounded-2xl text-amber-600 shrink-0">
                                <Icon name="Target" size={40}/>
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900 mb-3 text-xl md:text-2xl">성공을 위한 협업 가이드 (Key to Success)</h4>
                                <p className="text-amber-900/90 leading-loose font-medium text-lg md:text-2xl break-keep">
                                    {teamAnalysis.advice}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12 fade-in">
            {/* 1. Header & Partner Selection */}
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-blue-900 mb-4 font-serif">천일국 팀 빌딩 시뮬레이션</h3>
                <p className="text-lg text-slate-600">함께 사역할 파트너를 선택하여 섭리적 시너지를 확인하세요.</p>
            </div>

            {/* NEW: AI Team Suggestions Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-inner">
                <h4 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2 font-serif">
                    <Icon name="Sparkles" className="text-amber-500" /> AI 맞춤형 팀 추천 (AI Team Suggestions)
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                    {suggestions.map((sug, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0 group-hover:bg-indigo-100 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">{sug.type === 'DYAD' ? 'Best Partner' : 'Ideal Team'}</div>
                                        <h5 className="font-bold text-lg text-slate-900 font-serif">{sug.title}</h5>
                                    </div>
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                                        <Icon name={sug.type === 'DYAD' ? 'UserCheck' : 'Users'} size={20}/>
                                    </div>
                                </div>
                                
                                <div className="flex -space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold text-xs z-30" title="You">You</div>
                                    {sug.members.map((m, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-600 z-20 shadow-sm relative group/icon">
                                            <Icon name={m.symbol} size={16}/>
                                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {m.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-slate-600 mb-2 font-medium">"{sug.reason}"</p>
                                <p className="text-xs text-slate-500 mb-6 bg-slate-50 p-2 rounded">{sug.synergy}</p>

                                <button 
                                    onClick={() => applySuggestion(sug.members)}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-auto"
                                >
                                    <Icon name="Check" size={14}/> 이 조합으로 시뮬레이션
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Partner Selection Area */}
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-md">
                <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Icon name="UserPlus" className="text-blue-500"/> 파트너 선택 (최대 4명)
                </h4>
                
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {/* My Card (Fixed) */}
                    <div className="min-w-[200px] p-4 bg-blue-50 border-2 border-blue-900 rounded-2xl flex flex-col items-center text-center opacity-80 cursor-not-allowed">
                        <div className="text-xs font-bold text-blue-900 uppercase mb-2">YOU</div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 mb-3 shadow-sm">
                            <Icon name={myArchetype.symbol} size={24}/>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">{myArchetype.title}</div>
                    </div>

                    {/* Available Partners */}
                    {archetypes.map(a => {
                        const isSelected = partners.some(p => p.id === a.id);
                        const isMe = a.id === myArchetype.id;
                        
                        return (
                            <button 
                                key={a.id}
                                onClick={() => addPartner(a)}
                                className={`min-w-[200px] p-4 rounded-2xl flex flex-col items-center text-center transition-all border-2 relative overflow-hidden group ${
                                    isSelected 
                                        ? 'bg-amber-50 border-amber-500 shadow-md' 
                                        : isMe 
                                            ? 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-sm'
                                            : 'bg-white border-stone-100 hover:border-blue-300 hover:shadow-sm'
                                }`}
                            >
                                {partners.filter(p => p.id === a.id).length > 0 && (
                                    <span className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
                                        x{partners.filter(p => p.id === a.id).length}
                                    </span>
                                )}
                                
                                <div className={`text-xs font-bold uppercase mb-2 ${isMe ? 'text-blue-500' : 'text-stone-400'}`}>
                                    {isMe ? 'SAME TYPE' : `Type ${a.id}`}
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm transition-colors ${isSelected ? 'bg-amber-500 text-white' : (isMe ? 'bg-blue-100 text-blue-600' : 'bg-stone-50 text-stone-400')}`}>
                                    <Icon name={a.symbol} size={24}/>
                                </div>
                                <div className={`font-bold text-sm ${isSelected ? 'text-amber-900' : 'text-slate-600'}`}>{a.title}</div>
                                <div className="mt-2 text-[10px] text-stone-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 px-2 py-1 rounded">
                                    클릭하여 추가 +
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Saved Teams List */}
            {savedTeams.length > 0 && (
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                    <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Icon name="History" size={18}/> 저장된 팀 기록
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {savedTeams.map(team => (
                            <div key={team.id} className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm flex items-center gap-3 hover:border-blue-300 transition-colors cursor-pointer" onClick={() => handleLoadTeam(team)}>
                                <span className="font-bold text-slate-800">{team.name}</span>
                                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{new Date(team.createdAt).toLocaleDateString()}</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                                    className="text-stone-300 hover:text-red-500 transition-colors"
                                >
                                    <Icon name="X" size={14}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {renderAnalysis()}
        </div>
    );
};
