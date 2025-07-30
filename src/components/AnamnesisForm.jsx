import React, { useState, useEffect, useRef } from 'react'; // <<< MUDANÇA: Importamos useEffect e useRef
import { sections } from '../data/mtcData';
import Tag from './Tag';

function QuestionCard({ section, selectedSymptoms, onSymptomChange, color }) {
  // ... (Nenhuma mudança neste componente)
  if (!section) return null;
  const safeColor = color || { bg: 'bg-gray-100', text: 'text-gray-800' };
  return (
    <div className={`bg-surface rounded-2xl shadow-sm border-t-4 ${safeColor.border}`}>
      <div className={`p-6 rounded-t-xl ${safeColor.bg}`}>
        <h3 className={`text-xl font-bold ${safeColor.text}`}>{section.title}</h3>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {section.questions.map(q => (
            <Tag key={q.id} label={q.label} isSelected={selectedSymptoms.has(q.id)} onClick={() => onSymptomChange(q.id, !selectedSymptoms.has(q.id))} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnamnesisForm({ patientInfo, onSubmit, selectedSymptoms, onSymptomChange }) {
  // ... (A lógica de estado e cores não muda)
  const filteredSections = sections.filter(s => s.gender === 'all' || s.gender === patientInfo.gender);
  const [activeSectionId, setActiveSectionId] = useState(filteredSections[0]?.id);
  const activeSection = filteredSections.find(s => s.id === activeSectionId);
  const cardColors = [
    { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-500' },
    { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' },
    { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-500' },
    { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-500' },
    { text: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-500' },
    { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-500' },
  ];
  const midpoint = Math.ceil(filteredSections.length / 2);
  const firstColumnSections = filteredSections.slice(0, midpoint);
  const secondColumnSections = filteredSections.slice(midpoint);
  const symptomCountPerSection = (sectionId) => {
    const section = filteredSections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.filter(q => selectedSymptoms.has(q.id)).length;
  };

  // <<< MUDANÇA 1: Criamos uma referência para o container do card de conteúdo
  const contentColumnRef = useRef(null);

  // <<< MUDANÇA 2: Usamos um useEffect para observar mudanças na seção ativa e fazer o scroll
  useEffect(() => {
    // Verifica se a referência existe
    if (contentColumnRef.current) {
      // Pede ao navegador para rolar suavemente até o topo do container do card
      contentColumnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // Alinha o topo do elemento com o topo da janela de visualização
      });
    }
  }, [activeSectionId]); // Este efeito roda toda vez que 'activeSectionId' muda

  return (
    <div className="min-h-screen bg-background text-text-main">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-12">
            {/* O header não muda */}
            <div className="bg-header-gradient p-8 rounded-2xl shadow-lg text-white mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold">dIAgno 2.0 <span className="font-light opacity-80">Beta</span></h1>
                  <p className="mt-2 opacity-90">Ficha de Anamnese Interativa</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold">{patientInfo.name}</h2>
                  <p className="text-sm opacity-90">{patientInfo.genderLabel}, {patientInfo.age} anos</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-text-subtle">
                <p><strong>Aviso:</strong> Esta é uma ferramenta de apoio aos estudos.</p>
                <p>Não utilize para diagnósticos clínicos reais.</p>
              </div>
              <button onClick={onSubmit} className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                  Gerar Relatório
              </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {/* O menu de navegação não muda */}
            <div className="bg-surface p-4 rounded-2xl shadow-sm sticky top-8">
              <h4 className="font-bold mb-4 text-text-main px-2">Seções</h4>
              <div className="flex gap-4">
                <nav className="flex flex-col gap-1 flex-1">
                  {firstColumnSections.map((section) => {
                    const count = symptomCountPerSection(section.id);
                    const isActive = section.id === activeSectionId;
                    const originalIndex = filteredSections.findIndex(s => s.id === section.id);
                    const color = cardColors[originalIndex % cardColors.length];
                    return (<button key={section.id} onClick={() => setActiveSectionId(section.id)} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center ${isActive ? `${color.bg} font-semibold` : 'hover:bg-gray-100'}`}><span className={isActive ? color.text : ''}>{section.title}</span>{count > 0 && (<span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{count}</span>)}</button>);
                  })}
                </nav>
                <nav className="flex flex-col gap-1 flex-1">
                  {secondColumnSections.map((section) => {
                    const count = symptomCountPerSection(section.id);
                    const isActive = section.id === activeSectionId;
                    const originalIndex = filteredSections.findIndex(s => s.id === section.id);
                    const color = cardColors[originalIndex % cardColors.length];
                    return (<button key={section.id} onClick={() => setActiveSectionId(section.id)} className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center ${isActive ? `${color.bg} font-semibold` : 'hover:bg-gray-100'}`}><span className={isActive ? color.text : ''}>{section.title}</span>{count > 0 && (<span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{count}</span>)}</button>);
                  })}
                </nav>
              </div>
            </div>
          </div>
          
          {/* <<< MUDANÇA 3: Adicionamos a referência e a margem superior */}
          <div className="lg:col-span-2 mt-12 md:mt-0" ref={contentColumnRef}>
            <QuestionCard 
              section={activeSection} 
              selectedSymptoms={selectedSymptoms}
              onSymptomChange={onSymptomChange}
              color={cardColors[filteredSections.findIndex(s => s.id === activeSectionId) % cardColors.length]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnamnesisForm;