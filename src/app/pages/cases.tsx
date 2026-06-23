import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "../components/header";
import { BottomNav } from "../components/bottom-nav";
import {
  Upload,
  Link as LinkIcon,
  Check,
  FileText,
  Coins,
  ChevronRight,
  Star,
  Clock,
  Users,
  X,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../context/store-context";

/* ─── Briefing data per category ─────────────────────────────────────── */
const briefings: Record<
  string,
  {
    title: string;
    emoji: string;
    color: string;
    difficulty: string;
    difficultyColor: string;
    points: number;
    duration: string;
    participants: string;
    description: string;
    objective: string;
    requirements: string[];
    tips: string[];
    deliverables: string[];
  }
> = {
  "ux-strategy": {
    title: "UX Strategy",
    emoji: "🎯",
    color: "from-pink-500 to-rose-600",
    difficulty: "Avançado",
    difficultyColor: "bg-red-100 text-red-600",
    points: 100,
    duration: "7–14 dias",
    participants: "182",
    description:
      "Escolha uma empresa real (pode ser uma startup ou grande empresa) e elabore uma estratégia de UX completa. Seu trabalho deve identificar oportunidades de melhoria na experiência do usuário e propor um roadmap de implementação com prioridades claras.",
    objective:
      "Demonstrar capacidade de pensar estrategicamente em UX, conectando os objetivos do negócio às necessidades reais dos usuários.",
    requirements: [
      "Análise do produto/serviço atual (pontos fortes e fracos)",
      "Pesquisa de mercado e análise de concorrentes",
      "Definição de personas estratégicas (mínimo 2)",
      "Mapa de oportunidades priorizado",
      "Roadmap de UX com 3 horizontes de tempo",
      "Métricas de sucesso (KPIs de UX)",
    ],
    tips: [
      "Use o Business Model Canvas como ponto de partida",
      "Não tente melhorar tudo — foque nas 3 maiores dores",
      "Inclua dados reais sempre que possível",
    ],
    deliverables: [
      "Apresentação em PDF ou Figma (max 20 slides)",
      "Documento de estratégia (word/notion)",
    ],
  },
  "ux-research": {
    title: "UX Research",
    emoji: "🔬",
    color: "from-purple-500 to-pink-500",
    difficulty: "Intermediário",
    difficultyColor: "bg-purple-100 text-purple-600",
    points: 100,
    duration: "5–10 dias",
    participants: "247",
    description:
      "Conduza uma pesquisa com usuários reais sobre um produto digital de sua escolha. Aplique pelo menos 2 métodos de pesquisa distintos e apresente insights acionáveis que possam guiar decisões de design.",
    objective:
      "Praticar a aplicação de métodos de pesquisa qualitativa e quantitativa, e sintetizar dados em insights claros e acionáveis.",
    requirements: [
      "Plano de pesquisa com objetivo e perguntas-guia",
      "Aplicação de 2+ métodos (entrevista, survey, shadowing, etc.)",
      "Mínimo de 5 participantes por método qualitativo",
      "Síntese dos dados (affinity map, journey map, etc.)",
      "Relatório de insights com nível de confiança",
      "Recomendações de design baseadas na pesquisa",
    ],
    tips: [
      "Entreviste usuários reais — não amigos e família",
      "Grave as entrevistas (com consentimento) para não perder nuances",
      "Separe observação de interpretação nos seus anotações",
    ],
    deliverables: [
      "Relatório de pesquisa em PDF",
      "Arquivo raw data (transcrições/respostas)",
    ],
  },
  writing: {
    title: "UX Writing",
    emoji: "✍️",
    color: "from-blue-500 to-purple-500",
    difficulty: "Iniciante",
    difficultyColor: "bg-blue-100 text-blue-600",
    points: 100,
    duration: "3–7 dias",
    participants: "316",
    description:
      "Escolha um aplicativo com problemas de microcopy e reescreva os textos de um fluxo completo (ex: onboarding, checkout, erro). O objetivo é melhorar clareza, tom de voz e taxa de conversão.",
    objective:
      "Aplicar os princípios de UX Writing para criar microcopy claro, humano e alinhado com a marca, que guie o usuário com confiança.",
    requirements: [
      "Screenshots do fluxo original com análise crítica",
      "Definição do tom de voz e princípios de escrita",
      "Reescrita completa do fluxo escolhido",
      "Justificativa para cada decisão de copy",
      "Comparativo antes x depois",
      "Métricas de sucesso propostas",
    ],
    tips: [
      "Foque em um fluxo específico — não tente melhorar o app inteiro",
      "Escreva para a pior situação do usuário (estressado, com pressa)",
      "Menos palavras, mais clareza: elimine tudo que não agrega",
    ],
    deliverables: [
      "Documento com análise + reescrita (Notion, Word, PDF)",
      "Protótipo no Figma com os novos textos (opcional, mas recomendado)",
    ],
  },
  usability: {
    title: "Usabilidade",
    emoji: "🧪",
    color: "from-orange-500 to-pink-500",
    difficulty: "Intermediário",
    difficultyColor: "bg-orange-100 text-orange-600",
    points: 100,
    duration: "7–12 dias",
    participants: "198",
    description:
      "Realize um teste de usabilidade completo com 5 participantes em um produto digital (app ou site). Documente os problemas encontrados, classifique por severidade e proponha soluções de design.",
    objective:
      "Desenvolver habilidade em conduzir testes de usabilidade, identificar padrões nos erros dos usuários e transformar observações em melhorias concretas de design.",
    requirements: [
      "Roteiro de tarefas testadas (mínimo 4 tarefas)",
      "Perfil dos participantes recrutados",
      "Notas estruturadas de cada sessão",
      "Mapa de problemas por severidade (1-4)",
      "Heatmap ou análise de cliques (se possível)",
      "Recomendações priorizadas com wireframes/sketches",
    ],
    tips: [
      "Use o think-aloud protocol — peça para os usuários verbalizarem",
      "Não ajude o usuário durante o teste, mesmo que erre",
      "5 participantes encontram ~85% dos problemas de usabilidade",
    ],
    deliverables: [
      "Relatório de usabilidade em PDF",
      "Vídeos/trechos das sessões (opcional)",
    ],
  },
  "information-arch": {
    title: "Arquitetura da Informação",
    emoji: "🗺️",
    color: "from-teal-500 to-blue-500",
    difficulty: "Avançado",
    difficultyColor: "bg-teal-100 text-teal-600",
    points: 100,
    duration: "10–15 dias",
    participants: "134",
    description:
      "Crie a arquitetura de informação completa para um portal ou aplicativo complexo (ex: saúde, educação, e-commerce B2B). O projeto deve incluir desde a pesquisa com usuários até o sitemap final e fluxos de navegação.",
    objective:
      "Estruturar um sistema de informação complexo de forma que seja intuitivo, escalável e alinhado com o modelo mental dos usuários.",
    requirements: [
      "Inventário de conteúdo do produto atual ou proposto",
      "Card sorting (aberto) com mínimo 8 participantes",
      "Análise dos resultados do card sorting",
      "Sitemap hierárquico completo",
      "Fluxos de navegação para os 3 caminhos principais",
      "Teste de árvore (tree testing) para validação",
    ],
    tips: [
      "Use OptimalSort ou Maze para card sorting remoto",
      "Evite nomenclaturas internas — use a linguagem dos usuários",
      "O sitemap deve refletir o modelo mental, não a estrutura técnica",
    ],
    deliverables: [
      "Sitemap em Figma ou Miro",
      "Relatório da pesquisa de IA (PDF)",
      "Protótipo de navegação para tree testing",
    ],
  },
};

/* ─── Mock submissions ────────────────────────────────────────────────── */
const mockSubmissions = [
  { id: 1, author: "Mariana C.", avatar: "👩‍🎨", time: "2 dias", preview: "Análise completa da Nubank com roadmap de 6 meses...", rating: 4.8, likes: 42 },
  { id: 2, author: "Rafael B.", avatar: "👨‍💻", time: "5 dias", preview: "Case detalhado com 3 personas e jornadas mapeadas...", rating: 4.5, likes: 31 },
  { id: 3, author: "Camila R.", avatar: "👩‍💼", time: "1 sem.", preview: "Estratégia focada em retenção com métricas de CX...", rating: 4.9, likes: 58 },
];

const CASE_POINTS = 100;

export function CasesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addPoints } = useStore();
  const navigate = useNavigate();

  const briefing = briefings[slug ?? ""] ?? briefings["ux-research"];

  const [activeTab, setActiveTab] = useState<"briefing" | "entregas" | "enviar">("briefing");
  const [linkValue, setLinkValue] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const canSubmit = uploadMode === "file" ? !!uploadedFile : !!linkValue.trim();

  const handleSubmit = () => {
    if (!canSubmit || submitted) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setShowSuccess(true);
      addPoints(CASE_POINTS);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div
        className={`flex-shrink-0 bg-gradient-to-r ${briefing.color} text-white pt-14 pb-0 px-4`}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full active:bg-white/30"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/70 uppercase tracking-widest">Cases</p>
            <h2 className="text-base font-bold truncate">{briefing.emoji} {briefing.title}</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
            <Coins className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">+{CASE_POINTS} pts</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20">
          {(["briefing", "entregas", "enviar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-white text-white"
                  : "border-transparent text-white/60"
              }`}
            >
              {tab === "briefing" ? "Briefing" : tab === "entregas" ? "Entregas" : "Enviar"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── BRIEFING TAB ── */}
        {activeTab === "briefing" && (
          <div className="p-4 space-y-4 pb-6">
            {/* Meta cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${briefing.difficultyColor}`}>
                  {briefing.difficulty}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
                <Clock className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                <p className="text-[10px] text-gray-500">{briefing.duration}</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
                <Users className="w-4 h-4 text-gray-400 mx-auto mb-0.5" />
                <p className="text-[10px] text-gray-500">{briefing.participants} alunos</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              <h3 className="text-sm font-bold mb-2 text-gray-800">📋 Descrição</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{briefing.description}</p>
            </div>

            {/* Objective */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              <h3 className="text-sm font-bold mb-2 text-gray-800">🎯 Objetivo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{briefing.objective}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              <h3 className="text-sm font-bold mb-3 text-gray-800">✅ O que deve conter</h3>
              <div className="space-y-2">
                {briefing.requirements.map((req, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#A31545]">{i + 1}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{req}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <h3 className="text-sm font-bold mb-3 text-amber-800">💡 Dicas dos mentores</h3>
              <div className="space-y-2">
                {briefing.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-amber-700 leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
              <h3 className="text-sm font-bold mb-3 text-gray-800">📦 Entregáveis</h3>
              <div className="space-y-2">
                {briefing.deliverables.map((d, i) => (
                  <div key={i} className="flex gap-2.5 items-center">
                    <FileText className="w-4 h-4 text-[#A31545] flex-shrink-0" />
                    <p className="text-xs text-gray-600">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setActiveTab("enviar")}
              className="w-full bg-[#A31545] text-white py-4 rounded-2xl text-sm font-bold tracking-wide active:bg-[#7D1133] flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              ENVIAR CASE
              <span className="bg-white/20 rounded-full text-xs px-2 py-0.5">
                +{CASE_POINTS} 🪙
              </span>
            </button>
          </div>
        )}

        {/* ── ENTREGAS TAB ── */}
        {activeTab === "entregas" && (
          <div className="p-4 space-y-3 pb-6">
            <p className="text-xs text-gray-500">
              {mockSubmissions.length} entregas enviadas pela comunidade
            </p>
            {mockSubmissions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {sub.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{sub.author}</p>
                    <p className="text-xs text-gray-400">há {sub.time}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-gray-700">{sub.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{sub.preview}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">❤️ {sub.likes} curtidas</span>
                  <button className="text-xs text-[#A31545] font-semibold active:opacity-70">
                    Ver entrega →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ENVIAR TAB ── */}
        {activeTab === "enviar" && (
          <div className="p-4 space-y-4 pb-6">
            {submitted ? (
              /* Success state */
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">
                  Case enviado com sucesso! 🎉
                </h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  Seu case foi enviado para avaliação. Em breve você receberá feedback dos mentores.
                </p>
                <div className="inline-flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5">
                  <Coins className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">+{CASE_POINTS} pontos acumulados!</span>
                </div>
              </div>
            ) : (
              <>
                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Envie o arquivo do seu case ou cole um link para o Figma, Notion, Google Drive ou qualquer outra plataforma.
                  </p>
                </div>

                {/* Upload mode toggle */}
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      uploadMode === "file"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    📎 Upload de arquivo
                  </button>
                  <button
                    onClick={() => setUploadMode("link")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      uploadMode === "link"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    🔗 Colar link
                  </button>
                </div>

                {/* FILE upload */}
                {uploadMode === "file" && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.fig,.docx,.pptx,.zip,.key,.sketch"
                      onChange={handleFileSelect}
                    />
                    {uploadedFile ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{uploadedFile}</p>
                          <p className="text-xs text-green-600 mt-0.5">Arquivo selecionado ✓</p>
                        </div>
                        <button
                          onClick={() => setUploadedFile(null)}
                          className="p-1 rounded-full bg-gray-100 active:bg-gray-200"
                        >
                          <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 active:bg-gray-50"
                      >
                        <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center">
                          <Upload className="w-7 h-7 text-[#A31545]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Toque para selecionar</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, Figma, PPTX, Word, ZIP</p>
                          <p className="text-xs text-gray-400">Tamanho máximo: 50 MB</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {/* LINK input */}
                {uploadMode === "link" && (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-2">
                      Link do projeto
                    </label>
                    <div className="flex gap-2 items-center bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus-within:border-[#A31545] focus-within:ring-2 focus-within:ring-[#A31545]/20">
                      <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="url"
                        placeholder="https://www.figma.com/..."
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
                      />
                      {linkValue && (
                        <button onClick={() => setLinkValue("")}>
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Suportado: Figma, Notion, Google Drive, Behance, etc.
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                  <label className="text-xs font-semibold text-gray-600 block mb-2">
                    Contexto adicional <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    placeholder="Descreva brevemente o seu case, as escolhas que você fez e qualquer contexto relevante para os avaliadores..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#A31545]/30 border border-gray-200"
                  />
                </div>

                {/* Points reminder */}
                <div className="flex items-center gap-3 bg-pink-50 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Coins className="w-5 h-5 text-[#A31545]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Ganhe +{CASE_POINTS} pontos
                    </p>
                    <p className="text-xs text-gray-500">
                      Ao enviar seu case você acumula pontos para a loja!
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
                    submitting
                      ? "bg-gray-200 text-gray-400"
                      : canSubmit
                      ? "bg-[#A31545] text-white active:bg-[#7D1133]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      ENVIAR CASE
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <BottomNav />

      {/* Success toast */}
      {showSuccess && (
        <div className="absolute bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>
              Case enviado! <strong>+{CASE_POINTS} pontos</strong> acumulados 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  );
}