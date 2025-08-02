// src/components/PatientInfoModal.jsx - VERSÃO COM GRADIENTE ANIMADO

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function PatientInfoModal({ onStart }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState('female');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleStart = () => {
    if ((!name && !isAnonymous) || !birthDate) {
      alert('Por favor, preencha a data de nascimento e o nome, ou marque a opção de paciente anônimo.');
      return;
    }
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    onStart({
      name: isAnonymous ? 'Paciente Anônimo' : name,
      birthDate: birthDate.toISOString().split('T')[0],
      gender,
      age,
      genderLabel: gender === 'male' ? 'Homem' : 'Mulher'
    });
  };

  return (
    // <<< MUDANÇA: Adicionamos as classes para o gradiente animado
    <div className="fixed inset-0 bg-main-page-gradient bg-[length:200%_200%] animate-gradient-move flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold text-gray-800">dIAgno 2.0</h1>
          <p className="text-sm text-gray-600">Versão Beta</p>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Informações do Paciente</h2>
        <div className="space-y-4">
          {!isAnonymous && (
            <div>
              <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo:</label>
              <input type="text" id="patient-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Nome do paciente" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Nasc.:</label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                placeholderText="Clique para selecionar"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gênero:</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="female">Mulher</option>
                <option value="male">Homem</option>
              </select>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input
              id="anonymous-checkbox"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="anonymous-checkbox" className="ml-2 block text-sm text-gray-900">
              Continuar como Paciente Anônimo
            </label>
          </div>
        </div>
        <button onClick={handleStart} className="mt-6 w-full bg-primary text-white py-3 font-bold rounded-lg hover:bg-primary-dark transition shadow-lg">Iniciar Anamnese</button>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            <strong>Aviso:</strong> Esta é uma ferramenta de apoio aos estudos e <strong>não substitui uma consulta profissional.</strong><br/> <strong>Ao clicar em "Iniciar Anamnese", você concorda com estes termos.</strong>
          </p>
           <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              <strong>Programação e Desenvolvimento:</strong> Ephraim Ferreira Medeiros<br />
              <strong>Conceito e Banco de Dados:</strong> Wu Tou Kwang<br />
              <strong>Baseado na planilha original de:</strong> Prof. Sérgio Destácio Junior (CEATA)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientInfoModal;