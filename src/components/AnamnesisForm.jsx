// src/components/AnamnesisForm.jsx - VERSÃO COM CAMPOS REORDENADOS E BORDAS CORRIGIDAS

import React, { useState, useEffect, useRef } from 'react';
import { sections } from '../data/mtcData';
import Tag from './Tag';
import EditPatientModal from './EditPatientModal';

function QuestionCard({ section, selectedSymptoms, onSymptomChange, colorName }) {
  if (!section) return null;
  const styleMap = {
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-500' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-500' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-500' },
    lime: { bg: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-500' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-500' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
  };
  const activeStyle = styleMap[colorName] || styleMap.default;
  return (
    <div className={`bg-surface rounded-2xl shadow-sm border-t-4 ${activeStyle.border}`}>
      <div className={`p-6 rounded-t-xl ${activeStyle.bg}`}>
        <h3 className={`text-xl font-bold ${activeStyle.text}`}>{section.title}</h3>
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

function NavButton({ section, isActive, colorName, onClick, count }) {
  const styleMap = {
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    lime: { bg: 'bg-lime-50', text: 'text-lime-600' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800' }
  };
  const activeStyle = styleMap[colorName] || styleMap.default;
  const baseClasses = "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 flex justify-between items-center";
  const activeClasses = `${activeStyle.bg} font-semibold`;
  const inactiveClasses = "font-medium hover:bg-gray-100";
  const textActiveClasses = activeStyle.text;
  const textInactiveClasses = "text-text-subtle";
  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <span className={isActive ? textActiveClasses : textInactiveClasses}>{section.title}</span>
      {count > 0 && (<span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{count}</span>)}
    </button>
  );
}

function AnamnesisForm({ patientInfo, onSubmit, selectedSymptoms, onSymptomChange, onPatientUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [queixaPrincipal, setQueixaPrincipal] = useState('');
  const [anotacoesExtras, setAnotacoesExtras] = useState('');

  const filteredSections = sections.filter(s => s.gender === 'all' || s.gender === patientInfo.gender);
  const [activeSectionId, setActiveSectionId] = useState(filteredSections[0]?.id);
  const activeSection = filteredSections.find(s => s.id === activeSectionId);
  const cardColorNames = ['rose', 'amber', 'teal', 'indigo', 'lime', 'cyan'];
  const midpoint = Math.ceil(filteredSections.length / 2);
  const firstColumnSections = filteredSections.slice(0, midpoint);
  const secondColumnSections = filteredSections.slice(midpoint);
  const contentColumnRef = useRef(null);

  useEffect(() => {
    if (contentColumnRef.current) {
      contentColumnRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSectionId]);

  const symptomCountPerSection = (sectionId) => {
    const section = filteredSections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.filter(q => selectedSymptoms.has(q.id)).length;
  };

  return (
    <>
      <div className="min-h-screen bg-anamnesis-gradient text-text-main font-sans">
        <div className="container mx-auto p-4 md:p-8">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <img src="/logo.png" alt="dIAgno 2.0 Logo" className="h-24 w-auto" />
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary">dIAgno 2.0 <span className="font-light text-3xl text-primary/80">Beta</span></h1>
                <p className="text-xs text-text-subtle mt-1">Ficha de Anamnese Interativa</p>
              </div>
              <div className="w-24"></div> 
            </div>
            <div className="text-center text-xs text-text-subtle">
              <p><strong>Aviso:</strong> Esta é uma ferramenta de apoio aos estudos e não substitui uma consulta profissional.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-sm sticky top-8 border border-white">
                <h4 className="font-bold mb-4 text-text-main px-2">Seções</h4>
                <div className="flex gap-4">
                  <nav className="flex flex-col gap-1 flex-1">
                    {firstColumnSections.map((section) => {
                      const originalIndex = filteredSections.findIndex(s => s.id === section.id);
                      return (<NavButton key={section.id} section={section} isActive={section.id === activeSectionId} colorName={cardColorNames[originalIndex % cardColorNames.length]} onClick={() => setActiveSectionId(section.id)} count={symptomCountPerSection(section.id)} />);
                    })}
                  </nav>
                  <nav className="flex flex-col gap-1 flex-1">
                    {secondColumnSections.map((section) => {
                      const originalIndex = filteredSections.findIndex(s => s.id === section.id);
                      return (<NavButton key={section.id} section={section} isActive={section.id === activeSectionId} colorName={cardColorNames[originalIndex % cardColorNames.length]} onClick={() => setActiveSectionId(section.id)} count={symptomCountPerSection(section.id)} />);
                    })}
                  </nav>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-8" ref={contentColumnRef}>
              <div className="bg-surface p-6 rounded-2xl shadow-sm flex justify-between items-center">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold text-text-main">{patientInfo.name}</h2>
                  <p className="text-base text-text-subtle mt-1">{patientInfo.genderLabel}, {patientInfo.age} anos</p>
                </div>
                <button onClick={() => setIsEditModalOpen(true)} className="text-text-subtle hover:text-primary transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              
              {/* <<< MUDANÇA: Bloco Queixa Principal movido para cima */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <label htmlFor="queixa-principal" className="block text-lg font-bold text-blue-800 mb-2">Queixa Principal</label>
                <textarea 
                  id="queixa-principal"
                  rows="3"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
                  placeholder="Descreva a principal queixa do paciente..."
                  value={queixaPrincipal}
                  onChange={(e) => setQueixaPrincipal(e.target.value)}
                />
              </div>

              <QuestionCard 
                section={activeSection} 
                selectedSymptoms={selectedSymptoms}
                onSymptomChange={onSymptomChange}
                colorName={cardColorNames[filteredSections.findIndex(s => s.id === activeSectionId) % cardColorNames.length]}
              />

              {/* <<< MUDANÇA: Bloco Anotações Extras movido para baixo */}
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg">
                <label htmlFor="anotacoes-extras" className="block text-lg font-bold text-gray-800 mb-2">Anotações Extras</label>
                <textarea 
                  id="anotacoes-extras"
                  rows="3"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white"
                  placeholder="Observações adicionais do terapeuta, pulso, língua..."
                  value={anotacoesExtras}
                  onChange={(e) => setAnotacoesExtras(e.target.value)}
                />
              </div>
              
              <div className="text-center">
                <button onClick={() => onSubmit({ queixaPrincipal, anotacoesExtras })} className="bg-primary text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105">
                  Gerar Relatório
                </button>
                <p className="text-xs text-text-subtle mt-2">
                  Clique aqui quando terminar a anamnese
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditPatientModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentPatient={patientInfo}
        onSave={onPatientUpdate}
      />
    </>
  );
}

export default AnamnesisForm;