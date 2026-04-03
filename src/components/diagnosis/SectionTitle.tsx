import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => (
    <div className="text-center mb-16 fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">{title}</h2>
        <div className="w-24 h-1.5 bg-amber-600 mx-auto rounded-full mb-6"></div>
        {subtitle && <p className="text-xl text-slate-600 font-serif italic max-w-2xl mx-auto">{subtitle}</p>}
    </div>
);