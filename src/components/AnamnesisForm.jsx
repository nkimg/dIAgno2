import React, { useState, useEffect, useRef } from 'react';
import { sections } from '../data/mtcData';
import Tag from './Tag'; // <<< Importamos nosso novo componente Tag

// O QuestionCard agora é muito mais simples. Não é mais um acordeão.
// É apenas um container para as nossas Tags.
function QuestionCard({ section, selectedSymptoms, onSymptomChange }) {
  // Se a seção não existir, não renderiza nada.
  if (!section) return null;

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold text-text-main mb-6 border-b border-border-color pb-4">
        {section.title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {section.questions.map(q => (
          <Tag
            key={q.id}
            label={q.label}
            isSelected={selectedSymptoms.has(q.id)}
            // A lógica de clique é invertida aqui
            onClick={() => onSymptomChange(q.id, !selectedSymptoms.has(q.id))}
          />
        ))}
      </div>
    </div>
  );
}

function AnamnesisForm({ patientInfo, onSubmit, selectedSymptoms, onSymptomChange }) {
  const filteredSections = sections.filter(s => s.gender === 'all' || s.gender === patientInfo.gender);
  
  // <<< MUDANÇA PRINCIPAL: Estado para controlar qual seção está ativa
  const [activeSectionId, setActiveSectionId] = useState(filteredSections[0]?.id);

  const activeSection = filteredSections.find(s => s.id === activeSectionId);

  // Conta quantos sintomas estão marcados em cada seção
  const symptomCountPerSection = (sectionId) => {
    const section = filteredSections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.filter(q => selectedSymptoms.has(q.id)).length;
  };

  return (
    // Usamos nossas novas cores do tema aqui
    <div className="min-h-screen bg-background text-text-main">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <div className="bg-surface p-4 rounded-2xl shadow-sm mb-6 text-center">
            <h2 className="text-xl font-bold text-text-main">{patientInfo.name}</h2>
            <p className="text-sm text-text-subtle">{patientInfo.genderLabel}, {patientInfo.age} anos</p>
          </div>
          <h1 className="text-4xl font-bold text-center text-primary">Ficha de Anamnese</h1>
        </header>

        {/* <<< MUDANÇA DE LAYOUT: Grid de duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Coluna da Esquerda: Navegação */}
          <div className="md:col-span-1">
            <div className="bg-surface p-4 rounded-2xl shadow-sm sticky top-8">
              <h4 className="font-bold mb-4 text-text-main px-2">Seções</h4>
              <nav className="flex flex-col gap-1">
                {filteredSections.map(section => {
                  const count = symptomCountPerSection(section.id);
                  const isActive = section.id === activeSectionId;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 flex justify-between items-center ${isActive ? 'bg-primary-light text-primary font-semibold' : 'hover:bg-gray-100'}`}
                    >
                      <span>{section.title}</span>
                      {/* Mostra uma "badge" com a contagem de sintomas marcados */}
                      {count > 0 && (
                        <span className="bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Coluna da Direita: Conteúdo da Seção Ativa */}
          <div className="md:col-span-3">
            <QuestionCard 
              section={activeSection} 
              selectedSymptoms={selectedSymptoms}
              onSymptomChange={onSymptomChange}
            />
             <div className="mt-8 text-center">
                <button 
                  onClick={onSubmit} 
                  className="bg-primary text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                >
                  Gerar Relatório
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnamnesisForm;