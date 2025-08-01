// src/components/Report.jsx - VERSÃO COMPLETA COM DADOS DE TEXTO CORRIGIDOS PARA A IA

import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { syndromes, sections, translations } from '../data/mtcData';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import { generatePremiumAnalysis } from '../services/geminiService';
import PrivacyConsentModal from './PrivacyConsentModal';

ChartJS.register(...registerables, MatrixController, MatrixElement);

const ActionButtons = ({ loadingPdf, onExport, onBack, onNew, isTop = false }) => {
    const baseClasses = "inline-flex items-center justify-center font-bold rounded-lg transition disabled:bg-gray-400";
    const topSizeClasses = "text-sm py-2 px-4";
    const bottomSizeClasses = "py-3 px-6";

    const exportClasses = "bg-red-600 text-white hover:bg-red-700";
    const backClasses = "bg-blue-500 text-white hover:bg-blue-600";
    const newClasses = "bg-gray-500 text-white hover:bg-gray-600";
    
    const containerClasses = isTop 
      ? "flex flex-col items-start gap-2" 
      : "mt-12 flex justify-center gap-4";

    return (
        <div id={isTop ? 'action-buttons-top' : 'action-buttons-bottom'} className={containerClasses}>
            <button onClick={onExport} disabled={loadingPdf} className={`${baseClasses} ${isTop ? topSizeClasses : bottomSizeClasses} ${exportClasses}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                {loadingPdf ? 'Gerando...' : 'Exportar PDF'}
            </button>
            <button onClick={onBack} className={`${baseClasses} ${isTop ? topSizeClasses : bottomSizeClasses} ${backClasses}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
                Voltar ao Formulário
            </button>
            <button onClick={onNew} className={`${baseClasses} ${isTop ? topSizeClasses : bottomSizeClasses} ${newClasses}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Iniciar Nova Anamnese
            </button>
        </div>
    );
};


function Report({ reportData, onBack, onNew }) {
    const { patientInfo, scores, queixaPrincipal, anotacoesExtras } = reportData;

    const reportRef = useRef(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [premiumAnalysis, setPremiumAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState('');
    const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

    const consultationDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const initialSortedSyndromes = Object.entries(scores)
        .map(([key, data]) => ({
            key, name: syndromes[key]?.name || key, description: syndromes[key]?.description || 'Sem descrição.', treatment: syndromes[key]?.treatment || '', score: data.score, symptoms: data.symptoms,
        }))
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score);

    const maxScore = initialSortedSyndromes[0]?.score || 0;

    const sortedSyndromes = initialSortedSyndromes.map(s => ({
        ...s,
        relevance: maxScore > 0 ? ((s.score / maxScore) * 100).toFixed(0) : 0
    }));

    let qiStatus = { 'Deficiência': 0, 'Estagnação': 0 };
    let yinYangStatus = { 'Def. Yin': 0, 'Def. Yang': 0, 'Excesso Yang': 0 };
    let pathogens = {};
    sortedSyndromes.slice(0, 3).forEach(s => {
        const synData = syndromes[s.key] || {};
        if (synData.substance === 'qi' && synData.category === 'deficiency') qiStatus['Deficiência'] += s.score;
        if (synData.substance === 'qi' && synData.category === 'stagnation') qiStatus['Estagnação'] += s.score;
        if (synData.substance === 'yin' && synData.category === 'deficiency') yinYangStatus['Def. Yin'] += s.score;
        if (synData.substance === 'yang' && synData.category === 'deficiency') yinYangStatus['Def. Yang'] += s.score;
        if (synData.substance === 'yang' && synData.category === 'excess') yinYangStatus['Excesso Yang'] += s.score;
        if (synData.pathogen) {
            const translatedPathogen = translations[synData.pathogen] || synData.pathogen;
            if (!pathogens[translatedPathogen]) pathogens[translatedPathogen] = 0;
            pathogens[translatedPathogen] += s.score;
        }
    });
    const topPathogens = Object.keys(pathogens).join(', ') || 'Nenhum detectado';
    
    const categoryScores = {};
    sections.forEach(section => {
        let count = section.questions.filter(q => scores.allCheckedIds?.has(q.id)).length;
        if (count > 0) categoryScores[section.title] = count;
    });

    const radarData = { labels: Object.keys(categoryScores), datasets: [{ label: 'Sintomas Marcados', data: Object.values(categoryScores), fill: true, backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)' }] };
    const secondarySyndromes = sortedSyndromes.slice(3, 6);
    const barData = { labels: secondarySyndromes.map(s => s.name.replace(/<b>|<\/b>/g, '')), datasets: [{ label: 'Pontos', data: secondarySyndromes.map(s => s.score), backgroundColor: 'rgba(153, 102, 255, 0.6)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 }] };
    
    const heatmapCanvasRef = useRef(null);
    useEffect(() => {
        const heatmapCtx = heatmapCanvasRef.current?.getContext('2d');
        if (!heatmapCtx) return;
        const zangfuY = ['Fígado', 'Coração', 'Baço', 'Pulmão', 'Rim', 'Bexiga', 'Estômago', 'Intestino Grosso', 'Intestino Delgado', 'Vesícula Biliar'];
        const patternsX = ['Def. Qi', 'Def. Yang', 'Def. Yin', 'Def. Xue', 'Estagnação Qi', 'Estagnação Xue', 'Umidade-Calor', 'Fogo', 'Vento', 'Frio'];
        const heatmapData = [];
        sortedSyndromes.forEach(s => {
             const synData = syndromes[s.key] || {};
             let patternLabel = '';
             if (synData.category === 'deficiency' && synData.substance === 'qi') patternLabel = 'Def. Qi';
             if (synData.category === 'deficiency' && synData.substance === 'yang') patternLabel = 'Def. Yang';
             if (synData.category === 'deficiency' && synData.substance === 'yin') patternLabel = 'Def. Yin';
             if (synData.category === 'deficiency' && synData.substance === 'xue') patternLabel = 'Def. Xue';
             if (synData.category === 'stagnation' && synData.substance === 'qi') patternLabel = 'Estagnação Qi';
             if (synData.category === 'stagnation' && synData.substance === 'xue') patternLabel = 'Estagnação Xue';
             if (synData.pathogen === 'damp-heat') patternLabel = 'Umidade-Calor';
             if (synData.pathogen === 'fire') patternLabel = 'Fogo';
             if (synData.pathogen === 'wind') patternLabel = 'Vento';
             if (synData.pathogen === 'cold') patternLabel = 'Frio';
            if (synData.zangfu && patternLabel) {
                heatmapData.push({ x: patternLabel, y: synData.zangfu, v: s.score });
            }
        });
        const chart = new ChartJS(heatmapCtx, {
            type: 'matrix', data: { datasets: [{ label: 'Pontuação', data: heatmapData, backgroundColor: (ctx) => { const value = ctx.dataset.data[ctx.dataIndex]?.v; if (!value) return 'rgba(240, 240, 240, 0.5)'; const alpha = 0.1 + (value / 5); return `rgba(255, 99, 132, ${alpha > 1 ? 1 : alpha})`; }, borderColor: 'rgba(200, 200, 200, 0.6)', borderWidth: 1, width: ({chart}) => (chart.chartArea || {}).width / patternsX.length - 1, height: ({chart}) => (chart.chartArea || {}).height / zangfuY.length - 1 }] },
            options: { scales: { x: { type: 'category', labels: patternsX, grid: { display: false } }, y: { type: 'category', labels: zangfuY, grid: { display: false }, offset: true } }, plugins: { legend: { display: false }, tooltip: { callbacks: { title: () => '', label: (ctx) => `Padrão: ${ctx.raw.x}, ${ctx.raw.y} | Pontos: ${ctx.raw.v}` } } } }
        });
        return () => chart.destroy();
    }, [sortedSyndromes]);

    const mainSyndrome = sortedSyndromes[0];
    const relatedSyndromesData = {};
    if(mainSyndrome){
        mainSyndrome.symptoms.forEach(symptomLabel => {
            sections.forEach(section => {
                section.questions.forEach(question => {
                    if (`${section.title}: ${question.label}` === symptomLabel) {
                        question.syndromes.forEach(relatedKey => {
                            if (relatedKey !== mainSyndrome.key) {
                                if (!relatedSyndromesData[relatedKey]) { relatedSyndromesData[relatedKey] = { name: syndromes[relatedKey]?.name || relatedKey, sharedSymptoms: [] }; }
                                relatedSyndromesData[relatedKey].sharedSymptoms.push(question.label);
                            }
                        });
                    }
                });
            });
        });
    }
    const sortedRelated = Object.values(relatedSyndromesData).sort((a, b) => b.sharedSymptoms.length - a.sharedSymptoms.length);

    const handleConfirmAndAnalyze = async () => {
        setIsPrivacyModalVisible(false);
        setIsAnalyzing(true);
        setAnalysisError('');
        setPremiumAnalysis('');
        try {
            let fullAnamnesisText = '';
            sections.forEach(section => {
                const checkedQuestions = section.questions.filter(q => scores.allCheckedIds?.has(q.id));
                if (checkedQuestions.length > 0) {
                    fullAnamnesisText += `\n**${section.title}:**\n`;
                    checkedQuestions.forEach(q => { fullAnamnesisText += `- ${q.label}\n`; });
                }
            });
            // <<< MUDANÇA: Passando as variáveis corretas para a API
            const analysis = await generatePremiumAnalysis(patientInfo, sortedSyndromes, fullAnamnesisText, queixaPrincipal, anotacoesExtras);
            setPremiumAnalysis(analysis);
        } catch (error) {
            setAnalysisError(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExportPdf = () => {
        setLoadingPdf(true);
        const reportElement = reportRef.current;
        const topButtons = reportElement.querySelector('#action-buttons-top');
        const bottomButtons = reportElement.querySelector('#action-buttons-bottom');
        const heatmapContainer = reportElement.querySelector('#heatmap-container');
        
        if (topButtons) topButtons.style.display = 'none';
        if (bottomButtons) bottomButtons.style.display = 'none';
        if (heatmapContainer) heatmapContainer.style.display = 'none';

        setTimeout(() => {
            html2canvas(reportElement, { scale: 2, useCORS: true, windowHeight: reportElement.scrollHeight, scrollY: -window.scrollY })
                .then(canvas => {
                    const pdfWidth = 210;
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] });
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`relatorio-${patientInfo.name.replace(/ /g, '_') || 'paciente'}.pdf`);
                })
                .finally(() => {
                    if (topButtons) topButtons.style.display = '';
                    if (bottomButtons) bottomButtons.style.display = '';
                    if (heatmapContainer) heatmapContainer.style.display = '';
                    setLoadingPdf(false);
                });
        }, 100);
    };

    if (sortedSyndromes.length === 0) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Nenhum sintoma selecionado.</h2>
                <button onClick={onBack} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">Voltar ao Formulário</button>
            </div>
        );
    }

  return (
    <>
      <div ref={reportRef} className="container mx-auto p-4 md:p-8 bg-background font-sans">
          <header className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-4">
                  <img src="/logo.png" alt="dIAgno 2.0 Logo" className="w-24 h-auto" />
                  <ActionButtons 
                      loadingPdf={loadingPdf} 
                      onExport={handleExportPdf} 
                      onBack={onBack} 
                      onNew={onNew} 
                      isTop={true} 
                  />
              </div>
              <div className="text-right">
                  <h1 className="text-3xl font-bold text-gray-800">Relatório de Paciente</h1>
                  <p className="text-lg text-gray-600 mt-1">{patientInfo.name}</p>
                  <p className="text-sm text-gray-500">{patientInfo.genderLabel}, {patientInfo.age} anos</p>
                  <p className="text-sm font-semibold text-primary mt-2">{consultationDate}</p>
              </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                  <h3 className="font-bold text-lg text-blue-800 mb-1">Situação do Qi</h3>
                  <p className="text-sm text-blue-700">Deficiência: {qiStatus['Deficiência']} | Estagnação: {qiStatus['Estagnação']}</p>
              </div>
              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                  <h3 className="font-bold text-lg text-green-800 mb-1">Balanço Yin/Yang</h3>
                  <p className="text-sm text-green-700">Def. Yin: {yinYangStatus['Def. Yin']} | Def. Yang: {yinYangStatus['Def. Yang']} | Excesso Yang: {yinYangStatus['Excesso Yang']}</p>
              </div>
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                  <h3 className="font-bold text-lg text-red-800 mb-1">Qi Perverso</h3>
                  <p className="text-sm text-red-700">{topPathogens}</p>
              </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg mb-8 border border-indigo-200">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-semibold text-primary">Análise Premium com IA</h2>
                      <p className="text-text-subtle text-sm">Insights aprofundados gerados pelo Gemini.</p>
                  </div>
                  <button onClick={() => setIsPrivacyModalVisible(true)} disabled={isAnalyzing} className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-wait">
                      {isAnalyzing ? 'Analisando...' : 'Gerar Análise'}
                  </button>
              </div>
              {isAnalyzing && <div className="text-center p-8 text-primary">Analisando o caso, por favor aguarde...</div>}
              {analysisError && <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">{analysisError}</div>}
              {premiumAnalysis && (
                  <div className="mt-6 bg-white p-6 rounded-lg shadow-inner">
                      <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-primary prose-strong:text-text-main prose-li:marker:text-primary">
                          <ReactMarkdown>{premiumAnalysis}</ReactMarkdown>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-6 pt-4 border-t border-slate-200">
                          <strong>Aviso:</strong> Esta análise foi gerada por IA (Gemini) e pode conter imprecisões. Utilize-a como um apoio ao seu raciocínio clínico, não como um substituto para o julgamento profissional.
                      </p>
                  </div>
              )}
          </div>
      
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Principais Hipóteses Diagnósticas</h2>
                      <div className="space-y-4">
                          {sortedSyndromes.slice(0, 3).map((s, index) => {
                               const colors = ['bg-green-100 border-green-400', 'bg-yellow-100 border-yellow-400', 'bg-orange-100 border-orange-400'];
                               return (
                                  <div key={s.key} className={`p-4 rounded-lg border-2 ${colors[index]} shadow-md`}>
                                      <h3 className="text-xl font-bold text-gray-800">{index + 1}º Hipótese: {s.name.replace(/<b>|<\/b>/g, '')}</h3>
                                      <p className="text-sm text-gray-600 mb-2"><strong>Pontos:</strong> {s.score} | <strong>Relevância:</strong> {s.relevance}%</p>
                                      <div className="mb-3"><strong className="text-sm text-gray-700">Sintomas Marcados:</strong><div className="mt-2 flex flex-wrap gap-2">{s.symptoms.map(symptom => <span key={symptom} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{symptom}</span>)}</div></div>
                                      <p className="text-gray-700 mb-3"><strong>Descrição Geral:</strong> {s.description}</p>
                                      <div className="p-3 bg-white rounded border text-sm" dangerouslySetInnerHTML={{ __html: s.treatment || '<i>Nenhuma sugestão de tratamento encontrada.</i>' }}></div>
                                  </div>
                               )
                          })}
                      </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Hipóteses Secundárias (4ª a 6ª)</h2>
                      {secondarySyndromes.length > 0 ? <Bar data={barData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } } }} /> : <p>Não há hipóteses secundárias.</p>}
                  </div>
                  <div id="heatmap-container" className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Heatmap de Padrões por Órgão (Zang-Fu)</h2>
                      <canvas ref={heatmapCanvasRef}></canvas>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Resumo da Anamnese</h2>
                      <div className="space-y-3 text-sm">
                          {sections.map(section => {
                               const checkedQuestions = section.questions.filter(q => scores.allCheckedIds?.has(q.id));
                               if (checkedQuestions.length === 0) return null;
                               return (
                                  <div key={section.id} className="mb-2">
                                      <strong className="font-semibold text-gray-700">{section.title}:</strong>
                                      <ul className="list-disc list-inside ml-2">
                                          {checkedQuestions.map(q => <li key={q.id}>{q.label}</li>)}
                                      </ul>
                                  </div>
                               )
                          })}
                      </div>
                  </div>
              </div>
              <div className="space-y-6">
                  <div className="bg-indigo-50 p-6 rounded-lg shadow-lg">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Síndromes Correlacionadas</h2>
                      <p className="text-sm text-gray-600 mb-3">Síndromes que frequentemente aparecem juntas com a hipótese principal.</p>
                      <div className="space-y-2">
                          {sortedRelated.length > 0 ? sortedRelated.map(related => (
                              <div key={related.name} className="p-3 bg-gray-50 rounded-md border">
                                  <p className="font-semibold text-gray-800">{related.name}</p>
                                  <p className="text-xs text-gray-600 mb-2">Compartilha {related.sharedSymptoms.length} sintoma(s):</p>
                                  <div className="flex flex-wrap gap-1">{related.sharedSymptoms.map(symptom => <span key={symptom} className="inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{symptom}</span>)}</div>
                              </div>
                          )) : <p className="text-sm text-gray-500">Nenhuma correlação forte encontrada.</p>}
                      </div>
                  </div>
                  <div className="bg-teal-50 p-6 rounded-lg shadow-lg">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Análise por Categoria de Sintomas</h2>
                      <Radar data={radarData} options={{ plugins: { legend: { display: false } }, scales: { r: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                  </div>
              </div>
          </div>
      
          <ActionButtons 
              loadingPdf={loadingPdf} 
              onExport={handleExportPdf} 
              onBack={onBack} 
              onNew={onNew} 
          />

          <div className="mt-10 text-center border-t border-gray-300 pt-4">
              <p className="text-xs text-gray-500">
                  <strong>Aviso Importante:</strong> Este relatório foi gerado como referência de estudos e não se destina à aplicação profissional ou diagnóstico clínico. A interpretação dos dados é de responsabilidade de um profissional qualificado.
              </p>
          </div>
      </div>
      <PrivacyConsentModal
        isOpen={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
        onConfirm={handleConfirmAndAnalyze}
      />
    </>
  );
}

export default Report;