import React, { useState } from 'react';
import PatientInfoModal from './components/PatientInfoModal';
import AnamnesisForm from './components/AnamnesisForm';
import Report from './components/Report';
import { sections, syndromes } from './data/mtcData.js';

function App() {
  const [appState, setAppState] = useState('modal');
  const [patientInfo, setPatientInfo] = useState(null);
  const [syndromeScores, setSyndromeScores] = useState(null);

  // <<< MUDANÇA 1: O estado dos sintomas agora vive aqui, no componente principal.
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());

  const handleStartAnamnesis = (info) => {
    setPatientInfo(info);
    setAppState('form');
  };

  // <<< MUDANÇA 2: Nova função para o formulário usar para atualizar o estado.
  const handleSymptomChange = (questionId, isChecked) => {
    const newSet = new Set(selectedSymptoms);
    if (isChecked) {
      newSet.add(questionId);
    } else {
      newSet.delete(questionId);
    }
    setSelectedSymptoms(newSet);
  };
  
  // <<< MUDANÇA 3: A função agora usa o estado que já vive aqui, em vez de receber como argumento.
  const handleGenerateReport = () => {
    const scores = {};
    Object.keys(syndromes).forEach(key => {
        scores[key] = { score: 0, symptoms: [] };
    });

    sections.forEach(section => {
        section.questions.forEach(question => {
            if (selectedSymptoms.has(question.id)) { // Usa o estado local
                question.syndromes.forEach(syndromeKey => {
                    if (scores[syndromeKey] !== undefined) {
                        scores[syndromeKey].score++;
                        scores[syndromeKey].symptoms.push(`${section.title}: ${question.label}`);
                    }
                });
            }
        });
    });
    scores.allCheckedIds = selectedSymptoms;
    setSyndromeScores(scores);
    setAppState('report');
    window.scrollTo(0, 0);
  };

  const handleBackToForm = () => setAppState('form');
  const handleNewAnamnesis = () => window.location.reload();

  return (
    <div className="bg-gray-100 text-gray-800 font-sans min-h-screen">
      {appState === 'modal' && <PatientInfoModal onStart={handleStartAnamnesis} />}
      
      {appState === 'form' && patientInfo && (
        // <<< MUDANÇA 4: Passamos o estado e a função de atualização para o formulário.
        <AnamnesisForm 
            patientInfo={patientInfo} 
            onSubmit={handleGenerateReport}
            selectedSymptoms={selectedSymptoms}
            onSymptomChange={handleSymptomChange}
        />
      )}
      
      {appState === 'report' && patientInfo && syndromeScores && (
        <Report 
            patientInfo={patientInfo} 
            scores={syndromeScores} 
            onBack={handleBackToForm}
            onNew={handleNewAnamnesis}
        />
      )}
    </div>
  );
}

export default App;