import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "../components/header";
import { BottomNav } from "../components/bottom-nav";
import { Upload, CheckCircle, Heart, Star, Link as LinkIcon, Clock, Users, Coins, Info, ArrowRight } from "lucide-react";

const caseData: Record<string, any> = {
  "strategy": {
    title: "UX Strategy",
    points: 100,
    level: "Avançado",
    duration: "5-12 dias",
    students: 182,
    description: "Escolha uma empresa real (pode ser uma startup ou grande empresa) e elabore uma estratégia de UX completa. Seu trabalho deve identificar oportunidades de melhoria na experiência do usuário e propor um roadmap de implementação com prioridades claras.",
    objective: "Demonstrar capacidade de pensar estrategicamente em UX, conectando os objetivos do negócio às necessidades reais dos usuários.",
    requirements: [
      "Análise do produto/serviço atual (pontos fortes e fracos)",
      "Pesquisa de mercado e análise de concorrentes",
      "Definição de personas estratégicas (mínimo 3)",
      "Mapa de oportunidades priorizado",
      "Roadmap de UX com 3 horizontes de tempo",
      "Métricas de sucesso (KPIs de UX)"
    ],
    tips: [
      "Use o Business Model Canvas como ponto de partida",
      "Não tente melhorar tudo — foque nas 3 maiores dores",
      "Inclua dados reais sempre que possível"
    ],
    deliverables: [
      { icon: "📄", text: "Apresentação em PDF ou Figma (max 20 slides)" },
      { icon: "📝", text: "Documento de estratégia (word/notion)" }
    ]
  },
  "research": {
    title: "UX Research",
    points: 100,
    level: "Intermediário",
    duration: "7-10 dias",
    students: 245,
    description: "Realize uma pesquisa completa com usuários para validar hipóteses e identificar oportunidades de melhoria em um produto existente.",
    objective: "Demonstrar domínio em métodos de pesquisa qualitativa e quantitativa, gerando insights acionáveis.",
    requirements: [
      "Plano de pesquisa",
      "Roteiro de entrevistas",
      "Análise de dados",
      "Insights e recomendações",
      "Apresentação de resultados"
    ],
    tips: [
      "Combine métodos qualitativos e quantitativos",
      "Grave e transcreva as entrevistas",
      "Use ferramentas de análise como affinity mapping"
    ],
    deliverables: [
      { icon: "📊", text: "Relatório de pesquisa completo" },
      { icon: "🎥", text: "Apresentação de resultados" }
    ]
  },
  "writing": {
    title: "UX Writing",
    points: 100,
    level: "Iniciante",
    duration: "3-5 dias",
    students: 312,
    description: "Crie microtextos e conteúdo para interfaces digitais, garantindo clareza, consistência e tom de voz adequado.",
    objective: "Dominar a arte de escrever textos claros, concisos e que guiem o usuário pela interface.",
    requirements: [
      "Guia de tom de voz",
      "Microtextos de interface",
      "Mensagens de erro",
      "Textos de onboarding",
      "CTAs otimizados"
    ],
    tips: [
      "Seja claro e objetivo",
      "Use voz ativa sempre que possível",
      "Teste os textos com usuários reais"
    ],
    deliverables: [
      { icon: "📝", text: "Documento de UX Writing" },
      { icon: "🎨", text: "Exemplos aplicados em protótipos" }
    ]
  },
  "usability": {
    title: "Usabilidade",
    points: 100,
    level: "Intermediário",
    duration: "6-8 dias",
    students: 198,
    description: "Avalie a usabilidade de um produto digital usando heurísticas de Nielsen e testes com usuários.",
    objective: "Identificar problemas de usabilidade e propor soluções baseadas em evidências.",
    requirements: [
      "Análise heurística",
      "Plano de teste de usabilidade",
      "Execução dos testes",
      "Relatório de problemas",
      "Recomendações priorizadas"
    ],
    tips: [
      "Use as 10 heurísticas de Nielsen",
      "Grave os testes para análise posterior",
      "Priorize os problemas por severidade"
    ],
    deliverables: [
      { icon: "📋", text: "Relatório de análise heurística" },
      { icon: "🎬", text: "Vídeos dos testes de usabilidade" }
    ]
  },
  "information-arch": {
    title: "Arquitetura da Informação",
    points: 100,
    level: "Intermediário",
    duration: "8-12 dias",
    students: 156,
    description: "Organize e estruture a informação de um produto digital para facilitar a navegação e encontrabilidade.",
    objective: "Criar uma estrutura de informação lógica, intuitiva e escalável.",
    requirements: [
      "Inventário de conteúdo",
      "Card sorting",
      "Sitemap",
      "Fluxos de navegação",
      "Taxonomia e rotulagem"
    ],
    tips: [
      "Comece com um inventário completo do conteúdo",
      "Faça card sorting com usuários reais",
      "Valide a arquitetura com tree testing"
    ],
    deliverables: [
      { icon: "🗂️", text: "Sitemap e taxonomia" },
      { icon: "🔀", text: "Fluxos de navegação" }
    ]
  },
  "ui-design": {
    title: "UI Design",
    points: 100,
    level: "Avançado",
    duration: "10-15 dias",
    students: 289,
    description: "Crie interfaces visuais atraentes e funcionais seguindo princípios de design e diretrizes de acessibilidade.",
    objective: "Demonstrar domínio em design visual, sistemas de design e acessibilidade.",
    requirements: [
      "Sistema de design",
      "Componentes reutilizáveis",
      "Protótipo de alta fidelidade",
      "Especificações para desenvolvimento",
      "Guia de estilo"
    ],
    tips: [
      "Siga as diretrizes WCAG 2.1",
      "Crie um design system escalável",
      "Use ferramentas como Figma ou Sketch"
    ],
    deliverables: [
      { icon: "🎨", text: "Protótipo de alta fidelidade" },
      { icon: "📐", text: "Design system documentado" }
    ]
  }
};

