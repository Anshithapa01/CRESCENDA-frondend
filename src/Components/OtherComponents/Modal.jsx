import React from 'react';
import Button from './Button';

const Modal = ({ title, fields, values, onSave, onCancel, onChange, formErrors, handleFileChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4 text-center pb-5">{title}</h2>
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-gray-700">{field.label}</label>
            {field.type === 'select' ? (
              <select
                className="w-full px-3 py-2 border rounded"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="">Select one Option</option>
                {field.options &&
                  field.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                className="w-full px-3 py-2 border rounded"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            ) : field.type === 'file' ? (
              <>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded"
                  onChange={(e) => handleFileChange(e, values.materialType)}
                />
                {formErrors.file && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.file}</p>
                )}
              </>
            ): (
              <input
                type={field.type}
                className="w-full px-3 py-2 border rounded"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            )}
            {formErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-around">
          <Button onClick={() => onSave(values)} text={"Save"} />
          <button
            onClick={onCancel}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;