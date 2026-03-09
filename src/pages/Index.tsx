import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const FOREST_BG = "https://cdn.poehali.dev/projects/79e4e100-d1c2-471c-9ef6-625d5613c665/files/f1de3835-ac99-46e7-ad98-c681297bac6d.jpg";

const MOCK_RESULT = {
  name: "Лотос Комарова",
  latinName: "Nelumbo komarovii",
  confidence: 94,
  family: "Лотосовые (Nelumbonaceae)",
  description:
    "Реликтовое растение третичного периода, занесённое в Красную книгу России. Один из символов Приморского края. Цветки крупные, розово-белые, диаметром до 30 см, с тонким нежным ароматом.",
  characteristics: [
    { icon: "Ruler", label: "Высота", value: "до 120 см над водой" },
    { icon: "Calendar", label: "Цветение", value: "июль — август" },
    { icon: "Droplets", label: "Среда", value: "пресноводные водоёмы" },
    { icon: "ShieldAlert", label: "Статус", value: "Красная книга РФ" },
  ],
  habitat:
    "Встречается на озёрах Приханкайской низменности, преимущественно в окрестностях озера Ханка. Также известен на реках Уссури, Илистой и Мельгуновке.",
  tags: ["Водное", "Реликт", "Охраняемое", "Цветковое"],
};

type AppState = "idle" | "preview" | "analyzing" | "result";

