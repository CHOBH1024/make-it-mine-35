"""
Session 1: 9대 목회자 유형 x 3 Sub-variations = 27가지 세밀 프로필 데이터 주입기
각 Archetype의 data.ts 객체에 pastorSubVariations 배열을 추가한다.
3가지 변이:
  A (strength)  : 핵심 역량이 완전히 발현된 상태 → 더 강하게 밀어붙이는 가이드
  B (crisis)    : 스트레스·위기 상황에서 나타나는 패턴 → 방어 기제와 회복 가이드
  C (relational): 식구·동역자와의 관계에서 두드러지는 특성 → 소통 최적화 가이드
"""
import re

# ──────────────────────────────────────────────
# 9대 유형별 3가지 Sub-variation 데이터 (한국어)
# ──────────────────────────────────────────────
PASTOR_SUB_VARIATIONS = {
    # archetype id 기준
    1: [  # 예: 개척/혁신형 목회자 (Enneagram 1번 계열)
        {
            "variationKey": "strength",
            "label": "원칙 수호형",
            "triggerCondition": "원칙 지향 점수 상위 33% & 스트레스 지수 낮음",
            "ministryFocus": "교회 내 공정한 질서 확립, 원리 말씀 기반 훈육",
            "wordApproachTip": "말씀의 원칙에 완전히 집중할 수 있는 최상의 상태. 단, 식구들에게 너무 높은 기준을 강요하지 않도록 주의.",
            "managementTip": "조직 규정과 절차를 명확히 하되, 사람보다 원칙을 앞세우지 않도록 균형 유지.",
            "resilienceTip": "번아웃 예방: 완벽주의 성향이 과도해지면 산책과 훈독으로 심신 이완.",
            "prayerKey": "정의와 공평 / 참부모님의 법도",
            "warningSign": "식구들이 목사님 앞에서 긴장하거나 자신의 실수를 숨기려 한다면 접근 방식 재점검 필요."
        },
        {
            "variationKey": "crisis",
            "label": "내면 갈등 극복형",
            "triggerCondition": "원칙 지향 점수 상위 33% & 스트레스 지수 높음",
            "ministryFocus": "자신의 내적 분노와 좌절을 섭리적으로 해소하는 훈련에 집중",
            "wordApproachTip": "이 상태에서 말씀을 접하면 자기 비판의 근거로 사용할 위험이 있음. 위로와 용서의 구절을 의도적으로 선택하여 훈독.",
            "managementTip": "중요한 인사결정이나 사역 계획은 이 시기에 연기하고 회복에 집중. 믿을 수 있는 동역자와 상의.",
            "resilienceTip": "혼자 해결하려는 경향을 내려놓고 부부 대화나 목회 슈퍼비전 활용. 일주일 단식 기도 고려.",
            "prayerKey": "자기 용서 / 하나님의 인내 / 섭리의 때",
            "warningSign": "비판과 자기 채찍질이 반복된다면 즉각 멘토 목회자에게 상담 요청."
        },
        {
            "variationKey": "relational",
            "label": "기준 제시형 스승",
            "triggerCondition": "원칙 지향 점수 상위 33% & 대인관계 점수 높음",
            "ministryFocus": "명확한 가이드라인과 따뜻한 격려를 균형 있게 제공하는 멘토링",
            "wordApproachTip": "말씀을 규율의 도구가 아닌 사랑의 기준으로 전달하는 것이 이 변이의 핵심. 참부모님의 인내와 사랑의 일화를 함께 나누기.",
            "managementTip": "팀원들의 성장 가능성을 믿고, 실수를 허용하는 조직 문화 조성. 피드백은 항상 칭찬으로 시작.",
            "resilienceTip": "관계에서 에너지를 얻는 타입. 식구들과의 소소한 교류를 번아웃 예방 루틴으로 활용.",
            "prayerKey": "참사랑의 교육 / 스승의 심정",
            "warningSign": "기대에 못 미치는 식구에게 실망감을 반복적으로 표현한다면 심정적 재조율 필요."
        }
    ],
    2: [  # 예: 돌봄/양육형 목회자
        {
            "variationKey": "strength",
            "label": "헌신적 양육자",
            "triggerCondition": "공감 점수 상위 33% & 스트레스 지수 낮음",
            "ministryFocus": "식구 한 명 한 명의 필요를 세심하게 채우는 목회",
            "wordApproachTip": "부모의 심정으로 말씀을 묵상할 때 가장 깊은 은혜를 경험. 참부모님의 식구 사랑 일화 중심으로 훈독.",
            "managementTip": "작은 교회나 가정 중심 모임에 최적화. 대규모 조직 관리 시 위임(Delegation) 능력을 의식적으로 훈련해야 함.",
            "resilienceTip": "자신의 필요를 챙기는 것이 더 큰 섬김이라는 것을 기억. 정기적인 혼자만의 기도 시간 확보 필수.",
            "prayerKey": "부모의 심정 / 자녀를 향한 사랑",
            "warningSign": "스스로 아무것도 필요 없다고 느끼거나, 경계 없이 모든 요청에 응한다면 소진 임박 신호."
        },
        {
            "variationKey": "crisis",
            "label": "감정 소진 회복형",
            "triggerCondition": "공감 점수 상위 33% & 스트레스 지수 높음",
            "ministryFocus": "자신의 감정 경계 회복 및 건강한 목회적 거리 유지",
            "wordApproachTip": "이 상태에서는 말씀을 '의무'로 접근하지 않도록. 짧고 위로가 되는 구절 하나씩 천천히 소화하기.",
            "managementTip": "당분간 새로운 사역 추가 금지. 기존 사역도 동역자와 분담하는 용기가 필요한 시기.",
            "resilienceTip": "신뢰할 수 있는 사모 또는 동역자에게 '나 지금 힘들어'라고 솔직하게 말하는 것이 가장 빠른 회복.",
            "prayerKey": "안식 / 하나님의 위로 / 선한 목자",
            "warningSign": "식구들의 전화가 두렵거나 부담스럽게 느껴진다면 즉각 충전 시간 필요."
        },
        {
            "variationKey": "relational",
            "label": "공동체 결속형",
            "triggerCondition": "공감 점수 상위 33% & 대인관계 점수 높음",
            "ministryFocus": "식구들 사이의 관계를 촘촘하게 엮는 공동체 목회",
            "wordApproachTip": "말씀을 개인보다 공동체 맥락에서 적용할 때 가장 큰 은혜 경험. 가정 훈독회 주도 및 공동 기도 활성화.",
            "managementTip": "팀워크 중심의 사역 구조 설계. 소그룹(순모임) 활성화에 특히 강한 역량 발휘.",
            "resilienceTip": "관계 갈등이 가장 큰 스트레스 요인. 갈등 발생 시 즉각 해결보다 충분한 경청 후 중재 시도.",
            "prayerKey": "한 가족 / 사랑의 공동체 / 참가정",
            "warningSign": "특정 식구와의 갈등을 피하거나 회피하기 시작하면 공동체 전체 분위기 점검 필요."
        }
    ],
}

