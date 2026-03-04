-- Criação da tabela de Estudantes
CREATE TABLE estudantes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    turma VARCHAR(50) NOT NULL,
    turno VARCHAR(50) NOT NULL,
    diagnostico TEXT NOT NULL,
    potencialidades TEXT,
    desafios TEXT,
    interesses TEXT,
    suporte_recomendado TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criação da tabela de Planos de Aula (para salvar o histórico de atividades geradas)
CREATE TABLE planos_aula (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    estudante_id UUID REFERENCES estudantes(id) ON DELETE CASCADE,
    disciplina VARCHAR(100) NOT NULL,
    tema VARCHAR(255) NOT NULL,
    nivel_adaptacao VARCHAR(50) NOT NULL,
    conteudo_gerado TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserção dos dados dos estudantes (Matutino e Vespertino)
INSERT INTO estudantes (nome, turma, turno, diagnostico, potencialidades, desafios, interesses, suporte_recomendado) VALUES
-- MATUTINO
('HEMYLY VITORIA DIAS CAMPOS', '13.02', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Atenção aos detalhes, boa memória visual.', 'Sensibilidade auditiva, interação social.', 'Atividades visuais, organização.', 'Usa abafador por causa da sensibilidade auditiva. PEI e adaptação curricular. Evitar ambientes ruidosos.'),
('JANAINA LABRE BATISTA MIRANDA', '13.02', 'Matutino', 'Deficiência Intelectual', 'Esforçada, gosta de atividades práticas.', 'Compreensão de conceitos abstratos, ritmo de aprendizagem.', 'Atividades manuais, rotinas estruturadas.', 'PEI e adaptação curricular. Instruções passo a passo, material concreto.'),
('YASMIN SOLINO PARDINHO', '13.02', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Foco em áreas de interesse específico.', 'Comunicação expressiva, flexibilidade cognitiva.', 'Artes visuais, tecnologia.', 'PEI e adaptação curricular. Apoio visual, previsibilidade na rotina.'),
('YASMIN CARVALHO', '13.02', 'Matutino', 'Síndrome de Down', 'Sociável, afetuosa, boa memória musical.', 'Desenvolvimento motor fino, fala/articulação, abstração.', 'Música, dança, atividades em grupo.', 'PEI e adaptação curricular. Material adaptado, tempo extra, reforço positivo.'),
('IGOR SILVA FERREIRA', '13.03', 'Matutino', 'Deficiência Intelectual', 'Boa disposição para aprender, colaborativo.', 'Raciocínio lógico-matemático, leitura e interpretação.', 'Esportes, atividades ao ar livre.', 'PEI e adaptação curricular. Textos curtos, linguagem simplificada.'),
('PIETRO PINHEIRO TAVARES VIEIRA', '13.04', 'Matutino', 'Deficiência Intelectual', 'Habilidades práticas, boa comunicação interpessoal.', 'Atenção sustentada, retenção de informações complexas.', 'Jogos interativos, dinâmicas de grupo.', 'PEI e adaptação curricular. Atividades fracionadas, pausas regulares.'),
('DANIEL ANTONIO ROCHA DE CASTRO', '23.01', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Raciocínio lógico, interesse em tecnologia.', 'Trabalho em grupo, mudanças repentinas na rotina.', 'Computadores, ciências exatas.', 'Precisa de adaptação e PEI. Antecipação de rotina, atividades individuais ou em duplas escolhidas.'),
('LUCAS RIBEIRO ZANNIER', '23.01', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Atenção concentrada em temas de interesse.', 'Compreensão de metáforas e linguagem figurada.', 'História, leitura de temas específicos.', 'Precisa de adaptação e PEI. Linguagem literal, instruções claras e objetivas.'),
('JOSUÉ PEREIRA DE SÁ', '23.01', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Habilidades visuoespaciais.', 'Regulação sensorial, interação social.', 'Desenho, quebra-cabeças.', 'Precisa de adaptação e PEI. Ambiente com poucos estímulos distratores.'),
('JOAO VINICIUS PEREIRA BARROS', '23.02', 'Matutino', 'Deficiência Física; Deficiência Auditiva', 'Excelente capacidade cognitiva, proativo.', 'Mobilidade, percepção de sons no ambiente.', 'Leitura, tecnologia assistiva.', 'Não precisa de adaptação e PEI. Garantir acessibilidade física e sentar próximo ao professor/quadro.'),
('HEYTOR AMBROSIO XIMENES ALVES', '23.04', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Memória de longo prazo, lealdade a rotinas.', 'Flexibilidade, transições entre atividades.', 'Sistemas, coleções.', 'Precisa De Adaptação E Pei. Uso de cronômetros visuais para transições.'),
('MARIA CAROLINA ALVES VALLIM', '33.02', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Organizada, metódica.', 'Ansiedade em situações de avaliação.', 'Literatura, escrita.', 'Precisa De Adaptação E Pei. Avaliações adaptadas, ambiente tranquilo para provas.'),
('LUCAS DE OLIVEIRA SOARES', '33.03', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Gosta de números, formas geométricas e Sonic.', 'Interação social e textos longos.', 'Sonic, videogames, matemática.', 'Precisa De Adaptação E Pei. Uso de elementos do Sonic, frases curtas, microgestos.'),
('LAERTE CLARO DE SOUSA', '33.04', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Boa expressão oral sobre temas de interesse.', 'Escrita manual prolongada.', 'Ciências da natureza, documentários.', 'Precisa De Adaptação E Pei. Permitir respostas orais ou digitação.'),
('LUIZA MEDEIROS BRAGA DOS SANTOS', '33.04', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Independente, boa capacidade de leitura.', 'Trabalho em grupo.', 'Artes, leitura.', 'Não Precisa De Adaptação E Pei. Acompanhamento pontual.'),
('Guilherme Alves De Aguiar', '33.09', 'Matutino', 'Autismo Infantil (Cid10 F84:0)', 'Autonomia em atividades rotineiras.', 'Compreensão de enunciados complexos.', 'Tecnologia, jogos.', 'Não Precisa De Adaptação. Mediação na interpretação de textos.'),

-- VESPERTINO
('Alliny Stefanny Andrade Souza', '13.06', 'Vespertino', 'Deficiência Intelectual', 'Participativa, gosta de ajudar os colegas.', 'Retenção de informações, cálculos matemáticos.', 'Atividades lúdicas, artes.', 'Precisa de adaptação e PEI. Uso de material concreto, repetição de conceitos.'),
('Davi Gomes De Oliveira', '13.06', 'Vespertino', 'Deficiência Intelectual', 'Boa coordenação motora grossa.', 'Leitura fluente, interpretação de texto.', 'Esportes, música.', 'Precisa de adaptação e PEI. Textos com apoio de imagens, leitura guiada.'),
('Emanuel Cunha Carvalho', '13.06', 'Vespertino', 'Síndrome de Down', 'Muito sociável, empático, gosta de rotina.', 'Fala/articulação, motricidade fina, abstração.', 'Música, atividades em grupo, pintura.', 'Precisa de adaptação e PEI. Tempo estendido, material visual, reforço positivo constante.'),
('Amanda Margarida Almeida Menezes', '23.05', 'Vespertino', 'Deficiência Intelectual', 'Esforçada, atenta às explicações visuais.', 'Raciocínio abstrato, resolução de problemas complexos.', 'Artesanato, histórias.', 'Precisa de adaptação e PEI. Simplificação de enunciados, apoio visual.'),
('Vinicius Rabelo Alves Sales', '23.05', 'Vespertino', 'Transtorno do Espectro Autista (TEA)', 'Foco em detalhes, boa memória para fatos.', 'Interação social, flexibilidade com mudanças.', 'Ciências, geografia.', 'Precisa de adaptação e PEI. Previsibilidade, instruções claras e diretas.'),
('JULLIO CÉSAR MENDES ARAÚJO', '23.05', 'Vespertino', 'Deficiência Intelectual', 'Habilidades manuais, prestativo.', 'Leitura e escrita autônoma.', 'Atividades práticas, esportes.', 'Precisa de adaptação e PEI. Avaliações orais, redução do volume de escrita.'),
('DAVI GALVÃO RIBEIRO', '23.06', 'Vespertino', 'Deficiência Intelectual', 'Boa comunicação oral, sociável.', 'Atenção sustentada, cálculos.', 'Música, vídeos.', 'Precisa de adaptação e PEI. Atividades curtas e dinâmicas, uso de calculadoras.'),
('Isadora Alencar Lima', '23.06', 'Vespertino', 'Deficiência Intelectual', 'Criativa, gosta de desenhar.', 'Compreensão de textos longos.', 'Artes visuais, contação de histórias.', 'Precisa de adaptação e PEI. Uso de mapas mentais, resumos visuais.'),
('João Gabriel Marques Delmondes', '23.06', 'Vespertino', 'Transtorno do Espectro Autista (TEA)', 'Conhecimento aprofundado em temas específicos.', 'Trabalho em equipe, regulação emocional.', 'Tecnologia, jogos.', 'Precisa de adaptação e PEI. Permitir pausas sensoriais, trabalhos individuais.'),
('Thomas James da Silva Costa', '23.06', 'Vespertino', 'Deficiência Intelectual Moderado', 'Boa disposição, gosta de rotinas claras.', 'Autonomia na realização de tarefas escolares.', 'Atividades práticas, música.', 'Precisa de adaptação e PEI. Mediação constante, instruções passo a passo.'),
('Kauã Martins de Oliveira Machado', '33.05', 'Vespertino', 'Síndrome de Down - Q90', 'Afetuoso, participativo em atividades lúdicas.', 'Linguagem expressiva, motricidade fina.', 'Música, dança, esportes adaptados.', 'Precisa De Adaptação E Pei. Material adaptado (fontes maiores, imagens), tempo extra.'),
('ANA IZA MENDES SILVA', '33.05', 'Vespertino', 'Síndrome de Ehlers-Danlos, Transtorno Afetivo Bipolar, Transtorno Depressivo, Transtorno de Ansiedade, Deficiência Intelectual Moderada, Laringomalácia', 'Resiliente, boa capacidade de escuta.', 'Fadiga física, regulação emocional, atenção.', 'Leitura leve, artes tranquilas.', 'Precisa De Adaptação E Pei. Flexibilidade com prazos, pausas frequentes, ambiente acolhedor, evitar sobrecarga física e emocional.'),
('MATHEUS DA SILVA COUTINHO', '33.07', 'Vespertino', 'Surdez', 'Excelente percepção visual, focado.', 'Comunicação oral, compreensão de áudios sem legenda.', 'Tecnologia, esportes visuais.', 'Não Precisa De Adaptação. Garantir intérprete de LIBRAS (se aplicável), usar legendas em vídeos, sentar na frente.'),
('Davi Santos Da Silva', '33.08', 'Vespertino', 'TEA (Sem Laudo Médico - Relatório Pedagógico)', 'Habilidades visuais, interesse em tecnologia.', 'Interação social, comunicação expressiva.', 'Jogos, computadores.', 'Precisa De Adaptação E Pei. Apoio visual, previsibilidade.'),
('LUIZA CATARINA REIS COSTA', '33.08', 'Vespertino', 'Deficiência Auditiva', 'Atenta, participativa.', 'Compreensão em ambientes ruidosos.', 'Artes, leitura.', 'Não Precisa De Adaptação. Falar de frente para a aluna, garantir boa iluminação, evitar ruídos de fundo.');
