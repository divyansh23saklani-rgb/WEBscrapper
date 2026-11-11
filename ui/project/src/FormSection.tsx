import React from 'react';

interface FormSectionProps {
  icon: React.ComponentType<any>;
  title: string;
  bgColor: string;
  iconColor: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  icon: Icon, 
  title, 
  bgColor, 
  iconColor, 
  children 
}) => (
  <div className="mb-8">
    <div className="flex items-center mb-6">
      <div className={`flex items-center justify-center w-8 h-8 ${bgColor} rounded-lg mr-3`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

export default FormSection;