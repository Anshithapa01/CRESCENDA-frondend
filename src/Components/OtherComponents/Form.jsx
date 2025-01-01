import React from 'react';
import Button from './Button';
import InputField from '../Mentor/SignUp/InputField';

const Form = ({ fields, buttonText, onSubmit, formErrors, noValidate }) => {
  return (
    <form onSubmit={onSubmit} noValidate={noValidate}>
      {fields.map((field, index) => (
        <div key={index}>
          <InputField
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            name={field.name}
          />
          {formErrors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
          )}
        </div>
      ))}
      <div className="flex items-center justify-center pt-5">
        <Button width={'w-full rounded-3xl'} text={buttonText} />
      </div>
    </form>
  );
};


export default Form;