const communitySubmissions = [
  {
    id: 1,
    name: "Mariana C.",
    avatar: "👩",
    timeAgo: "há 7 dias",
    description: "Análise completa da Nubank com roadmap de 6 meses",
    rating: 4.8,
    likes: 42
  },
  {
    id: 2,
    name: "Rafael B.",
    avatar: "👨",
    timeAgo: "há 5 dias",
    description: "Case detalhado com 3 personas e jornadas mapeadas...",
    rating: 4.5,
    likes: 31
  },
  {
    id: 3,
    name: "Camila R.",
    avatar: "👩",
    timeAgo: "há 1 sem.",
    description: "Estratégia focada em retenção com métricas de CX...",
    rating: 4.9,
    likes: 58
  }
];

export function CaseDetalhePage() {
  const { slug = "strategy" } = useParams();
  const navigate = useNavigate();
  const caseInfo = caseData[slug] || caseData["strategy"];

  const [activeTab, setActiveTab] = useState<"briefing" | "entregas" | "enviar">("briefing");
  const [uploadMethod, setUploadMethod] = useState<"file" | "link">("link");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [context, setContext] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (uploadMethod === "file" && !file) return;
    if (uploadMethod === "link" && !link) return;

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("Case enviado com sucesso! Você ganhou +100 pontos.");
      navigate("/home");
    }, 2000);
  };

  const canSubmit = uploadMethod === "file" ? file : link.trim().length > 0;

  return (
    <div className="h-full bg-gray-50 dark:bg-background flex flex-col overflow-hidden">
      <Header
        title={`CASES | ✅ ${caseInfo.title}`}
        actions={
          <div className="flex items-center gap-1.5 bg-[#A31545] rounded-full px-2.5 py-1">
            <Coins className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white">+{caseInfo.points} pts</span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border flex">
        {(["briefing", "entregas", "enviar"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#A31545] dark:border-primary text-[#A31545] dark:text-primary"
                : "border-transparent text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab === "briefing" ? "Briefing" : tab === "entregas" ? "Entregas" : "Enviar"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="p-4 space-y-4">

          {/* BRIEFING TAB */}
          {activeTab === "briefing" && (
            <>
              {/* Badges */}
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  caseInfo.level === "Avançado"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : caseInfo.level === "Intermediário"
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                }`}>
                  {caseInfo.level}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-accent rounded-full">
                  <Clock className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{caseInfo.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-accent rounded-full">
                  <Users className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{caseInfo.students} alunos</span>
                </div>
              </div>

              {/* Descrição */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">📋 Descrição</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{caseInfo.description}</p>
              </div>

              {/* Objetivo */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">🎯 Objetivo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{caseInfo.objective}</p>
              </div>

              {/* O que deve conter */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">✅ O que deve conter</h3>
                <ol className="space-y-2">
                  {caseInfo.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-[#A31545] dark:text-primary font-bold flex-shrink-0">{idx + 1}</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Dicas dos mentores */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-amber-800 p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-amber-300 mb-3">💡 Dicas dos mentores</h3>
                <ul className="space-y-2">
                  {caseInfo.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-amber-200/80">
                      <span className="text-yellow-600 dark:text-amber-400 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Entregáveis */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">📦 Entregáveis</h3>
                <div className="space-y-2">
                  {caseInfo.deliverables.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de enviar */}
              <button
                onClick={() => setActiveTab("enviar")}
                className="w-full bg-gradient-to-r from-[#A31545] to-pink-600 text-white py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 active:opacity-90 shadow-lg"
              >
                <Upload className="w-5 h-5" />
                <span>ENVIAR CASE</span>
                <span className="text-lg">+{caseInfo.points} 🪙</span>
              </button>
            </>
          )}

          {/* ENTREGAS TAB */}
          {activeTab === "entregas" && (
            <>
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">{communitySubmissions.length} entregas enviadas pela comunidade</p>
              </div>

              {communitySubmissions.map((submission) => (
                <div key={submission.id} className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {submission.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{submission.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{submission.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{submission.timeAgo}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{submission.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                          <span>{submission.likes} curtidas</span>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-bold text-[#A31545] dark:text-primary active:opacity-70">
                          <span>Ver entrega</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ENVIAR TAB */}
          {activeTab === "enviar" && (
            <>
              {/* Info message */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-3 flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  Envie o arquivo do seu case ou cole um link para o Figma, Notion, Google Drive ou qualquer outra plataforma.
                </p>
              </div>

              {/* Toggle entre Upload e Link */}
              <div className="flex gap-2">
                <button
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    uploadMethod === "file"
                      ? "bg-gray-800 dark:bg-gray-700 text-white"
                      : "bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload de arquivo</span>
                </button>
                <button
                  onClick={() => setUploadMethod("link")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    uploadMethod === "link"
                      ? "bg-gray-800 dark:bg-gray-700 text-white"
                      : "bg-gray-100 dark:bg-accent text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Colar link</span>
                </button>
              </div>

              {/* Upload de arquivo */}
              {uploadMethod === "file" && (
                <div className="bg-white dark:bg-card rounded-2xl border-2 border-dashed border-gray-300 dark:border-border p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf,.fig,.pptx,.docx,.zip"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? (
                      <div>
                        <CheckCircle className="w-12 h-12 text-[#A31545] dark:text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-8 h-8 text-[#A31545] dark:text-primary" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Toque para selecionar</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PDF, Figma, PPTX, Word, ZIP</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Tamanho máximo: 50 MB</p>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* Colar link */}
              {uploadMethod === "link" && (
                <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                  <label className="block mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Link do projeto</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://www.figma.com/..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-primary"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Suportado: Figma, Notion, Google Drive, Behance, etc.
                  </p>
                </div>
              )}

              {/* Contexto adicional */}
              <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-border p-4">
                <label className="block mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contexto adicional <span className="text-gray-400 dark:text-gray-500 font-normal">(opcional)</span></span>
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Descreva brevemente o seu case, as escolhas que você fez e qualquer contexto relevante para os avaliadores..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A31545] dark:focus:ring-primary resize-none"
                />
              </div>

              {/* Card de pontos */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-pink-200 dark:border-pink-800 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white dark:bg-card rounded-full flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-[#A31545] dark:text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">Ganhe +{caseInfo.points} pontos</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Ao enviar seu case você acumula pontos para a loja!
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de enviar */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || uploading}
                className={`w-full py-3.5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                  canSubmit && !uploading
                    ? "bg-[#A31545] text-white active:bg-[#7D1133] shadow-lg"
                    : "bg-gray-200 dark:bg-accent text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>{uploading ? "ENVIANDO..." : "ENVIAR CASE"}</span>
              </button>
            </>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
