import React, { useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import { sections } from '../data/mtcData';

// <<< MUDANÇA 1: O QuestionCard agora também recebe o `selectedSymptoms` para saber quais caixas marcar.
function QuestionCard({ section, onSymptomChange, selectedSymptoms }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // O cabeçalho fica cinza se QUALQUER uma de suas perguntas estiver no conjunto de sintomas selecionados.
  const hasChecked = section.questions.some(q => selectedSymptoms.has(q.id));

  const handleHeaderClick = () => setIsOpen(!isOpen);

  // O QuestionCard agora chama diretamente a função do App.jsx
  const handleLocalCheckboxChange = (e, questionId) => {
    onSymptomChange(questionId, e.target.checked);
  };

  const headerStyle = hasChecked ? 'bg-gray-300 text-gray-800' : 'bg-blue-800 text-white';

  return (
    <div className="bg-white rounded-lg shadow-md draggable-card">
      <div onClick={handleHeaderClick} className={`p-4 cursor-grab flex justify-between items-center transition-colors duration-300 rounded-t-lg ${headerStyle}`}>
        <h3 className="text-lg font-semibold">{section.title}</h3>
        <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
      <div ref={contentRef} style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0' }} className="accordion-content px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-t pt-4">
          {section.questions.map(q => (
            <div key={q.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
              {/* <<< MUDANÇA 2: O 'checked' do input agora é controlado pelo estado do App.jsx */}
              <input id={q.id} type="checkbox" checked={selectedSymptoms.has(q.id)} onChange={(e) => handleLocalCheckboxChange(e, q.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor={q.id} className="ml-3 text-sm text-gray-600">{q.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// <<< MUDANÇA 3: O formulário agora recebe novas props e não tem mais seu próprio estado de sintomas.
function AnamnesisForm({ patientInfo, onSubmit, selectedSymptoms, onSymptomChange }) {
  const dashboardContainerRef = useRef(null);
  const filteredSections = sections.filter(s => s.gender === 'all' || s.gender === patientInfo.gender);

  useEffect(() => {
    if (dashboardContainerRef.current) {
      new Sortable(dashboardContainerRef.current, { draggable: '.draggable-card', animation: 150, ghostClass: 'sortable-ghost', handle: '.cursor-grab' });
    }
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">{patientInfo.name}</h2>
          <p className="text-sm text-gray-600">{patientInfo.genderLabel}, {patientInfo.age} anos</p>
        </div>
        <h1 className="text-4xl font-bold text-center text-blue-800">dIAgno 2.0 Ficha de Anamnese</h1>
        <p className="text-center text-gray-600 mt-2">Selecione os sintomas observados. Você pode arrastar os cards para reordená-los.</p>
      </header>
      <div ref={dashboardContainerRef} className="space-y-4">
        {filteredSections.map(section => (
          // <<< MUDANÇA 4: Passando as props corretas para cada QuestionCard.
          <QuestionCard 
            key={section.id} 
            section={section} 
            onSymptomChange={onSymptomChange} 
            selectedSymptoms={selectedSymptoms} 
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        {/* <<< MUDANÇA 5: O botão agora apenas chama onSubmit(), sem passar argumentos. */}
        <button onClick={onSubmit} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
          Gerar Relatório
        </button>
      </div>
    </div>
  );
}

export default AnamnesisForm;