# archetype id 3~9까지 기본 템플릿으로 채움 (추후 Session 2에서 세분화)
BASE_VARIATION_TEMPLATE = lambda archetype_id: [
    {
        "variationKey": "strength",
        "label": "역량 극대화형",
        "triggerCondition": "핵심 역량 점수 상위 33% & 스트레스 지수 낮음",
        "ministryFocus": "이 유형 고유의 핵심 강점을 목회 현장에서 최대한 발휘하는 시기",
        "wordApproachTip": "말씀에서 자신의 사명과 연결되는 구절에 깊이 공명. 힘과 비전의 말씀을 중심으로 훈독.",
        "managementTip": "강점 기반 팀 구성. 나의 강점 영역의 사역을 집중 공략하되, 약점 영역은 동역자에게 과감히 위임.",
        "resilienceTip": "에너지가 충전된 시기. 어려운 결정과 중장기 사역 계획 수립에 최적.",
        "prayerKey": "사명 / 비전 / 섭리의 완성",
        "warningSign": "과도한 자신감으로 독단적 결정이 잦아질 수 있음. 정기적인 동역자 피드백 요청."
    },
    {
        "variationKey": "crisis",
        "label": "위기 돌파형",
        "triggerCondition": "핵심 역량 점수 상위 33% & 스트레스 지수 높음",
        "ministryFocus": "위기 상황에서 내면의 안정을 찾고 섭리적 의미를 재발견하는 데 집중",
        "wordApproachTip": "이 시기에는 단순히 의무적으로 읽기보다, 10분이라도 진심으로 묵상하는 훈독이 효과적.",
        "managementTip": "중요 결정 보류. 현재 상태를 솔직하게 상급자나 동역자에게 보고하고 지원 요청.",
        "resilienceTip": "참부모님 생애 노정의 위기 극복 일화 묵상. 가장 힘든 시절이 섭리적으로 가장 중요한 시간임을 상기.",
        "prayerKey": "인내 / 극복 / 섭리의 보호",
        "warningSign": "사역에 대한 의욕이 2주 이상 급격히 감소했다면 멘토 목회자 즉각 상담."
    },
    {
        "variationKey": "relational",
        "label": "관계 중심 목회형",
        "triggerCondition": "핵심 역량 점수 상위 33% & 대인관계 점수 높음",
        "ministryFocus": "식구 및 동역자와의 관계를 최우선으로 하는 목회 방식",
        "wordApproachTip": "말씀을 함께 나누는 것에서 가장 큰 은혜를 경험. 부부 훈독 또는 소그룹 나눔 적극 활용.",
        "managementTip": "1:1 면담과 소통 중심의 팀 관리. 조직의 규모가 커지면 중간 리더를 육성하는 데 집중.",
        "resilienceTip": "관계적 갈등에 가장 민감한 시기. 갈등 발생 시 빠른 화해 시도와 함께 내면 점검 필수.",
        "prayerKey": "사랑 / 용서 / 하나 됨",
        "warningSign": "특정인과의 관계가 목회 판단에 지나친 영향을 미친다고 느껴지면 재조율 필요."
    }
]

