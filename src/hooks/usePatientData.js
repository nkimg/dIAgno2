// src/hooks/usePatientData.js
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Precisaremos de uma biblioteca para gerar IDs únicos

// Hook para gerenciar todos os dados dos pacientes
export function usePatientData() {
  const [patients, setPatients] = useState([]);

  // Carrega os pacientes do localStorage quando o app inicia
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem('diagnoPatients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    } catch (error) {
      console.error("Erro ao carregar pacientes do localStorage:", error);
      setPatients([]);
    }
  }, []);

  // Salva os pacientes no localStorage sempre que a lista muda
  const saveData = (newPatients) => {
    try {
      localStorage.setItem('diagnoPatients', JSON.stringify(newPatients));
      setPatients(newPatients);
    } catch (error) {
      console.error("Erro ao salvar pacientes no localStorage:", error);
    }
  };

  const addPatient = (patientData) => {
    const newPatient = {
      id: uuidv4(), // Gera um ID único e seguro
      ...patientData,
      anamneses: [], // Um array para guardar o histórico de sessões
    };
    const updatedPatients = [...patients, newPatient];
    saveData(updatedPatients);
  };

  const updatePatient = (patientId, updatedData) => {
    const updatedPatients = patients.map(p => 
      p.id === patientId ? { ...p, ...updatedData } : p
    );
    saveData(updatedPatients);
  };

  const deletePatient = (patientId) => {
    const updatedPatients = patients.filter(p => p.id !== patientId);
    saveData(updatedPatients);
  };

  const addAnamnesis = (patientId, anamnesisData) => {
    const newAnamnesis = {
      id: uuidv4(),
      date: new Date().toISOString(), // Salva a data da anamnese
      ...anamnesisData,
    };
    const updatedPatients = patients.map(p =>
      p.id === patientId ? { ...p, anamneses: [...p.anamneses, newAnamnesis] } : p
    );
    saveData(updatedPatients);
  };

  return { patients, addPatient, updatePatient, deletePatient, addAnamnesis };
}