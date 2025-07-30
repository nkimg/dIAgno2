import React, { useState } from 'react';
// <<< MUDANÇA 1: Importar o componente DatePicker e seu CSS
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function PatientInfoModal({ onStart }) {
  const [name, setName] = useState('');
  // <<< MUDANÇA 2: O estado agora pode ser 'null' ou um objeto Date
  const [birthDate, setBirthDate] = useState(null); 
  const [gender, setGender] = useState('female');

  const handleStart = () => {
    if (!name || !birthDate) {
      alert('Por favor, preencha o nome e a data de nascimento.');
      return;
    }
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    onStart({
      name,
      // Passamos a data como um objeto Date
      birthDate: birthDate.toISOString().split('T')[0], // formato YYYY-MM-DD
      gender,
      age,
      genderLabel: gender === 'male' ? 'Homem' : 'Mulher'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* ... (cabeçalho do modal não muda) ... */}
        <h2 className="text-2xl font-bold mb-6 font-sans">Informações do Paciente</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo:</label>
            <input type="text" id="patient-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Nome do paciente" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Nasc.:</label>
              {/* <<< MUDANÇA 3: Substituímos o input pelo componente DatePicker */}
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select" // Permite rolar facilmente pelos anos/meses
                yearDropdownItemNumber={100} // Mostra 100 anos no dropdown
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
        </div>
        <button onClick={handleStart} className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition">Iniciar Anamnese</button>
        {/* ... (rodapé do modal não muda) ... */}
      </div>
    </div>
  );
}

export default PatientInfoModal;