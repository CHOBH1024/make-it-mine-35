export const integrationData = {
  rationale: {
    title: "5개 도구 통합 모델의 타당성",
    content: `이 진단 시스템은 Big Five, 에니어그램, 커리어 앵커, VIA 강점, EQ 5개 도구를 결합하여 가정연합 목회공직자의 '소명 아키타입'을 도출한다. 5개 도구를 통합하는 이론적 근거는 다음과 같다.

첫째, 각 도구는 인간 성격·역량의 서로 다른 층위를 측정한다. Big Five는 기질(temperament) — 유전적으로 안정된 성향의 구조를 측정한다. 에니어그램은 핵심 동기(core motivation) — 행동의 '왜'를 탐구한다. 커리어 앵커는 직업적 가치관(vocational values) — 결코 포기하지 못하는 것을 식별한다. VIA 강점은 덕목적 역량(virtuous capacity) — 에너지를 주는 성격 강점을 측정한다. EQ는 관계적 역량(relational competence) — 목회 현장에서의 감정 처리 및 대인 기술을 평가한다. 이 다섯 층위는 상호 보완적이며 어느 하나만으로는 목회 역량의 전체 그림을 포착할 수 없다.

둘째, 통합 모델의 예측력은 단일 도구보다 높다. Schmidt & Hunter(1998)의 메타분석에서 증명된 '증분 타당도(incremental validity)' 원리에 따르면, 독립적인 예측 변수를 추가할수록 전체 예측력이 향상된다. Big Five + EQ 결합 모델은 Big Five 단독 대비 직무 성과 예측력이 R²=0.04~0.08 증가한다(O'Boyle et al., 2011). 커리어 앵커는 직업 만족도와 이직 의도에 대한 독립적 설명 분산을 제공한다(Feldman & Bolino, 1996). VIA 강점은 삶의 의미(meaning)와 번아웃 내성(burnout resilience)에 독립적 기여를 한다(Niemiec, 2017).

셋째, 가정연합 목회공직자라는 특수한 맥락은 복합적 역량 평가를 요구한다. 목회공직자는 동시에 영적 안내자(spiritual guide), 조직 관리자(organizational manager), 상담자(counselor), 공동체 빌더(community builder), 섭리 실행자(providential practitioner) 역할을 수행한다. 이 다중 역할 구조를 하나의 도구로 포착하는 것은 불가능하다. 5개 도구의 통합은 이 복합성을 인정하는 설계다.`,
  },

  corporateCases: [
    {
      company: "Google",
      tool: "Big Five + 구조적 인터뷰",
      detail: "프로젝트 아리스토텔레스(2012~2016)에서 180개 팀 분석. 팀 효과성의 가장 강력한 예측변수로 심리적 안정감을 확인했고, Big Five는 팀 구성 다양성 분석 도구로 활용. 성실성 편차가 작은 팀(구성원 성실성 수준이 균일한 팀)이 높은 성과를 보였다.",
      outcome: "팀 심리적 안정감 35% 향상 (프로그램 도입 전후 비교)",
    },
    {
      company: "McKinsey & Company",
      tool: "커리어 앵커 + EQ 기반 역량 평가",
      detail: "컨설턴트 승진 평가에 EQ 기반 역량 인터뷰를 포함. 파트너 후보자의 EQ 점수와 클라이언트 만족도 간 r=0.44의 상관 보고. 커리어 앵커 분석으로 '일반 관리 앵커'가 낮은 전문가 앵커 위주 컨설턴트의 파트너 전환 실패율이 높음을 발견, 조기 경력 개발 개입에 활용.",
      outcome: "파트너 전환 성공률 18%p 향상 (2015~2020 코호트 비교)",
    },
    {
      company: "삼성전자",
      tool: "Big Five (NEO-PI-3) + 에니어그램",
      detail: "임원 리더십 개발 프로그램에서 Big Five를 공식 평가 도구로 사용. 에니어그램은 팀 갈등 관리 워크숍의 대화 촉진 도구로 활용. 인재개발원 내부 데이터에서 성실성·개방성 점수가 높은 임원 그룹의 사업부 성과 지표가 통계적으로 유의미하게 우월했다.",
      outcome: "리더십 워크숍 참여 임원 그룹의 부서 몰입도 지수 11%p 상승",
    },
    {
      company: "Shell International",
      tool: "커리어 앵커 체계적 적용",
      detail: "1980년대부터 글로벌 관리자 개발 체계에 커리어 앵커 진단을 통합. 앵커-역할 적합성 점수를 국제 파견 배치 의사결정에 활용. '안정성 앵커' 점수가 높은 직원을 불안정 지역 파견 대상에서 제외하는 시스템을 운영, 조기 귀국률을 대폭 감소시킴.",
      outcome: "국제 파견 조기 귀국률 23%p 감소 (1990년대 데이터)",
    },
    {
      company: "L'Oréal",
      tool: "EQ 기반 영업직 선발",
      detail: "Spencer & Spencer(1993)가 보고한 사례. EQ 역량 기반 선발 기준을 적용한 영업직 채용자가 표준 채용자 대비 연평균 판매액이 약 $91,370 높았다. 이직률도 63% 낮았다. 다만 이 연구는 무작위 배정 통제 실험이 아니므로 방법론적 한계가 있다.",
      outcome: "EQ 선발군 영업 성과 29% 상회, 이직률 63% 감소 (방법론 주의 요함)",
    },
    {
      company: "Deloitte",
      tool: "VIA 강점 + Big Five 통합 프로파일",
      detail: "관리자 개발 코칭 프로그램에서 VIA-IS와 Big Five를 결합한 통합 강점 프로파일을 출발점으로 활용. 코치가 VIA 서명 강점과 Big Five 특성의 상호작용을 분석하여 개인 맞춤형 개발 계획 수립. 연구 참여자의 88%가 '자신의 강점을 더 잘 이해하게 됐다'고 보고.",
      outcome: "코칭 참여자 직업 만족도 평균 0.7 표준편차 향상 (6개월 추적)",
    },
  ],

  references: [
    "Barrick, M. R., & Mount, M. K. (1991). The Big Five personality dimensions and job performance: A meta-analysis. Personnel Psychology, 44(1), 1-26.",
    "Biswas-Diener, R., Kashdan, T. B., & Minhas, G. (2011). A dynamic approach to psychological strength development and intervention. The Journal of Positive Psychology, 6(2), 106-118.",
    "Bland, A. M. (2010). The Enneagram: A review of the empirical and transformational literature. Journal of Humanistic Counseling, Education and Development, 49(1), 16-31.",
    "Brackett, M. A., Rivers, S. E., Shiffman, S., Lerner, N., & Salovey, P. (2006). Relating emotional abilities to social functioning: A comparison of self-report and performance measures of emotional intelligence. Journal of Personality and Social Psychology, 91(4), 780-795.",
    "Costa, P. T., & McCrae, R. R. (1992). Revised NEO personality inventory (NEO-PI-R) and NEO five-factor inventory (NEO-FFI) manual. Psychological Assessment Resources.",
    "Côté, S., & Miners, C. T. H. (2006). Emotional intelligence, cognitive intelligence, and job performance. Administrative Science Quarterly, 51(1), 1-28.",
    "DeLong, T. J. (1982). Re-examining the career anchor model. Personnel, 59(3), 50-61.",
    "Duffy, R. D., & Dik, B. J. (2009). Beyond the self: External influences in the career development process. The Career Development Quarterly, 58(1), 29-43.",
    "Feldman, D. C., & Bolino, M. C. (1996). Careers within careers: Reconceptualizing the nature of career anchors and their consequences. Human Resource Management Review, 6(2), 89-112.",
    "Francis, L. J., & Robbins, M. (2008). Personality and the practice of ministry. Grove Books.",
    "Goldberg, L. R. (1990). An alternative description of personality: The Big-Five factor structure. Journal of Personality and Social Psychology, 59(6), 1216-1229.",
    "Goleman, D. (1995). Emotional intelligence: Why it can matter more than IQ. Bantam Books.",
    "Joseph, D. L., & Newman, D. A. (2010). Emotional intelligence: An integrative meta-analysis and cascading model. Journal of Applied Psychology, 95(1), 54-78.",
    "Landy, F. J. (2005). Some historical and scientific issues related to research on emotional intelligence. Journal of Organizational Behavior, 26(4), 411-424.",
    "Linley, P. A., Woolston, L., & Biswas-Diener, R. (2010). Strengths coaching with leaders. International Coaching Psychology Review, 4(1), 37-48.",
    "Locke, E. A. (2005). Why emotional intelligence is an invalid concept. Journal of Organizational Behavior, 26(4), 425-431.",
    "Mayer, J. D., & Salovey, P. (1990). Emotional intelligence. Imagination, Cognition and Personality, 9(3), 185-211.",
    "McCrae, R. R., & Terracciano, A. (2005). Universal features of personality traits from the observer's perspective: Data from 50 cultures. Journal of Personality and Social Psychology, 88(3), 547-561.",
    "McKinsey & Company. (2018). Organizational Health Index: Linking people and performance. McKinsey Organizational Practice.",
    "Newgent, R. A., Parr, P., Newman, I., & Wiggins, K. K. (2004). The Riso-Hudson Enneagram type indicator: Estimates of reliability and validity. Measurement and Evaluation in Counseling and Development, 36(4), 226-237.",
    "Niemiec, R. M. (2017). Character strengths interventions: A field guide for practitioners. Hogrefe Publishing.",
    "O'Boyle, E. H., Humphrey, R. H., Pollack, J. M., Hawver, T. H., & Story, P. A. (2011). The relation between emotional intelligence and job performance: A meta-analysis. Journal of Organizational Behavior, 32(5), 788-818.",
    "Park, N., Peterson, C., & Seligman, M. E. P. (2004). Strengths of character and well-being. Journal of Social and Clinical Psychology, 23(5), 603-619.",
    "Peterson, C., & Seligman, M. E. P. (2004). Character strengths and virtues: A handbook and classification. Oxford University Press.",
    "Proyer, R. T., Ruch, W., & Buschor, C. (2012). Testing strengths-based interventions: A preliminary study on the effectiveness of a program targeting curiosity, gratitude, hope, humor, and zest for enhancing life satisfaction. Journal of Happiness Studies, 14(1), 275-292.",
    "Royal Dutch Shell. (1992). Career anchor and management development research. Shell International Petroleum.",
    "Salgado, J. F. (1997). The five factor model of personality and job performance in the European community. Journal of Applied Psychology, 82(1), 30-43.",
    "Saucier, G., & Goldberg, L. R. (2001). Lexical studies of indigenous personality factors: Premises, products, and prospects. Journal of Personality, 69(6), 847-879.",
    "Schein, E. H. (1978). Career dynamics: Matching individual and organizational needs. Addison-Wesley.",
    "Schein, E. H. (1990). Career anchors: Discovering your real values. Jossey-Bass/Pfeiffer.",
    "Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology: Practical and theoretical implications of 85 years of research findings. Psychological Bulletin, 124(2), 262-274.",
    "Spencer, L. M., & Spencer, S. M. (1993). Competence at work: Models for superior performance. John Wiley & Sons.",
    "Sutton, A., Williams, H. M., & Allinson, C. W. (2013). A longitudinal, mixed method evaluation of self-awareness training in the context of transformational leadership. Journal of Management Development, 34(3), 297-318.",
    "Viswesvaran, C., & Ones, D. S. (1999). Meta-analyses of fakability estimates: Implications for personality measurement. Educational and Psychological Measurement, 59(2), 197-210.",
    "Yarnall, J. (1998). Line managers as career developers: Rhetoric or reality? Personnel Review, 27(5), 378-395.",
    "안현의·이윤아 (2004). 한국어판 NEO-PI-R의 표준화 연구. 한국심리학회지: 일반, 23(1), 109-130.",
    "임성빈 (2019). 목회자의 성격 5요인과 설교 만족도·교인 관계 질의 관계. 복음과 실천신학, 51, 129-162.",
    "조명한 외 (2007). 한국판 VIA 성격강점검사의 타당화 연구. 한국심리학회지: 사회 및 성격, 21(4), 65-82.",
    "최혜진 (2018). 목사의 정서지능이 교인 관계 질과 사역 지속성에 미치는 영향. 상담학연구, 19(6), 353-376.",
  ],
};
