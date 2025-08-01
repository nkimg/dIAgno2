

// src/services/geminiService.js - VERSÃO COM NOVOS CAMPOS

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const generatePremiumAnalysis = async (patientInfo, sortedSyndromes, fullAnamnesis, queixaPrincipal, anotacoesExtras) => {
  // <<< MUDANÇA: Prompt atualizado para incluir os novos campos de texto
    const prompt = `
    Aja como um especialista sênior em Medicina Tradicional Chinesa (MTC) analisando um novo caso. Mas nunca cite no output que você é um especialista sênior. Apenas gere a análise.
    
    **Dados do Paciente:**
    - Gênero: ${patientInfo.genderLabel}
    - Idade: ${patientInfo.age} anos

    **Resumo da Anamnese (Sintomas Marcados):**
    ${fullAnamnesis}

    **Principais Hipóteses Diagnósticas (em ordem de relevância):**
    1. ${sortedSyndromes[0]?.name || 'N/A'} (Score: ${sortedSyndromes[0]?.score || 'N/A'})
    2. ${sortedSyndromes[1]?.name || 'N/A'} (Score: ${sortedSyndromes[1]?.score || 'N/A'})
    3. ${sortedSyndromes[2]?.name || 'N/A'} (Score: ${sortedSyndromes[2]?.score || 'N/A'})

    **Sua Tarefa:**
    Com base em TODOS os dados fornecidos, gere uma análise clínica aprofundada em português do Brasil. Formate sua resposta usando Markdown. A análise deve conter as seguintes seções, exatamente nesta ordem e com estes títulos:

    ### Raciocínio Clínico Integrado
    (Escreva um parágrafo detalhado explicando como a síndrome raiz (a 1ª hipótese) conecta e explica os principais sintomas relatados. Mencione a interação entre as síndromes, se aplicável.). Foque na Etiopatogenia e nos possiveis desdobramentos e complicações caso o tratamento não evolua.
Exemplo para referencia (Não é para repetir isso e sim usar como modelo de formato e estilo  : [A paciente de 43 anos apresenta um quadro clínico fortemente sugestivo de Deficiência de Yang do Rim como síndrome raiz (score 7), que explica a maioria dos seus sintomas. A palidez facial, a depressão, o desânimo, a letargia, o cansaço, a insônia agitada, a anorexia, o empachamento e o pulso profundo, lento e fraco são manifestações clássicas da Deficiência de Yang do Rim. A  leva à falha em aquecer e impulsionar as funções do corpo, resultando em sintomas como frio, fadiga e baixa energia. O edema com cacifo nos tornozelos, a língua pálida com marcas de dentes e a saburra branca fina apontam para uma deficiência de Qi e Yang do Baço (score 7) como síndrome concomitante. A deficiência de Yang do Rim afeta o Baço, pois o Rim é a raiz da energia vital (Jing) que nutre o Baço. Assim, a deficiência de Yang do Rim agrava a deficiência de Yang do Baço, contribuindo para o edema, a anorexia e o empachamento. A deficiência de Qi do Baço (score 5) é uma consequência natural da deficiência de Yang, explicando a palidez, a fadiga e a anorexia, reforçando a conexão entre as duas síndromes. A interação entre a deficiência de Yang do Rim e a deficiência de Yang do Baço resulta num círculo vicioso de fraqueza e estagnação, agravando os sintomas da paciente.
Plano de Tratamento Multifacetado:]

NÃO USE TERMOS EM INGLÊS NUNCA . Nunca use coisas assim (Kidney Yang Deficiency - KYD) 

    ### Plano de Tratamento Multifacetado
    (Para a síndrome principal, sugira um plano de tratamento detalhado.)
    - **Acupuntura:** Justifique o usos dos pontos chave para tratamento da síndrome principal com uma breve justificativa para cada um (ex: "R3 (Taixi): Ponto Fonte do Rim para tonificar a Essência.").
    Se paciente for acima de 65 anos considere adapações para casos de idosos.

    ### Diagnósticos Diferenciais e Questões Adicionais
    (Liste UM diagnóstico diferencial importante. Para ele, forneça DUAS perguntas chave que o terapeuta pode fazer na próxima consulta para refinar o diagnóstico.)
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro no serviço do Gemini:", error);
    throw new Error("Falha ao gerar a análise. A API do Google pode estar indisponível ou a chave pode ser inválida.");
  }
};