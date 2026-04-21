import re

file_path = "d:/OD/OneDrive/Anti/make-it-mine-35/src/lib/data.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_fields = """
    heartBalance: {
        parent: 80,
        teacher: 70,
        owner: 90,
        advice: "부모의 심정과 스승의 심정의 조화가 필요합니다. 식구들을 따뜻하게 품으면서도 원리적 기준을 세워주세요."
    },
    burnoutDefense: {
        type: "기도 및 훈독 집중형",
        description: "스트레스가 극에 달할 때 홀로 정성을 들이며 영적 에너지를 회복하는 타입입니다.",
        historicalExample: "참아버님께서 댄버리 수감 시절 옥중에서도 평상심을 잃지 않으시고 오히려 다른 수감자들을 품으셨던 일화."
    },
    coupleSynergy: {
        matchType: "전도-관리 상호 보완형",
        description: "한 분이 외부 전도 활동에 집중할 때, 다른 분이 내부 식구 관리를 전담하는 완벽한 콤비네이션입니다.",
        weeklyReading: "참부모경 제4편 인류 구원과 평화세계 신형 - 제2장 축복가정의 가치",
        communicationTip: "서로의 다름을 '틀림'이 아닌 '보완'으로 인정하고, 주간 훈독회 시간에 서로의 수고를 칭찬해주세요."
    },
    generationBridge: {
        mzPerception: "목사님의 열정은 본받고 싶으나, 때로는 일방적인 소통으로 느껴질 수 있습니다.",
        advice: "지시나 설명보다는 '경청'과 '질문'으로 대화를 시작해보세요.",
        icebreaker: "'요즘 가장 고민되는 게 뭐야?' 보다는 '최근에 가장 재밌었던 일이 뭐였어?'로 시작해보세요."
    },
    multiculturalGuide: {
        approachStyle: "감정적 공감 최우선",
        tips: [
            "언어의 한계로 표현하지 못하는 감정을 먼저 읽어주세요.",
            "신앙적 잣대로 평가하기 전에 타향살이의 외로움을 위로해주세요.",
            "문화적 차이를 존중하며, 한국식 문화를 일방적으로 강요하지 마세요."
        ]
    },"""

# Insert new fields after 'id: \d+,'
content = re.sub(r'(id:\s*\d+,)', r'\1' + new_fields, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected Family Federation fields into data.ts")
