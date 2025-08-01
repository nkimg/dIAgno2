// src/App.jsx - VERSÃO COMPLETA QUE ORQUESTRA OS NOVOS DADOS

import React, { useState } from 'react';
import PatientInfoModal from './components/PatientInfoModal';
import AnamnesisForm from './components/AnamnesisForm';
import Report from './components/Report';
import { sections, syndromes } from './data/mtcData.js';

function App() {
  const [appState, setAppState] = useState('modal');
  const [patientInfo, setPatientInfo] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState(new Set());

  const handleStartAnamnesis = (info) => {
    setPatientInfo(info);
    setAppState('form');
  };

  const handlePatientUpdate = (updatedInfo) => {
    setPatientInfo(updatedInfo);
  };
  
  const handleGenerateReport = ({ queixaPrincipal, anotacoesExtras }) => {
    const scores = {};
    Object.keys(syndromes).forEach(key => {
        scores[key] = { score: 0, symptoms: [] };
    });
    sections.forEach(section => {
        section.questions.forEach(question => {
            if (selectedSymptoms.has(question.id)) {
                question.syndromes.forEach(syndromeKey => {
                    if (scores[syndromeKey]) {
                        scores[syndromeKey].score++;
                        scores[syndromeKey].symptoms.push(`${section.title}: ${question.label}`);
                    }
                });
            }
        });
    });
    scores.allCheckedIds = selectedSymptoms;

    setReportData({ 
        patientInfo, 
        scores, 
        queixaPrincipal, 
        anotacoesExtras 
    });
    setAppState('report');
    window.scrollTo(0, 0);
  };

  const handleBackToForm = () => {
    setAppState('form');
    window.scrollTo(0, 0); 
  };
  
  const handleNewAnamnesis = () => {
      window.location.reload();
  };

  if (appState === 'modal') {
    return <PatientInfoModal onStart={handleStartAnamnesis} />;
  }
  
  if (appState === 'form' && patientInfo) {
    return (
      <AnamnesisForm 
          patientInfo={patientInfo} 
          onSubmit={handleGenerateReport}
          selectedSymptoms={selectedSymptoms}
          onSymptomChange={(id, checked) => {
            const newSet = new Set(selectedSymptoms);
            checked ? newSet.add(id) : newSet.delete(id);
            setSelectedSymptoms(newSet);
          }}
          onPatientUpdate={handlePatientUpdate}
      />
    );
  }
  
  if (appState === 'report' && reportData) {
    return (
      <Report 
          reportData={reportData}
          onBack={handleBackToForm}
          onNew={handleNewAnamnesis}
      />
    );
  }

  return <PatientInfoModal onStart={handleStartAnamnesis} />;
}

export default App;