// src/components/EditPatientModal.jsx - VERSÃO CORRIGIDA

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function EditPatientModal({ isOpen, onClose, currentPatient, onSave }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);

  useEffect(() => {
    if (currentPatient && isOpen) { // Popula os dados apenas quando o modal abre
      setName(currentPatient.name);
      // Garante que a data seja um objeto Date válido ou null
      setBirthDate(currentPatient.birthDate ? new Date(currentPatient.birthDate) : null);
    }
  }, [currentPatient, isOpen]);

  const handleSave = () => {
    if (!name || !birthDate) {
      alert('O nome e a data de nascimento não podem ficar em branco.');
      return;
    }

    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    onSave({
      ...currentPatient,
      name,
      birthDate: birthDate.toISOString().split('T')[0],
      age,
    });

    // <<< MUDANÇA: Adicionar esta linha para fechar o modal
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-primary mb-6">Editar Informações do Paciente</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-patient-name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo:</label>
            <input 
              type="text" 
              id="edit-patient-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md" 
            />
          </div>
          <div>
            <label htmlFor="edit-birth-date" className="block text-sm font-medium text-gray-700 mb-1">Data de Nasc.:</label>
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button 
            onClick={onClose} 
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPatientModal;