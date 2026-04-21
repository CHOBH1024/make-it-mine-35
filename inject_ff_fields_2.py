import re

file_path = "d:/OD/OneDrive/Anti/make-it-mine-35/src/lib/data.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_fields = """
    managementStyle: {
        organizationManagement: "자율성 기반의 목표 지향적 관리",
        teamBuilding: "다양한 성향의 실무자들을 적재적소에 배치하는 팀 구성",
        selectionAndConcentration: "행사보다는 내적 성장과 식구 상담에 우선순위 배정"
    },
    resilienceAndPsychology: {
        psychologicalTrait: "강한 책임감 이면의 내적 완벽주의",
        resilienceLevel: "높음 (다만 한계치 초과 시 급격한 번아웃 위험)",
        recoveryMethod: "자연 속에서의 기도 및 원리 말씀 깊이 묵상하기"
    },
    wordApproach: {
        strengths: "말씀의 본질을 꿰뚫고 체계적으로 구조화하여 전달하는 능력",
        cautions: "지나치게 논리적 접근으로 인해 식구들의 감정적 수용이 어려울 수 있음"
    },
    leadershipAndMentoring: {
        mentoringStyle: "스스로 해답을 찾도록 유도하는 코칭(Coaching) 리더십",
        feedbackStyle: "결과보다는 과정을 칭찬하며, 따뜻하지만 단호한 피드백 제공"
    },"""

# Insert new fields after 'id: \d+,'
content = re.sub(r'(id:\s*\d+,)', r'\1' + new_fields, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected additional Family Federation fields into data.ts")
