import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`text-center text-sm text-slate-500 dark:text-slate-400 ${className || ''}`}>
      <p>&copy; {new Date().getFullYear()} Lantigua Company. Todos los derechos reservados.</p>
    </footer>
  );
};
