
import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="bg-gradient-to-b from-bloom-green-light/30 to-transparent p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-dancing text-bloom-green-dark">{title}</h1>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <p className="text-sm font-pacifico text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
