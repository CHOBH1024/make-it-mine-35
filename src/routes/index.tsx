import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@/components/diagnosis/Icon";
import { HomeView } from "@/components/diagnosis/HomeView";
import { DiagnosisView } from "@/components/diagnosis/DiagnosisView";
import { AnalysisView } from "@/components/diagnosis/AnalysisView";
import { LibraryView } from "@/components/diagnosis/LibraryView";
import { GuideView } from "@/components/diagnosis/GuideView";
import { ValidityView } from "@/components/diagnosis/ValidityView";
import { archetypes } from "@/lib/data";
import { decodeInputs } from "@/lib/share";
import type { Inputs, Archetype } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "가정연합 목회공직자 유형진단 | Cheon Il Guk Pastoral Archetype" },
      { name: "description", content: "에니어그램, Big 5, 커리어 앵커, VIA 강점검사를 통합한 목회공직자 소명 아키타입 진단 도구" },
    ],
  }),
});

function Index() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const emptyInputs = (): Inputs => ({
    enneagram: "",
    big5: { openness: "", conscientiousness: "", extraversion: "", agreeableness: "", neuroticism: "" },
    anchor: "",
    via: [],
    eq: { awareness: "", regulation: "", motivation: "", empathy: "", social: "" },
  });

  const [profileInputs, setProfileInputs] = useState<[Inputs, Inputs, Inputs]>([
    emptyInputs(), emptyInputs(), emptyInputs(),
  ]);
  const [activeProfile, setActiveProfile] = useState(0);
  const inputs = profileInputs[activeProfile];
  const setInputs = useCallback<React.Dispatch<React.SetStateAction<Inputs>>>(
    (updater) => {
      setProfileInputs(prev => {
        const current = prev[activeProfile];
        const newVal = typeof updater === "function" ? (updater as (p: Inputs) => Inputs)(current) : updater;
        const next = [...prev] as [Inputs, Inputs, Inputs];
        next[activeProfile] = newVal;
        return next;
      });
    },
    [activeProfile]
  );

  const [results, setResults] = useState<Archetype[]>([]);

  const calculateResults = (targetInputs: Inputs): Archetype[] => {
    const scores = archetypes.map((t) => {
      let score = 0;
      if (t.traits.enneagram.includes(targetInputs.enneagram)) score += 3;
      if (t.traits.anchor.includes(targetInputs.anchor)) score += 2;
      const targetBig5 = t.traits.big5;
      if (targetInputs.big5[targetBig5] === "High") score += 2;
      const viaMatches = targetInputs.via.filter((v) => t.traits.via.includes(v)).length;
      score += viaMatches * 1.5;
      // EQ bonus: leadership archetypes benefit from high motivation & empathy
      if (targetInputs.eq) {
        if (targetInputs.eq.motivation === "High") score += 0.5;
        if (targetInputs.eq.empathy === "High") score += 0.5;
        if (targetInputs.eq.awareness === "High") score += 0.3;
      }
      return { ...t, score };
    });
    scores.sort((a, b) => (b.score || 0) - (a.score || 0));
    return scores;
  };

  const handleAnalyze = (manualInputs?: Inputs) => {
    const targetInputs = manualInputs || inputs;
    const scores = calculateResults(targetInputs);
    setResults(scores);
    setActiveTab("analysis");
    window.scrollTo(0, 0);
  };

  // Handle shared URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (encoded) {
      const decoded = decodeInputs(encoded);
      if (decoded) {
        setProfileInputs(prev => {
          const next = [...prev] as [Inputs, Inputs, Inputs];
          next[0] = decoded;
          return next;
        });
        const scores = calculateResults(decoded);
        setResults(scores);
        setActiveTab("analysis");
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  const handleRestore = (savedInputs: Inputs) => {
    setInputs(savedInputs);
    const scores = calculateResults(savedInputs);
    setResults(scores);
    if (activeTab !== "analysis") {
      setActiveTab("analysis");
    }
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-md hover:opacity-90 transition-colors">
              <Icon name="User" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary font-serif leading-none tracking-tight">
                가정연합 목회공직자 유형진단
              </h1>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-bold">
                Cheon Il Guk Pastoral Archetype v5
              </span>
            </div>
          </div>
          <nav className="hidden lg:flex gap-8">
            {(["home", "diagnosis", "analysis", "library", "guide", "validity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-6 text-sm font-bold tracking-wide transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "home"
                  ? "소명의 여정"
                  : tab === "diagnosis"
                    ? "성향 진단"
                    : tab === "analysis"
                      ? "종합 분석 결과"
                      : tab === "library"
                        ? "아키타입 도서관"
                        : tab === "guide"
                          ? "지표 가이드"
                          : "학술 타당성"}
              </button>
            ))}
          </nav>
        </div>
        {/* 모바일 가로 스크롤 탭바 */}
        <div className="lg:hidden border-t border-border bg-card/95">
          <div className="flex overflow-x-auto scrollbar-none">
            {(["home", "diagnosis", "analysis", "library", "guide", "validity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-3 text-xs font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {tab === "home"
                  ? "소명의 여정"
                  : tab === "diagnosis"
                    ? "성향 진단"
                    : tab === "analysis"
                      ? "종합 분석"
                      : tab === "library"
                        ? "도서관"
                        : tab === "guide"
                          ? "지표 가이드"
                          : "학술 타당성"}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {activeTab === "home" && <HomeView onStart={() => setActiveTab("diagnosis")} />}
        {activeTab === "diagnosis" && (
          <DiagnosisView
            inputs={inputs}
            setInputs={setInputs}
            onFinish={handleAnalyze}
            allProfiles={profileInputs}
            activeProfile={activeProfile}
            onSwitchProfile={setActiveProfile}
          />
        )}
        {activeTab === "analysis" && (
          <AnalysisView results={results} inputs={inputs} onRestore={handleRestore} />
        )}
        {activeTab === "library" && <LibraryView />}
        {activeTab === "guide" && <GuideView />}
        {activeTab === "validity" && <ValidityView />}
      </main>
      <footer className="bg-secondary border-t border-border py-12 text-center text-muted-foreground text-sm font-serif">
        Cheon Il Guk Public Official Assessment Tool © 2024
      </footer>
    </div>
  );
}
