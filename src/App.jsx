// src/App.jsx - VERSÃO COMPLETA E RESTAURADA

import React, { useState } from 'react';
import PatientInfoModal from './components/PatientInfoModal';
import AnamnesisForm from './components/AnamnesisForm';
import Report from './components/Report';
import { sections, syndromes } from './data/mtcData.js';

function App() {
  const [appState, setAppState] = useState('modal');
  const [patientInfo, setPatientInfo] = useState(null);
  const [syndromeScores, setSyndromeScores] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());

  const handleStartAnamnesis = (info) => {
    setPatientInfo(info);
    setAppState('form');
  };

  const handleSymptomChange = (questionId, isChecked) => {
    const newSet = new Set(selectedSymptoms);
    isChecked ? newSet.add(questionId) : newSet.delete(questionId);
    setSelectedSymptoms(newSet);
  };
  
  const handleGenerateReport = () => {
    const scores = {};
    Object.keys(syndromes).forEach(key => {
        scores[key] = { score: 0, symptoms: [] };
    });

    sections.forEach(section => {
        section.questions.forEach(question => {
            if (selectedSymptoms.has(question.id)) {
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

  const handleBackToForm = () => {
    setAppState('form');
    window.scrollTo(0, 0); 
  };
  
  const handleNewAnamnesis = () => window.location.reload();

  return (
    <div className="bg-background text-text-main font-sans min-h-screen">
      {appState === 'modal' && <PatientInfoModal onStart={handleStartAnamnesis} />}
      
      {appState === 'form' && patientInfo && (
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