import React from 'react';

export default function TopAd() {
  return (
    <div className="w-full bg-brand-light border-b border-brand-border py-4 flex justify-center items-center">
      <div className="w-full max-w-[970px] h-[120px] md:h-[220px] bg-white flex items-center justify-center rounded-xl border border-brand-border relative overflow-hidden group hover:border-brand-blue/50 transition-colors shadow-sm cursor-pointer mx-4 p-4 md:p-8">
        <div className="absolute top-2 left-3 text-[10px] uppercase text-brand-gray/60 tracking-widest font-extrabold z-10">Advertisement</div>
        
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full relative z-10 gap-4">
           
           {/* Ad Content Left */}
           <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left mt-2 md:mt-0">
             <h2 className="text-xl md:text-4xl font-extrabold text-brand-black mb-1 md:mb-2 tracking-tight">Competitive Pricing <span className="text-brand-blue relative">for Your Strategy</span></h2>
             <p className="text-brand-gray text-xs md:text-sm font-medium">Trade with spreads starting from 0.0 pips on <span className="text-brand-red font-bold">eligible Raw accounts</span></p>
           </div>

           {/* Ad Action Right */}
           <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-3">
               <div className="font-bold text-3xl text-brand-black flex items-center">
                 <span className="text-brand-blue">X</span><span className="text-brand-red">iux</span>
               </div>
             </div>
             <button className="bg-brand-blue border-2 border-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-white hover:text-brand-blue transition-all shadow-md">
               Learn more
             </button>
           </div>
           
        </div>
        
        {/* Decorative elements representing trading charts/tech background */}
        <div className="absolute -left-10 -bottom-20 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-10 -top-20 w-48 h-48 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="absolute right-32 bottom-0 opacity-10 pointer-events-none hidden md:block">
           <svg width="200" height="80" viewBox="0 0 200 80">
              <path d="M0 80 L30 50 L60 60 L90 20 L120 40 L160 10 L200 30" fill="none" stroke="currentColor" strokeWidth="4" className="text-brand-blue" />
              <path d="M0 80 L30 65 L60 70 L90 40 L120 50 L160 30 L200 45" fill="none" stroke="currentColor" strokeWidth="4" className="text-brand-red" />
           </svg>
        </div>
      </div>
    </div>
  );
}
