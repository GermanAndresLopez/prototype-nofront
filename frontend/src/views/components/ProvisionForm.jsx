import React, { useState } from 'react';
import { ProviderSelector } from './ProviderSelector.jsx';

export const ProvisionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    provider: '',
    builderType: 'standard',
    choice: '',
    specs: {
      region: '',
      size: '',
      name: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleProviderChange = (provider) => {
    setFormData({ ...formData, provider });
  };

  const handleSpecChange = (key, value) => {
    setFormData({
      ...formData,
      specs: { ...formData.specs, [key]: value }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="provision-form">
      <ProviderSelector
        value={formData.provider}
        onChange={handleProviderChange}
      />

      <div className="form-group">
        <label className="form-label">Tipo de Builder</label>
        <select
          className="form-select"
          value={formData.builderType}
          onChange={(e) => setFormData({ ...formData, builderType: e.target.value })}
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="basic">Basic</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Opción de Infraestructura</label>
        <input
          type="text"
          className="form-input"
          value={formData.choice}
          onChange={(e) => setFormData({ ...formData, choice: e.target.value })}
          placeholder="Ej: web, database, storage"
        />
      </div>

      <div className="specs-section">
        <h3>Especificaciones</h3>

        <div className="form-group">
          <label className="form-label">Región</label>
          <input
            type="text"
            className="form-input"
            value={formData.specs.region}
            onChange={(e) => handleSpecChange('region', e.target.value)}
            placeholder="Ej: us-east-1, westeurope"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tamaño/Tipo</label>
          <input
            type="text"
            className="form-input"
            value={formData.specs.size}
            onChange={(e) => handleSpecChange('size', e.target.value)}
            placeholder="Ej: t2.micro, Standard_B1s"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del Recurso</label>
          <input
            type="text"
            className="form-input"
            value={formData.specs.name}
            onChange={(e) => handleSpecChange('name', e.target.value)}
            placeholder="Nombre descriptivo"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={!formData.provider || isLoading}
      >
        {isLoading ? 'Aprovisionando...' : 'Aprovisionar Infraestructura'}
      </button>
    </form>
  );
};
