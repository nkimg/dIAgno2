// src/components/PatientDashboard.jsx
import React from 'react';

function PatientDashboard({ patients, onAddNew, onSelectPatient, onDeletePatient }) {
  return (
    <div className="min-h-screen bg-page-gradient p-8 font-sans">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary">dIAgno 2.0 <span className="font-light text-3xl text-primary/80">Beta</span></h1>
          <p className="text-text-subtle mt-2">Seu assistente de diagnóstico em MTC</p>
        </header>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-main">Lista de Pacientes</h2>
          <button
            onClick={onAddNew}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
          >
            + Adicionar Novo Paciente
          </button>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm p-6">
          {patients.length > 0 ? (
            <ul className="divide-y divide-border-color">
              {patients.map(patient => (
                <li key={patient.id} className="flex justify-between items-center py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-light text-primary font-bold text-xl h-12 w-12 rounded-full flex items-center justify-center">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-text-main">{patient.name}</p>
                      <p className="text-sm text-text-subtle">{patient.genderLabel}, {patient.age} anos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-text-subtle bg-gray-100 px-3 py-1 rounded-full">
                      {patient.anamneses.length} {patient.anamneses.length === 1 ? 'Anamnese' : 'Anamneses'}
                    </span>
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                      Iniciar Nova Sessão
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja deletar ${patient.name}? Esta ação não pode ser desfeita.`)) {
                          onDeletePatient(patient.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Deletar Paciente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-subtle">Nenhum paciente cadastrado ainda.</p>
              <p className="text-text-subtle mt-2">Clique em "Adicionar Novo Paciente" para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;