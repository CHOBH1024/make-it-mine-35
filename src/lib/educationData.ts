export interface ArchetypeEducation {
    archetypeId: number;
    coreCompetencies: string[];
    books: { title: string; author: string; reason: string }[];
    spiritualDiscipline: string;
    warningSign: string;
    recoveryTip: string;
}

export const educationContent: ArchetypeEducation[] = [
    {
        archetypeId: 1,
        coreCompetencies: ["제도 설계 및 규정화", "데이터 기반 의사결정", "품질 관리 시스템 구축", "전략적 기획력"],
        books: [
            { title: "좋은 기업을 넘어 위대한 기업으로", author: "짐 콜린스", reason: "시스템과 규율로 조직을 위대하게 만드는 원리" },
            { title: "원칙 (Principles)", author: "레이 달리오", reason: "명확한 원칙 기반 조직 운영의 모범 사례" },
            { title: "피터 드러커의 자기경영노트", author: "피터 드러커", reason: "공직자로서 자기관리와 성과 관리의 기초" },
        ],
        spiritualDiscipline: "새벽기도 + 말씀 구절 암송 1개 + 하루 업무 일지 작성",
        warningSign: "완벽주의로 인한 업무 지연, 동료에 대한 비판적 시각 증가",
        recoveryTip: "'80% 완성도로 실행'을 의식적으로 허용하고, 주 1회 자연 속 산책으로 긴장 해소",
    },
    {
        archetypeId: 2,
        coreCompetencies: ["심층 상담 기술", "가정 목양 역량", "공감적 경청", "위기 개입 능력"],
        books: [
            { title: "사람을 얻는 기술", author: "레스 기블린", reason: "관계 목회의 실천적 지혜" },
            { title: "감정은 습관이다", author: "최명기", reason: "목회자의 감정 소진 예방과 자기돌봄" },
            { title: "상처 입은 치유자", author: "헨리 나우웬", reason: "자신의 상처에서 목회 능력을 발견하는 영성" },
        ],
        spiritualDiscipline: "중보기도 30분 + 담당 가정 주 1회 기도 명단 작성",
        warningSign: "타인의 문제를 집에까지 가져오는 감정 과부하, 자기 돌봄 소홀",
        recoveryTip: "상담 후 의식적 '감정 닫기' 의례 만들기, 월 1회 개인 영성 피정",
    },
    {
        archetypeId: 3,
        coreCompetencies: ["전략적 목표 설정 및 실행", "성과 측정 및 KPI 관리", "팀 동기부여 리더십", "대외 협력 및 네트워크"],
        books: [
            { title: "OKR: 전설적인 벤처투자자가 구글에 전한 성공 방식", author: "존 도어", reason: "목회 사역 목표 설정과 성과 관리 시스템" },
            { title: "실행에 집중하라", author: "크리스 맥체스니", reason: "전략을 일상 실행으로 연결하는 4가지 원칙" },
            { title: "리더십 챌린지", author: "제임스 쿠제스", reason: "신뢰받는 리더십의 5가지 실천 원칙" },
        ],
        spiritualDiscipline: "주간 목표 기도 + 월간 성과 감사 예배 + 분기별 비전 금식",
        warningSign: "결과에 지나치게 집착하며 과정을 무시, 팀원 소진 무관심",
        recoveryTip: "'과정의 아름다움' 일지 작성, 팀원 개인 면담으로 관계 재충전",
    },
    {
        archetypeId: 4,
        coreCompetencies: ["문화예술 기반 전도 기획", "미디어 콘텐츠 제작", "창의적 예배 디자인", "지역사회 문화 연결"],
        books: [
            { title: "창조적 습관", author: "트와일라 타프", reason: "창의성을 매일의 사역으로 연결하는 실천 방법" },
            { title: "스틸: 모든 창작자는 도둑이다", author: "오스틴 클레온", reason: "문화 사역에서 영감을 수집하고 재창조하는 방법" },
            { title: "교회 사역의 혁신", author: "래리 오스본", reason: "전통과 창의성을 균형 있게 사역에 통합하기" },
        ],
        spiritualDiscipline: "아침 영감 일지 + 주 1회 창작물(시·그림·음악) 봉헌",
        warningSign: "인정받지 못할 때 사역 의욕 급락, 감정 기복 심화",
        recoveryTip: "창작 결과물에 대한 집착 내려놓기, '하나님께만 드리는' 개인 작품 시간 확보",
    },
    {
        archetypeId: 5,
        coreCompetencies: ["원리 및 신학 연구", "교재 및 커리큘럼 개발", "강의 및 교육 설계", "지식 체계화 역량"],
        books: [
            { title: "신학적 해석학", author: "앤서니 티슬턴", reason: "원리 말씀의 깊이 있는 해석 방법론" },
            { title: "생각의 탄생", author: "루트번스타인", reason: "학문적 탐구를 창의적 사역으로 연결하는 사고법" },
            { title: "독서천재가 된 홍대리", author: "이지성", reason: "방대한 지식을 실천 지혜로 전환하는 독서법" },
        ],
        spiritualDiscipline: "말씀선집 일독 계획 + 주간 연구 주제 기도 + 월 1회 연구 발표",
        warningSign: "현장 사역과 단절된 이론화, 지식 과부하로 인한 결정 마비",
        recoveryTip: "연구 결과를 반드시 현장 적용 후 피드백 받기, 주 1회 '현장의 날' 운영",
    },
    {
        archetypeId: 6,
        coreCompetencies: ["위기 관리 및 안전망 구축", "신뢰 기반 공동체 형성", "규정 준수 및 리스크 탐지", "충성스러운 팀 협력"],
        books: [
            { title: "신뢰의 속도", author: "스티븐 코비 Jr.", reason: "공직자로서 신뢰 자본을 쌓는 구체적 방법" },
            { title: "용기의 심리학", author: "알프레드 아들러", reason: "두려움과 불안을 넘어 사명으로 나아가는 힘" },
            { title: "팀장의 탄생", author: "줄리 주오", reason: "충성스러운 팀원에서 리더로 성장하는 과정" },
        ],
        spiritualDiscipline: "저녁 감사 기도 + 주간 위협 요소 중보기도 + 공동체 안전 점검",
        warningSign: "과도한 걱정으로 인한 결정 회피, 새로운 변화에 대한 강한 저항",
        recoveryTip: "'최악의 시나리오 기도'로 두려움을 하나님께 드리기, 소규모 변화 실험부터 시작",
    },
    {
        archetypeId: 7,
        coreCompetencies: ["전도 및 복음 전파", "열정적 대중 커뮤니케이션", "다양한 문화권 적응력", "기쁨 기반 공동체 활성화"],
        books: [
            { title: "전도왕 이야기", author: "D.L. 무디", reason: "복음 전파에 헌신한 전도자의 열정과 방법론" },
            { title: "긍정의 힘", author: "조엘 오스틴", reason: "기쁨과 낙관으로 사역하는 영성의 기초" },
            { title: "설교자여 불타라", author: "마틴 로이드 존스", reason: "열정적 메시지 전달의 영적·기술적 비결" },
        ],
        spiritualDiscipline: "매일 전도 대상자 3인 기도 + 감사 일지 + 주간 비전 선포 기도",
        warningSign: "깊이 없는 흥분 반복, 어려운 사역에서 도피하는 경향",
        recoveryTip: "분기별 고독과 침묵 수련, '즐겁지 않은 일'을 완수하는 습관 의식적 훈련",
    },
    {
        archetypeId: 8,
        coreCompetencies: ["개척 사역 리더십", "갈등 직면 및 해결", "조직 변화 관리", "강력한 의사결정력"],
        books: [
            { title: "담대하게", author: "조이스 마이어", reason: "두려움을 돌파하고 사명을 향해 나아가는 용기" },
            { title: "처음 90일", author: "마이클 왓킨스", reason: "새 사역지·조직 개척 시 빠른 리더십 정착법" },
            { title: "하드씽", author: "벤 호로위츠", reason: "극한 상황에서도 리더십을 유지하는 실전 지혜" },
        ],
        spiritualDiscipline: "새벽기도 + 금식 월 2회 + 사역 전 '담대함 선포' 기도",
        warningSign: "독주로 인한 팀 소외, 충고를 무시하는 독선적 결정",
        recoveryTip: "신뢰하는 동료 3인을 '견제자'로 세우고 월 1회 피드백 의무화",
    },
    {
        archetypeId: 9,
        coreCompetencies: ["갈등 조정 및 중재", "포용적 공동체 운영", "다양한 의견 통합", "평화 구축 프로세스 설계"],
        books: [
            { title: "어떻게 원하는 것을 얻는가", author: "스튜어트 다이아몬드", reason: "평화적 협상과 갈등 해결의 실전 기술" },
            { title: "비폭력 대화", author: "마셜 로젠버그", reason: "공동체 내 갈등을 평화롭게 전환하는 대화법" },
            { title: "회복적 생활교육", author: "로레인 수트베리", reason: "처벌 대신 회복을 중심으로 한 공동체 운영" },
        ],
        spiritualDiscipline: "침묵 기도 20분 + 갈등 당사자 중보기도 + 주간 화해 사례 감사",
        warningSign: "갈등 회피로 인한 문제 방치, 자신의 의견을 억압하는 소극성",
        recoveryTip: "'작은 의견 말하기' 연습부터 시작, 갈등 직면 후 결과 일지 작성으로 두려움 감소",
    },
];
