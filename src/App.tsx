import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from './lib/supabase';
import { 
  Settings, 
  FileText, 
  Users, 
  Search,
  MessageSquare,
  Plus,
  LayoutList,
  LogOut,
  ChevronDown,
  BrainCircuit,
  Star,
  Target,
  Image as ImageIcon
} from 'lucide-react';

interface Aluno {
  id: string;
  nome: string;
  turma: string;
  turno: string;
  diagnostico: string;
  potencialidades: string;
  desafios: string;
  interesses: string;
  suporte_recomendado: string;
}

export default function App() {
  // Main form state
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoadingAlunos, setIsLoadingAlunos] = useState(true);
  const [dbError, setDbError] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('Baixo');
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Image Generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');

  // Verifica se a chave da API foi carregada no build
  const hasApiKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    async function fetchAlunos() {
      try {
        setDbError('');
        const { data, error } = await supabase
          .from('estudantes')
          .select('*')
          .order('nome');
        
        if (error) throw error;
        if (data) {
          setAlunos(data);
          if (data.length > 0) {
            setAlunoId(data[0].id);
          } else {
            setDbError('Nenhum aluno encontrado. Verifique se você rodou o script SQL e desativou o RLS no Supabase.');
          }
        }
      } catch (error: any) {
        console.error('Erro ao buscar alunos:', error);
        setDbError(error.message || 'Erro ao conectar com o banco de dados.');
      } finally {
        setIsLoadingAlunos(false);
      }
    }

    fetchAlunos();
  }, []);

  const selectedAluno = alunos.find(a => a.id === alunoId);

  const handleGenerate = async () => {
    if (!disciplina || !tema) {
      alert('Por favor, preencha a disciplina e o tema da aula.');
      return;
    }

    if (!selectedAluno) {
      alert('Por favor, selecione um aluno válido.');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    setGeneratedImage(''); // Limpa a imagem anterior ao gerar novo plano

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chave da API do Gemini não encontrada. Faça um novo deploy no Vercel.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
Você é um professor altamente especializado em Educação Inclusiva e Especial. Sua missão é criar um Plano de Aula Adaptado (PEI) que seja criativo, empático e que respeite rigorosamente o grau de neurodivergência e as necessidades específicas do estudante abaixo.

DADOS DO ESTUDANTE:
Nome: ${selectedAluno.nome}
Diagnóstico: ${selectedAluno.diagnostico}
Potencialidades (O que ele faz bem): ${selectedAluno.potencialidades}
Desafios (Barreiras a superar): ${selectedAluno.desafios}
Interesses (O que ele ama): ${selectedAluno.interesses}
Suporte Recomendado: ${selectedAluno.suporte_recomendado}

DADOS DA AULA:
Disciplina: ${disciplina}
Tema: ${tema}
Nível de adaptação do material: ${nivel}

DIRETRIZES OBRIGATÓRIAS PARA A GERAÇÃO:
1. EMPATIA E RESPEITO: O plano deve ser acolhedor, evitando sobrecarga cognitiva e respeitando o ritmo do estudante.
2. ENGAJAMENTO: Integre os interesses do aluno (${selectedAluno.interesses}) de forma criativa no contexto da aula para prender a atenção dele.
3. MITIGAÇÃO DE DESAFIOS: Adapte a linguagem, o tempo e a estrutura da atividade para contornar os desafios específicos (${selectedAluno.desafios}).
4. USO DAS POTENCIALIDADES: Utilize as potencialidades (${selectedAluno.potencialidades}) como a principal âncora para o aprendizado.
5. SUPORTE PRÁTICO: Siga as recomendações de suporte (${selectedAluno.suporte_recomendado}) e dê exemplos práticos de como o professor deve agir na sala de aula.
6. TABELAS: Você DEVE incluir pelo menos uma tabela em formato Markdown (ex: Cronograma passo a passo da aula, Rubrica de avaliação adaptada ou Organização de conteúdo).
7. GRÁFICOS/VISUAIS: Inclua uma seção descrevendo detalhadamente um esquema visual, mapa mental ou desenho que o professor deve fazer no quadro para facilitar a compreensão visual do estudante.
      `.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const generatedText = response.text || 'Não foi possível gerar o conteúdo.';
      setGeneratedContent(generatedText);

      // Salvar no Supabase
      const { error: insertError } = await supabase
        .from('planos_aula')
        .insert([
          {
            estudante_id: selectedAluno.id,
            disciplina,
            tema,
            nivel_adaptacao: nivel,
            conteudo_gerado: generatedText
          }
        ]);

      if (insertError) {
        console.error('Erro ao salvar plano de aula no Supabase:', insertError);
      }

    } catch (err: any) {
      console.error(err);
      alert(`Ocorreu um erro ao gerar a atividade: ${err?.message || 'Verifique sua chave de API.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!disciplina || !tema) {
      alert('Por favor, preencha a disciplina e o tema da aula para gerar a imagem.');
      return;
    }

    setIsGeneratingImage(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chave da API do Gemini não encontrada. Faça um novo deploy no Vercel.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const imagePrompt = `Uma ilustração educacional colorida, lúdica e acessível sobre o tema "${tema}" para a disciplina de "${disciplina}". Deve incluir elementos visuais relacionados a: ${selectedAluno?.interesses || 'educação'}. Estilo: desenho infantil, claro, sem textos complexos, sem poluição visual, ideal para educação especial e estudantes neurodivergentes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: imagePrompt,
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      let imageUrl = '';
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error('A API não retornou nenhuma imagem. Tente novamente.');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Ocorreu um erro ao gerar a imagem: ${err?.message || 'Verifique sua chave de API.'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent || !selectedAluno) return;
    const element = document.createElement("a");
    const file = new Blob([generatedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "PEI_" + selectedAluno.nome.replace(/\s+/g, '_') + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const curriculoItems = [
    { disciplina: 'Língua Portuguesa', tema: 'Leitura e Interpretação de Textos', codigo: 'EF15LP03' },
    { disciplina: 'Matemática', tema: 'Operações Básicas (Adição e Subtração)', codigo: 'EF03MA05' },
    { disciplina: 'Matemática', tema: 'Sistema Monetário Brasileiro', codigo: 'EF03MA24' },
    { disciplina: 'Ciências', tema: 'Corpo Humano e Saúde', codigo: 'EF01CI02' },
    { disciplina: 'História', tema: 'A Família e a Comunidade', codigo: 'EF01HI01' },
    { disciplina: 'Geografia', tema: 'O Espaço de Vivência', codigo: 'EF01GE01' },
    { disciplina: 'Artes', tema: 'Expressão Plástica e Visual', codigo: 'EF15AR04' },
    { disciplina: 'Educação Física', tema: 'Jogos e Brincadeiras Populares', codigo: 'EF12EF01' }
  ];

  const filteredCurriculo = curriculoItems.filter(item => 
    item.tema.toLowerCase().includes(tema.toLowerCase()) || 
    item.codigo.toLowerCase().includes(tema.toLowerCase()) ||
    item.disciplina.toLowerCase().includes(tema.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col shrink-0">
        {/* Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">EI</span>
          </div>
          <span className="font-semibold text-sm leading-tight">EducaInclusiva<br/>Tocantins</span>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#334155] rounded-xl text-sm font-medium text-white transition-colors">
            <Plus className="w-4 h-4" /> Novo Plano
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#334155] hover:text-white rounded-xl text-sm font-medium transition-colors">
            <Users className="w-4 h-4" /> Alunos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#334155] hover:text-white rounded-xl text-sm font-medium transition-colors">
            <LayoutList className="w-4 h-4" /> Termas
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#334155] hover:text-white rounded-xl text-sm font-medium transition-colors">
            <FileText className="w-4 h-4" /> Compostos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#334155] hover:text-white rounded-xl text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" /> Configurações da API
          </button>
        </nav>
        
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-[#334155] hover:text-white rounded-xl text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4 rotate-180" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Cards</h1>
        
        <div className="flex flex-col xl:flex-row gap-6 max-w-7xl">
          {/* Left Column (Cards 1, 3, 4) */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Card 1: Identificação */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold flex items-center gap-3 mb-5 text-slate-800">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">1</span>
                Identificação
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Aluno</label>
                  <div className="relative">
                    <select 
                      value={alunoId}
                      onChange={(e) => setAlunoId(e.target.value)}
                      disabled={isLoadingAlunos}
                      className="w-full border border-slate-200 rounded-xl p-3 pl-12 appearance-none bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                    >
                      {isLoadingAlunos ? (
                        <option value="">Carregando alunos...</option>
                      ) : (
                        <>
                          {alunos.map(aluno => (
                            <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                          ))}
                          <option value="novo">Novo Aluno...</option>
                        </>
                      )}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                      <Users className="w-3 h-3 text-indigo-600" />
                    </div>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  
                  {/* Student Profile Summary */}
                  {!hasApiKey && (
                    <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-700 font-medium">⚠️ Chave da IA Ausente</p>
                      <p className="text-xs text-amber-600 mt-1">O aplicativo não detectou a chave do Gemini. Se você acabou de adicionar no Vercel, é obrigatório fazer um <b>Redeploy</b> para que a chave seja embutida no sistema.</p>
                    </div>
                  )}

                  {dbError && (
                    <div className="mt-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600 font-medium">⚠️ Erro no Banco de Dados:</p>
                      <p className="text-xs text-red-500 mt-1">{dbError}</p>
                      <p className="text-xs text-red-500 mt-2 font-semibold">Lembre-se de rodar no Supabase (SQL Editor):</p>
                      <code className="block mt-1 text-[10px] bg-red-100 p-2 rounded text-red-800">
                        ALTER TABLE estudantes DISABLE ROW LEVEL SECURITY;<br/>
                        ALTER TABLE planos_aula DISABLE ROW LEVEL SECURITY;
                      </code>
                    </div>
                  )}
                  
                  {selectedAluno && (
                    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5">
                      <div className="flex items-start gap-2">
                        <BrainCircuit className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Diagnóstico:</span> {selectedAluno.diagnostico}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Interesses:</span> {selectedAluno.interesses}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Foco do Suporte:</span> {selectedAluno.suporte_recomendado}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Disciplina</label>
                  <input 
                    type="text" 
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Nível de Adaptação */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold flex items-center gap-3 mb-2 text-slate-800">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">3</span>
                Nível de Adaptação
              </h2>
              <p className="text-sm text-slate-500 mb-5">O professor seleciona o nível de adaptação do suporte.</p>
              <div className="flex gap-4">
                {['Baixo', 'Médio', 'Alto'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => setNivel(l)}
                    className={
                      "flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all " +
                      (nivel === l 
                        ? "border-indigo-100 bg-indigo-50/50" 
                        : "border-slate-100 hover:border-slate-200")
                    }
                  >
                    <div className={
                      "w-12 h-6 rounded-full p-1 mb-3 transition-colors " +
                      (nivel === l ? "bg-indigo-500" : "bg-slate-200")
                    }>
                      <div className={
                        "w-4 h-4 rounded-full bg-white transition-transform " +
                        (nivel === l ? "translate-x-6" : "translate-x-0")
                      }></div>
                    </div>
                    <span className="font-medium text-slate-700">{l}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card 4: Gerar Documento */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold flex items-center gap-3 mb-5 text-slate-800">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">4</span>
                Gerar Documento
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || isLoadingAlunos}
                  className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>🚀 Gerar Plano de Aula com IA</>
                  )}
                </button>

                <button 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !tema}
                  className="w-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  ) : (
                    <><ImageIcon className="w-5 h-5" /> Gerar Material Visual (Imagem)</>
                  )}
                </button>

                <button 
                  onClick={handleDownload}
                  disabled={!generatedContent}
                  className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Visualizar PDF/PEI
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column (Card 2) */}
          <div className="flex-1 min-w-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
              <h2 className="text-lg font-semibold flex items-center gap-3 mb-5 text-slate-800">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">2</span>
                Currículo de Tocantins
              </h2>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Buscar Tema..." 
                  className="w-full border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {filteredCurriculo.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setDisciplina(item.disciplina);
                      setTema(`${item.codigo} - ${item.tema}`);
                    }}
                    className={
                      "p-4 rounded-xl text-sm cursor-pointer transition-colors border " +
                      (tema.includes(item.codigo)
                        ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 font-medium shadow-sm" 
                        : "bg-white hover:bg-slate-50 border-slate-100 text-slate-600")
                    }
                  >
                    <div className="font-semibold text-slate-800 mb-1">{item.codigo}</div>
                    <div className="text-xs text-indigo-600 font-medium mb-1">{item.disciplina}</div>
                    <div className="text-slate-600 leading-snug">{item.tema}</div>
                  </div>
                ))}
                {filteredCurriculo.length === 0 && (
                  <div className="text-center p-4 text-slate-500 text-sm">
                    Nenhum tema encontrado. Você pode digitar um tema livremente.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Preview) */}
          <div className="w-full xl:w-[340px] flex flex-col shrink-0">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Preview</h3>
            <div className="bg-[#1a1a1a] rounded-2xl flex-1 p-5 text-slate-300 text-sm overflow-y-auto shadow-xl border border-[#2a2a2a] min-h-[400px] xl:min-h-0 custom-scrollbar">
              {/* Header dots */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              
              {/* Image Preview */}
              {generatedImage && (
                <div className="mb-6 rounded-xl overflow-hidden border border-[#3a3a3a]">
                  <img 
                    src={generatedImage} 
                    alt="Material de apoio visual gerado pela IA" 
                    className="w-full h-auto object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              )}

              {/* Text Preview */}
              {generatedContent ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-indigo-400 prose-table:border-collapse prose-th:border prose-th:border-[#3a3a3a] prose-th:p-2 prose-th:bg-[#2a2a2a] prose-td:border prose-td:border-[#3a3a3a] prose-td:p-2">
                  <Markdown remarkPlugins={[remarkGfm]}>{generatedContent}</Markdown>
                </div>
              ) : (
                !generatedImage && (
                  <div className="text-slate-500 text-center mt-20">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>O documento gerado aparecerá aqui.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#1e293b] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 z-50">
          <MessageSquare className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}
