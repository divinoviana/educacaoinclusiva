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

-- Criação da tabela de Planos de Aula
CREATE TABLE planos_aula (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    estudante_id UUID REFERENCES estudantes(id) ON DELETE CASCADE,
    disciplina VARCHAR(100) NOT NULL,
    tema VARCHAR(255) NOT NULL,
    nivel_adaptacao VARCHAR(50) NOT NULL,
    conteudo_gerado TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserção dos dados atualizados com os PEIs
INSERT INTO estudantes (nome, turma, turno, diagnostico, potencialidades, desafios, interesses, suporte_recomendado) VALUES
('HEMYLY VITORIA DIAS CAMPOS', '13.02', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Atenção aos detalhes, boa memória visual.', 'Sensibilidade auditiva, interação social.', 'Atividades visuais, organização.', 'Usa abafador por causa da sensibilidade auditiva. PEI e adaptação curricular. Evitar ambientes ruidosos.'),
('JANAINA LABRE BATISTA MIRANDA', '13.02', 'Matutino', 'Deficiência Intelectual', 'Esforçada, gosta de atividades práticas.', 'Compreensão de conceitos abstratos, ritmo de aprendizagem.', 'Atividades manuais, rotinas estruturadas.', 'PEI e adaptação curricular. Instruções passo a passo, material concreto.'),
('YASMIN SOLINO PARDINHO', '13.02', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Foco em áreas de interesse específico.', 'Comunicação expressiva, flexibilidade cognitiva.', 'Artes visuais, tecnologia.', 'PEI e adaptação curricular. Apoio visual, previsibilidade na rotina.'),
('YASMIN CARVALHO', '13.02', 'Matutino', 'Síndrome de Down', 'Verbal, compreende comandos simples, afinidade por dança, música, teatro.', 'Iniciativa comunicativa, interação social espontânea, sensibilidade a estímulos sonoros.', 'Dança, música, teatro, aulas de inglês.', 'Mediação constante, estratégias lúdicas e visuais.'),
('IGOR SILVA FERREIRA', '13.03', 'Matutino', 'Deficiência Intelectual', 'Boa disposição para aprender, colaborativo.', 'Raciocínio lógico-matemático, leitura e interpretação.', 'Esportes, atividades ao ar livre.', 'PEI e adaptação curricular. Textos curtos, linguagem simplificada.'),
('PIETRO PINHEIRO TAVARES VIEIRA', '13.04', 'Matutino', 'Deficiência Intelectual', 'Habilidades práticas, boa comunicação interpessoal.', 'Atenção sustentada, retenção de informações complexas.', 'Jogos interativos, dinâmicas de grupo.', 'PEI e adaptação curricular. Atividades fracionadas, pausas regulares.'),
('DANIEL ANTONIO ROCHA DE CASTRO', '23.01', 'Matutino', 'Deficiência Intelectual, TEA, Epilepsia de difícil controle', 'Maior engajamento com recursos audiovisuais, músicas, instrumentos musicais, pintura (tinta a óleo).', 'Não alfabetizado, dispersão frequente, fraqueza muscular, tremores nas mãos.', 'Músicas, instrumentos musicais, pintura.', 'Vigilância constante (epilepsia), mediação constante.'),
('LUCAS RIBEIRO ZANNIER', '23.01', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Atenção concentrada em temas de interesse.', 'Compreensão de metáforas e linguagem figurada.', 'História, leitura de temas específicos.', 'Precisa de adaptação e PEI. Linguagem literal, instruções claras e objetivas.'),
('JOSUÉ PEREIRA DE SÁ', '23.01', 'Matutino', 'Dificuldades relacionadas à leitura', 'Boa coordenação motora, autonomia, bom repertório de habilidades sociais, comunicativo.', 'Ritmo de leitura abaixo do esperado, déficits em memória e atenção.', 'Basquete, vendas de doces, jogos de memória, dominó, lince, xadrez.', 'Adaptações para leitura e compreensão textual.'),
('JOAO VINICIUS PEREIRA BARROS', '23.02', 'Matutino', 'Deficiência Física; Deficiência Auditiva', 'Excelente capacidade cognitiva, proativo.', 'Mobilidade, percepção de sons no ambiente.', 'Leitura, tecnologia assistiva.', 'Não precisa de adaptação e PEI. Garantir acessibilidade física e sentar próximo ao professor/quadro.'),
('HEYTOR AMBROSIO XIMENES ALVES', '23.04', 'Matutino', 'TEA - Nível 3 de Suporte (não verbal)', 'Leitura de palavras de duas e três sílabas, escreve o nome, cálculos simples de adição e subtração.', 'Coordenação motora fina, emitir respostas espontâneas, interação contínua.', 'Jogos de memória, pega varetas.', 'Estímulo da coordenação motora, habilidades comunicativas e sociais.'),
('MARIA CAROLINA ALVES VALLIM', '33.02', 'Matutino', 'Síndrome de Down, TEA, Miopia severa', 'Faz uso de letra bastão, reconhece sílabas por associação de imagem, relaciona número/quantidade até 5.', 'Prejuízo cognitivo e não verbal, dificuldades adaptativas, baixa tolerância à frustração.', 'Água, desenho, matemática, caça-palavras, quebra-cabeça, computador, cantar em inglês.', 'Instruções breves e simples, letra amplificada, pareamento de imagens.'),
('LUCAS DE OLIVEIRA SOARES', '33.03', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Boa memória, interesse por Matemática, leitura de palavras/frases curtas.', 'Inferência social, interações em grupo, dificuldades motoras finas.', 'Matemática, jogos pedagógicos, pintura, recursos tecnológicos (tablets).', 'Adaptações curriculares, tecnologia assistiva, estratégias estruturadas.'),
('LAERTE CLARO DE SOUSA', '33.04', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Boa expressão oral sobre temas de interesse.', 'Escrita manual prolongada.', 'Ciências da natureza, documentários.', 'Precisa De Adaptação E Pei. Permitir respostas orais ou digitação.'),
('LUIZA MEDEIROS BRAGA DOS SANTOS', '33.04', 'Matutino', 'Transtorno do Espectro Autista (TEA)', 'Independente, boa capacidade de leitura.', 'Trabalho em grupo.', 'Artes, leitura.', 'Não Precisa De Adaptação E Pei. Acompanhamento pontual.'),
('Guilherme Alves De Aguiar', '33.09', 'Matutino', 'Autismo Infantil (Cid10 F84:0)', 'Autonomia em atividades rotineiras.', 'Compreensão de enunciados complexos.', 'Tecnologia, jogos.', 'Não Precisa De Adaptação. Mediação na interpretação de textos.'),
('Alliny Stefanny Andrade Souza', '13.06', 'Vespertino', 'Deficiência Intelectual', 'Participativa, gosta de ajudar os colegas.', 'Retenção de informações, cálculos matemáticos.', 'Atividades lúdicas, artes.', 'Precisa de adaptação e PEI. Uso de material concreto, repetição de conceitos.'),
('Davi Gomes De Oliveira', '13.06', 'Vespertino', 'Deficiência Intelectual', 'Boa coordenação motora grossa.', 'Leitura fluente, interpretação de texto.', 'Esportes, música.', 'Precisa de adaptação e PEI. Textos com apoio de imagens, leitura guiada.'),
('Emanuel Cunha Carvalho', '13.06', 'Vespertino', 'Síndrome de Down', 'Autonomia funcional em autocuidado, reconhece alfabeto e números de 1 a 10, escreve o próprio nome, bom desempenho em coordenação motora fina.', 'Comunicação oral (trocas fonêmicas), organização temporal e espacial, atenção.', 'Quebra-cabeças, jogo da memória, atividades lúdicas.', 'Apoio visual, comandos simples, mediação constante, flexibilização curricular.'),
('Amanda Margarida Almeida Menezes', '23.05', 'Vespertino', 'TEA e Deficiência Intelectual', 'Interesse por atividades artísticas, jogos de memória, quebra-cabeça. Boa coordenação motora fina (canhota).', 'Insegurança, medo, dificuldades de interação, atenção, memória, raciocínio lógico.', 'Pintura, artes visuais, jogos de memória, quebra-cabeça.', 'Mediação de um adulto, apoio emocional constante, estímulos cognitivos adequados.'),
('Vinicius Rabelo Alves Sales', '23.05', 'Vespertino', 'TEA - Nível 3 de suporte', 'Reconhece números até 50, letras, formas, cores. Escreve o nome.', 'Baixa interação social, resistência a atividades manuais, não alfabetizado, dificuldade em permanecer em sala.', 'Músicas, mapas, festas, água, alimentos específicos.', 'Mediação constante, estratégias pedagógicas específicas, apoio contínuo.'),
('JULLIO CÉSAR MENDES ARAÚJO', '23.05', 'Vespertino', 'Deficiência Intelectual', 'Habilidades manuais, prestativo.', 'Leitura e escrita autônoma.', 'Atividades práticas, esportes.', 'Precisa de adaptação e PEI. Avaliações orais, redução do volume de escrita.'),
('DAVI GALVÃO RIBEIRO', '23.06', 'Vespertino', 'Deficiência Intelectual', 'Boa comunicação oral, sociável.', 'Atenção sustentada, cálculos.', 'Música, vídeos.', 'Precisa de adaptação e PEI. Atividades curtas e dinâmicas, uso de calculadoras.'),
('Isadora Alencar Lima', '23.06', 'Vespertino', 'Deficiência Intelectual e má formação cerebral', 'Boa coordenação motora fina, interage de forma tranquila, reconhece o alfabeto, escreve o nome, compreende números até 30.', 'Comunicação verbal limitada, necessita auxílio para higienização.', 'Pintura, desenho, Peppa, Barbie, Patrulha Canina.', 'Apoio para higienização, atenção contínua.'),
('João Gabriel Marques Delmondes', '23.06', 'Vespertino', 'Transtorno do Espectro Autista (TEA)', 'Conhecimento aprofundado em temas específicos.', 'Trabalho em equipe, regulação emocional.', 'Tecnologia, jogos.', 'Precisa de adaptação e PEI. Permitir pausas sensoriais, trabalhos individuais.'),
('Thomas James da Silva Costa', '23.06', 'Vespertino', 'Deficiência Intelectual (QIT=60)', 'Boa interação com colegas, carinhoso, gosta de ir para a escola.', 'Funções executivas, linguagem (vocabulário e compreensão), leitura e escrita (lenta e pausada).', 'Interação social.', 'Mediação constante, instruções passo a passo.'),
('Kauã Martins de Oliveira Machado', '33.05', 'Vespertino', 'Síndrome de Down', 'Bom raciocínio com tecnologia, boa motricidade ampla, facilidade em se relacionar, comunica-se verbalmente, conta de 1 a 20.', 'Atenção insatisfatória, memória operacional deficitária, dificuldade na motricidade fina.', 'Tablet, jogos, bonecos Woody e Jessie, instrumentos musicais, música.', 'Ajuda para higienização, apoio na alimentação.'),
('ANA IZA MENDES SILVA', '33.05', 'Vespertino', 'Síndrome de Ehlers-Danlos, Transtorno Afetivo Bipolar, Transtorno Depressivo, Transtorno de Ansiedade, TEA, Deficiência Intelectual Moderada, Laringomalácia', 'Conhecimentos básicos de leitura e escrita. Melhor desempenho em atividades estruturadas.', 'Crises de ansiedade, oscilações de humor, ritmo de aprendizagem lento, hipersensibilidade a sons.', 'Atividades estruturadas.', 'Adaptações pedagógicas, explicações simplificadas, repetição, tempo ampliado, ambiente acolhedor.'),
('MATHEUS DA SILVA COUTINHO', '33.07', 'Vespertino', 'Surdez', 'Excelente percepção visual, focado.', 'Comunicação oral, compreensão de áudios sem legenda.', 'Tecnologia, esportes visuais.', 'Não Precisa De Adaptação. Garantir intérprete de LIBRAS (se aplicável), usar legendas em vídeos, sentar na frente.'),
('Davi Santos Da Silva', '33.08', 'Vespertino', 'TEA (em investigação)', 'Leitura e interpretação de textos simples, digita e manuseia computador, operações matemáticas básicas.', 'Comunicação e socialização, concentração, compreensão de comandos.', 'Tecnologia, Sonic, Homem-Aranha, animes (Naruto), quadrinhos, vídeos musicais.', 'Mediação para interações, material adaptado.'),
('LUIZA CATARINA REIS COSTA', '33.08', 'Vespertino', 'Deficiência Auditiva', 'Atenta, participativa.', 'Compreensão em ambientes ruidosos.', 'Artes, leitura.', 'Não Precisa De Adaptação. Falar de frente para a aluna, garantir boa iluminação, evitar ruídos de fundo.');
