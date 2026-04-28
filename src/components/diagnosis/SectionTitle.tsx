import React from 'react';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => (
    <div className="text-center mb-8 md:mb-16 fade-in">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6 font-serif">{title}</h2>
        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-amber-600 mx-auto rounded-full mb-4 md:mb-6"></div>
        {subtitle && <p className="text-base md:text-xl text-slate-600 font-serif italic max-w-2xl mx-auto px-4">{subtitle}</p>}
    </div>
);