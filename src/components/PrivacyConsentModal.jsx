// src/components/PrivacyConsentModal.jsx

import React from 'react';

function PrivacyConsentModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg font-sans"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Análise com Inteligência Artificial</h2>
        <p className="text-text-subtle mb-6">
          Você está prestes a usar a Análise Premium. Para gerar insights aprofundados, precisamos enviar alguns dados anonimizados para a API do Google (Gemini).
        </p>

        <div className="space-y-4 text-left mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h3 className="font-bold text-green-800">Quais dados serão enviados:</h3>
            <ul className="list-disc list-inside text-sm text-green-700 mt-2">
              <li>Lista de sintomas selecionados</li>
              <li>Idade e Gênero do paciente (sem identificação)</li>
              <li>As principais síndromes calculadas pelo sistema</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h3 className="font-bold text-red-800">Quais dados NUNCA serão enviados:</h3>
            <ul className="list-disc list-inside text-sm text-red-700 mt-2">
              <li>Nome do paciente</li>
              <li>Data de Nascimento completa</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Ao clicar em "Confirmar", você concorda com o envio desses dados anonimizados para fins de análise.
        </p>
        
        <div className="flex justify-end gap-4">
          <button 
            onClick={onClose} 
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Confirmar e Analisar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivacyConsentModal;