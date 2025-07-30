import React, { useState } from 'react';

function PatientInfoModal({ onStart }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('female');

  const handleStart = () => {
    if (!name || !birthDate) {
      alert('Por favor, preencha o nome e a data de nascimento.');
      return;
    }
    // Calcula a idade
    const ageDifMs = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    onStart({
      name,
      birthDate,
      gender,
      age,
      genderLabel: gender === 'male' ? 'Homem' : 'Mulher'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-500">dIAgno 2.0</h1>
          <p className="text-sm text-gray-400">Versão Beta</p>
        </div>
        <h2 className="text-2xl font-bold mb-6">Informações do Paciente</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo:</label>
            <input type="text" id="patient-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Nome do paciente" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Nasc.:</label>
              <input type="date" id="birth-date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gênero:</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option value="female">Mulher</option>
                <option value="male">Homem</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={handleStart} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Iniciar Anamnese</button>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <strong>Aviso:</strong> Esta é uma ferramenta de apoio aos estudos e <strong>não substitui uma consulta profissional.</strong> Seu uso é destinado a ambientes educacionais. Não utilize para diagnósticos clínicos reais. <br /> <strong>Ao clicar em "Iniciar Anamnese", você concorda com estes termos.</strong>
          </p>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400">
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