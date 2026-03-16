import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from './lib/supabase';
import { 
  BookOpen, 
  User, 
  Sparkles, 
  Download,
  AlertCircle,
  BrainCircuit,
  LayoutGrid,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  FileDown,
  Library,
  Clock
} from 'lucide-react';

const AREAS = {
  'Linguagens': ['Língua Portuguesa', 'Artes', 'Educação Física', 'Língua Inglesa'],
  'Matemática': ['Matemática'],
  'Ciências da Natureza': ['Ciências', 'Biologia', 'Física', 'Química'],
  'Ciências Humanas': ['História', 'Geografia', 'Filosofia', 'Sociologia']
};

interface Estudante {
  id: string;
  nome: string;
  turma: string;
  turno: string;
  neurodivergencia: string;
  potencialidades: string;
  desafios: string;
  interesses: string;
  suporte_recomendado: string;
}

export default function App() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState('');
  
  // Form State
  const [estudanteId, setEstudanteId] = useState('');
  const [area, setArea] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tituloAula, setTituloAula] = useState('');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [atividadeGerada, setAtividadeGerada] = useState('');
  const [imagemGerada, setImagemGerada] = useState('');
  
  // Banco State
  const [activeTab, setActiveTab] = useState<'gerar' | 'banco'>('gerar');
  const [historico, setHistorico] = useState<any[]>([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('');
  const [isLoadingHistorico, setIsLoadingHistorico] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    async function fetchEstudantes() {
      try {
        setDbError('');
        const { data, error } = await supabase
          .from('estudantes')
          .select('*')
          .order('nome');
        
        if (error) throw error;
        if (data && data.length > 0) {
          setEstudantes(data);
          setEstudanteId(data[0].id);
        } else {
          setDbError('Nenhum estudante encontrado. Por favor, rode o novo script SQL no Supabase.');
        }
      } catch (error: any) {
        console.error('Erro ao buscar estudantes:', error);
        let errorMsg = error.message || 'Erro ao conectar com o banco de dados.';
        if (errorMsg.includes('Failed to fetch')) {
          errorMsg = 'Falha de conexão (Failed to fetch). Verifique se a SUPABASE_URL no Vercel está correta (deve começar com https://), se o seu projeto no Supabase não está pausado, ou se a chave (SUPABASE_ANON_KEY) está correta.';
        }
        setDbError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEstudantes();
  }, []);

  useEffect(() => {
    async function fetchHistorico() {
      if (activeTab !== 'banco') return;
      setIsLoadingHistorico(true);
      try {
        let query = supabase
          .from('atividades_geradas')
          .select('*, estudantes(nome)')
          .order('created_at', { ascending: false });
        
        if (filtroArea) query = query.eq('area', filtroArea);
        if (filtroDisciplina) query = query.eq('disciplina', filtroDisciplina);
        
        const { data, error } = await query;
        if (error) throw error;
        setHistorico(data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setIsLoadingHistorico(false);
      }
    }
    fetchHistorico();
  }, [activeTab, filtroArea, filtroDisciplina]);

  const selectedEstudante = estudantes.find(e => e.id === estudanteId);

  const handleGerarAtividade = async () => {
    if (!area || !disciplina) {
      alert('Por favor, selecione a área e a disciplina.');
      return;
    }

    if (!tituloAula.trim()) {
      alert('Por favor, digite o título ou tema da aula.');
      return;
    }

    if (!selectedEstudante) {
      alert('Por favor, selecione um estudante.');
      return;
    }

    setIsGenerating(true);
    setAtividadeGerada('');
    setImagemGerada('');

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chave da API do Gemini não encontrada. Faça um novo deploy no Vercel.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
Você é um professor especialista em Educação Inclusiva, Psicopedagogia e Gamificação.
Sua tarefa é criar uma atividade LÚDICA, PRÁTICA e VISUAL. Não crie apenas textos para ler. Crie um JOGO, uma DINÂMICA ou um MATERIAL MANIPULÁVEL.

ÁREA: ${area}
DISCIPLINA: ${disciplina}
TEMA DA AULA: ${tituloAula}

DADOS DO ESTUDANTE:
- Nome: ${selectedEstudante.nome}
- Neurodivergência/Diagnóstico: ${selectedEstudante.neurodivergencia}
- Potencialidades: ${selectedEstudante.potencialidades}
- Desafios: ${selectedEstudante.desafios}
- Interesses: ${selectedEstudante.interesses}
- Suporte Recomendado: ${selectedEstudante.suporte_recomendado}

INSTRUÇÕES PARA A ATIVIDADE (Formato Markdown):
1. 🎯 OBJETIVO DO JOGO/ATIVIDADE: Qual o propósito prático de forma simples?
2. 🛠️ MATERIAIS NECESSÁRIOS: O que o professor precisa separar? (foco em materiais concretos, recicláveis, visuais).
3. 🎲 COMO JOGAR / PASSO A PASSO: Regras simples e diretas de como executar a atividade na prática.
4. 🧩 ADAPTAÇÃO PARA O ALUNO: Explique como os interesses (${selectedEstudante.interesses}) foram usados para engajá-lo e como os desafios foram contornados.
5. 🖼️ APOIO VISUAL: Descreva o que o professor deve desenhar no quadro ou imprimir para ajudar na compreensão visual.
      `.trim();

      const imagePrompt = `Uma ilustração educacional colorida, lúdica e acessível sobre o tema "${tituloAula}" para a disciplina de "${disciplina}". Deve incluir elementos visuais relacionados a: ${selectedEstudante.interesses}. Estilo: desenho infantil, claro, sem textos complexos, sem poluição visual, ideal para educação especial e estudantes neurodivergentes.`;

      // Executa as duas gerações em paralelo
      const textPromise = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const imagePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: imagePrompt,
        config: {
          imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
        }
      }).catch(e => {
        console.error("Erro ao gerar imagem:", e);
        return null; // Não falha tudo se a imagem der erro
      });

      const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

      const generatedText = textResponse.text || 'Não foi possível gerar a atividade.';
      setAtividadeGerada(generatedText);

      let finalImage = '';
      if (imageResponse) {
        const parts = imageResponse.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            finalImage = `data:image/png;base64,${part.inlineData.data}`;
            setImagemGerada(finalImage);
            break;
          }
        }
      }

      // Salvar no banco de dados
      const { error: insertError } = await supabase
        .from('atividades_geradas')
        .insert([
          {
            estudante_id: selectedEstudante.id,
            titulo_aula: tituloAula,
            conteudo: generatedText,
            area: area,
            disciplina: disciplina,
            imagem: finalImage
          }
        ]);

      if (insertError) {
        console.error('Erro ao salvar atividade no Supabase:', insertError);
      }

    } catch (err: any) {
      console.error(err);
      alert(`Erro ao gerar a atividade: ${err?.message || 'Verifique sua chave de API.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStudentName = () => {
    return selectedEstudante?.nome ? selectedEstudante.nome.replace(/\s+/g, '_') : 'Estudante';
  };

  const handleDownloadTxt = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!atividadeGerada) {
      alert("Nenhuma atividade para baixar.");
      return;
    }
    try {
      const element = document.createElement("a");
      const file = new Blob([atividadeGerada], {type: 'text/plain;charset=utf-8'});
      element.href = URL.createObjectURL(file);
      element.download = `Atividade_${getStudentName()}.txt`;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error("Erro no TXT:", error);
      alert("Erro ao gerar o arquivo TXT.");
    }
  };

  const handleDownloadDoc = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!atividadeGerada || !contentRef.current) {
      alert("Nenhuma atividade para baixar.");
      return;
    }
    try {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Atividade Adaptada</title></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + contentRef.current.innerHTML + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      
      const fileDownload = document.createElement("a");
      fileDownload.style.display = 'none';
      document.body.appendChild(fileDownload);
      fileDownload.href = url;
      fileDownload.download = `Atividade_${getStudentName()}.doc`;
      fileDownload.click();
      document.body.removeChild(fileDownload);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no DOC:", error);
      alert("Erro ao gerar o arquivo DOC.");
    }
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!atividadeGerada) {
      alert("Nenhuma atividade para baixar.");
      return;
    }
    // Usar a função nativa de impressão do navegador é 100% confiável
    // O usuário pode escolher "Salvar como PDF" na tela de impressão
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center justify-center md:justify-start gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            Gerador de Atividades Inclusivas
          </h1>
          <p className="text-slate-500 mt-2">Crie atividades adaptadas instantaneamente com base na neurodivergência de cada estudante.</p>
        </header>

        {/* Alertas de Erro */}
        {!hasApiKey && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-semibold">Chave da IA Ausente</p>
              <p className="text-sm text-amber-700 mt-1">Configure a variável VITE_GEMINI_API_KEY no Vercel e faça um novo deploy.</p>
            </div>
          </div>
        )}

        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-semibold">Erro de Banco de Dados</p>
              <p className="text-sm text-red-700 mt-1">{dbError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Painel Esquerdo: Controles */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tabs */}
            <div className="flex p-1 bg-slate-200/50 rounded-xl">
              <button 
                onClick={() => setActiveTab('gerar')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'gerar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Sparkles className="w-4 h-4" /> Nova Atividade
              </button>
              <button 
                onClick={() => setActiveTab('banco')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'banco' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Library className="w-4 h-4" /> Banco
              </button>
            </div>

            {activeTab === 'gerar' ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                
                {/* Seleção de Estudante */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  Selecione o Estudante
                </label>
                <select 
                  value={estudanteId}
                  onChange={(e) => setEstudanteId(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <option value="">Carregando...</option>
                  ) : (
                    estudantes.map(est => (
                      <option key={est.id} value={est.id}>{est.nome}</option>
                    ))
                  )}
                </select>

                {/* Resumo do Estudante Selecionado */}
                {selectedEstudante && (
                  <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                    <p className="text-xs font-semibold text-indigo-900 mb-1">Neurodivergência:</p>
                    <p className="text-sm text-indigo-800 mb-3">{selectedEstudante.neurodivergencia}</p>
                    
                    <p className="text-xs font-semibold text-indigo-900 mb-1">Interesses para engajamento:</p>
                    <p className="text-sm text-indigo-800">{selectedEstudante.interesses}</p>
                  </div>
                )}
              </div>

              {/* Área e Disciplina */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-indigo-500" />
                    Área de Conhecimento
                  </label>
                  <select 
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      setDisciplina('');
                    }}
                    className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Selecione a área...</option>
                    {Object.keys(AREAS).map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Disciplina
                  </label>
                  <select 
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    disabled={!area}
                    className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
                  >
                    <option value="">Selecione a disciplina...</option>
                    {area && AREAS[area as keyof typeof AREAS].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Título da Aula */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Título ou Tema da Aula
                </label>
                <input 
                  type="text" 
                  value={tituloAula}
                  onChange={(e) => setTituloAula(e.target.value)}
                  placeholder="Ex: Sistema Solar, Adição básica..." 
                  className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                />
              </div>

              {/* Botão Gerar */}
              <button 
                onClick={handleGerarAtividade}
                disabled={isGenerating || isLoading || !estudanteId}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Sparkles className="w-5 h-5" /> Gerar Atividade Adaptada</>
                )}
              </button>
            </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Library className="w-5 h-5 text-indigo-500" />
                  Banco de Atividades
                </h3>
                
                {/* Filters */}
                <div className="space-y-3 mb-4">
                  <select 
                    value={filtroArea} 
                    onChange={e => { setFiltroArea(e.target.value); setFiltroDisciplina(''); }} 
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Todas as Áreas</option>
                    {Object.keys(AREAS).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <select 
                    value={filtroDisciplina} 
                    onChange={e => setFiltroDisciplina(e.target.value)} 
                    disabled={!filtroArea} 
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="">Todas as Disciplinas</option>
                    {filtroArea && AREAS[filtroArea as keyof typeof AREAS].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {isLoadingHistorico ? (
                    <p className="text-center text-slate-500 text-sm py-4">Carregando...</p>
                  ) : historico.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-4">Nenhuma atividade encontrada.</p>
                  ) : (
                    historico.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => {
                          setAtividadeGerada(item.conteudo);
                          setImagemGerada(item.imagem || '');
                          setEstudanteId(item.estudante_id);
                          setTituloAula(item.titulo_aula);
                        }}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                      >
                        <p className="font-medium text-slate-800 text-sm line-clamp-2">{item.titulo_aula}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span className="truncate">{item.estudantes?.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Painel Direito: Resultado */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full min-h-[500px] flex flex-col">
              
              {/* Header do Resultado */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl no-print">
                <h2 className="font-semibold text-slate-700">Atividade Gerada</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={handleDownloadTxt}
                    disabled={!atividadeGerada}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Baixar como Texto"
                  >
                    <FileText className="w-4 h-4" /> TXT
                  </button>
                  <button 
                    onClick={handleDownloadDoc}
                    disabled={!atividadeGerada}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Baixar como Word"
                  >
                    <FileDown className="w-4 h-4" /> DOC
                  </button>
                  <button 
                    onClick={handleDownloadPdf}
                    disabled={!atividadeGerada}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Baixar como PDF"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                </div>
              </div>

              {/* Conteúdo do Resultado */}
              <div className="p-6 flex-1 overflow-y-auto" id="printable-content">
                {atividadeGerada ? (
                  <div className="space-y-6" ref={contentRef}>
                    {imagemGerada && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={imagemGerada} alt="Ilustração da atividade" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-table:border-collapse prose-th:border prose-th:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:border prose-td:border-slate-200 prose-td:p-3">
                      <Markdown remarkPlugins={[remarkGfm]}>{atividadeGerada}</Markdown>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-center max-w-sm">
                      Selecione um estudante, digite o tema da aula e clique em gerar para criar uma atividade totalmente adaptada.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