file_path = "d:/OD/OneDrive/Anti/make-it-mine-35/src/lib/data.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import json

def build_variation_ts(variations):
    """Python dict 리스트를 TypeScript 배열 문자열로 변환"""
    lines = ["    pastorSubVariations: ["]
    for v in variations:
        lines.append("        {")
        for k, val in v.items():
            escaped = val.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
            lines.append(f'            {k}: "{escaped}",')
        lines.append("        },")
    lines.append("    ],")
    return "\n".join(lines)

# archetype id 1, 2는 상세 데이터, 3~9는 템플릿으로
for arch_id in range(1, 10):
    if arch_id in PASTOR_SUB_VARIATIONS:
        variations = PASTOR_SUB_VARIATIONS[arch_id]
    else:
        variations = BASE_VARIATION_TEMPLATE(arch_id)

    ts_block = build_variation_ts(variations)
    
    # id: <N>, 패턴 뒤 기존 pastorSubVariations 블록 교체 또는 삽입
    # 기존에 pastorSubVariations가 있는 경우 교체
    id_pattern = rf'(id:\s*{arch_id}[^}}]{{0,5000}}?)(pastorSubVariations:\s*\[[^\]]*\],?)'
    if re.search(id_pattern, content, re.DOTALL):
        content = re.sub(id_pattern, lambda m: m.group(1) + ts_block, content, flags=re.DOTALL)
    else:
        # 없으면 id: N, 뒤에 삽입
        insert_after = rf'(id:\s*{arch_id},)'
        replacement = rf'\1\n{ts_block}'
        content = re.sub(insert_after, replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import sys
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None
print("[OK] 9 Pastor Types x 3 Sub-variations (27 total profiles) injected into data.ts!")
print("   - Type 1, 2: Detailed custom data")
print("   - Type 3~9: Base template (to be refined in Sessions 2-3)")