export default function Index() {
  const [state, setState] = useState<AppState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setState("preview");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAnalyze = () => {
    setState("analyzing");
    setTimeout(() => setState("result"), 2800);
  };

  const handleReset = () => {
    setImageUrl(null);
    setState("idle");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-forest-900">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FOREST_BG})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-forest-900/80 via-forest-900/60 to-forest-900/95" />
      <div className="fixed inset-0 texture-overlay pointer-events-none" />

      {/* Decorative leaves */}
      <div className="fixed top-0 left-0 w-64 h-64 opacity-10 pointer-events-none animate-leaf-sway" style={{ transformOrigin: "top left" }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 190 Q60 20 190 10 Q120 80 80 140 Q50 170 10 190Z" fill="#5c7a3e" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-80 h-80 opacity-10 pointer-events-none" style={{ transform: "rotate(180deg)" }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 190 Q60 20 190 10 Q120 80 80 140 Q50 170 10 190Z" fill="#8aab6a" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-moss flex items-center justify-center text-lg">
              🌿
            </div>
            <div>
              <h1 className="font-cormorant text-xl font-semibold text-cream tracking-wide leading-none">
                Флора Приморья
              </h1>
              <p className="text-xs text-muted-foreground font-golos mt-0.5">
                определитель растений
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-golos hidden sm:block">
            Приморский край · Дальний Восток
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">

          {/* Hero title */}
          {state === "idle" && (
            <div className="text-center mb-10 animate-fade-in">
              <h2 className="font-cormorant text-5xl sm:text-7xl font-light text-cream mb-3 leading-tight">
                Узнайте растение
              </h2>
              <p className="font-golos text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
                Сфотографируйте растение Приморья и получите подробное описание за секунды
              </p>
            </div>
          )}

          {/* Upload zone */}
          {(state === "idle" || state === "preview") && (
            <div className="w-full max-w-lg">
              {state === "idle" ? (
                <div
                  className={`upload-zone rounded-2xl p-10 text-center cursor-pointer glass-card animate-scale-in ${isDragging ? "dragging" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-moss/20 border border-moss/40 flex items-center justify-center">
                      <Icon name="Camera" size={28} className="text-moss-light" />
                    </div>
                    <div>
                      <p className="font-cormorant text-2xl text-cream font-medium mb-1">
                        Загрузите фото растения
                      </p>
                      <p className="font-golos text-sm text-muted-foreground">
                        Перетащите файл сюда или нажмите для выбора
                      </p>
                      <p className="font-golos text-xs text-muted-foreground/60 mt-2">
                        JPG, PNG, WEBP · до 20 МБ
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
                  <div className="relative">
                    <img
                      src={imageUrl!}
                      alt="Загруженное растение"
                      className="w-full h-72 object-cover"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-forest-900/80 border border-border flex items-center justify-center hover:bg-forest-800 transition-colors"
                    >
                      <Icon name="X" size={14} className="text-muted-foreground" />
                    </button>
                    <div className="absolute bottom-3 left-3 result-badge rounded-full px-3 py-1 text-xs font-golos text-moss-light">
                      Фото загружено
                    </div>
                  </div>
                  <div className="p-5">
                    <button
                      onClick={handleAnalyze}
                      className="w-full bg-moss hover:bg-moss-dark text-white font-golos font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Icon name="Scan" size={18} />
                      Определить растение
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analyzing state */}
          {state === "analyzing" && (
            <div className="glass-card rounded-2xl p-10 text-center max-w-sm w-full animate-scale-in">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-moss/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-moss animate-spin" />
                <div className="absolute inset-3 rounded-full bg-moss/10 flex items-center justify-center text-2xl">
                  🔬
                </div>
              </div>
              <p className="font-cormorant text-2xl text-cream mb-2">Анализирую...</p>
              <p className="font-golos text-sm text-muted-foreground">
                Сравниваю с базой растений Приморского края
              </p>
              <div className="mt-6 flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-moss animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {state === "result" && (
            <div className="w-full max-w-2xl animate-fade-in">
              {/* Confidence banner */}
              <div className="glass-card rounded-2xl overflow-hidden mb-4">
                <div className="flex items-stretch">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Растение"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-cover shrink-0"
                    />
                  )}
                  <div className="p-5 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-golos result-badge rounded-full px-2 py-0.5 text-moss-light">
                        Совпадение {MOCK_RESULT.confidence}%
                      </span>
                    </div>
                    <h3 className="font-cormorant text-2xl sm:text-3xl text-cream font-semibold leading-tight">
                      {MOCK_RESULT.name}
                    </h3>
                    <p className="font-golos text-sm text-muted-foreground italic mt-0.5">
                      {MOCK_RESULT.latinName}
                    </p>
                    <p className="font-golos text-xs text-muted-foreground/70 mt-1">
                      {MOCK_RESULT.family}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {MOCK_RESULT.tags.map((tag) => (
                        <span key={tag} className="text-xs font-golos px-2 py-0.5 rounded-full bg-forest-700/60 text-moss-light border border-moss/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in animate-delay-100" style={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="BookOpen" size={16} className="text-moss-light" />
                  <h4 className="font-cormorant text-lg text-cream font-semibold">Описание</h4>
                </div>
                <p className="font-golos text-sm text-foreground/80 leading-relaxed">
                  {MOCK_RESULT.description}
                </p>
              </div>

              {/* Characteristics */}
              <div className="glass-card rounded-2xl p-5 mb-4 animate-fade-in animate-delay-200" style={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Leaf" size={16} className="text-moss-light" />
                  <h4 className="font-cormorant text-lg text-cream font-semibold">Характеристики</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_RESULT.characteristics.map((c) => (
                    <div key={c.label} className="bg-forest-800/50 rounded-xl p-3 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name={c.icon} fallback="Leaf" size={13} className="text-moss-light" />
                        <span className="text-xs font-golos text-muted-foreground">{c.label}</span>
                      </div>
                      <p className="text-sm font-golos text-cream font-medium">{c.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habitat */}
              <div className="glass-card rounded-2xl p-5 mb-5 animate-fade-in animate-delay-300" style={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="MapPin" size={16} className="text-moss-light" />
                  <h4 className="font-cormorant text-lg text-cream font-semibold">Места произрастания</h4>
                </div>
                <p className="font-golos text-sm text-foreground/80 leading-relaxed">
                  {MOCK_RESULT.habitat}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 animate-fade-in animate-delay-400" style={{ opacity: 0 }}>
                <button
                  onClick={handleReset}
                  className="flex-1 border border-border bg-transparent hover:bg-forest-800/50 text-foreground font-golos font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <Icon name="RotateCcw" size={15} />
                  Новое фото
                </button>
                <button className="flex-1 bg-moss hover:bg-moss-dark text-white font-golos font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:scale-[1.02]">
                  <Icon name="Share2" size={15} />
                  Поделиться
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-4 px-6">
          <p className="text-xs text-muted-foreground/50 font-golos">
            База данных: более 2 500 видов растений Приморского края
          </p>
        </footer>
      </div>
    </div>
  );
}