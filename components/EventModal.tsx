
import React, { useState } from 'react';
import { RandomEvent, EventOption } from '../types';
import Character from './Character';
import { Sparkles } from 'lucide-react';

interface EventModalProps {
  event: RandomEvent;
  onOptionSelect: (option: EventOption) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl relative">
        
        {/* Spotlight Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-white/10 to-transparent pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500 bg-white">
            
            {/* Visual Side (Left) */}
            <div className="md:col-span-1 bg-gradient-to-b from-slate-800 to-slate-900 relative min-h-[200px] flex items-end justify-center overflow-hidden p-4">
                 <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                 
                 <div className="absolute top-4 left-4 bg-yellow-500 text-black font-black text-xs px-2 py-1 rounded uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Sparkles size={12}/> {event.npcRole} Event
                 </div>

                 {/* NPC Avatar */}
                 <div className="w-48 h-48 relative z-10 animate-in slide-in-from-bottom duration-700">
                     <Character role={event.npcRole} emotion="SUSPICIOUS" action="idle" />
                 </div>
            </div>

            {/* Content Side (Right) */}
            <div className="md:col-span-2 p-6 md:p-8 flex flex-col relative bg-white">
                <h2 className="text-3xl font-black text-slate-800 mb-2">{event.title}</h2>
                <div className="w-16 h-2 bg-yellow-400 mb-4"></div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 flex-1">
                    {event.description}
                </p>

                <div className="space-y-3">
                    {event.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedOption(idx);
                                setTimeout(() => onOptionSelect(opt), 200);
                            }}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center group
                                ${selectedOption === idx 
                                    ? 'bg-yellow-50 border-yellow-500 shadow-inner scale-[0.98]' 
                                    : 'bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50 hover:shadow-lg hover:-translate-y-1'
                                }
                            `}
                        >
                            <div>
                                <div className="font-bold text-slate-800 group-hover:text-sky-700">{opt.label}</div>
                                <div className="text-xs text-slate-400 mt-1">{opt.description}</div>
                            </div>
                            
                            {/* Outcome Preview (Subtle hint) */}
                            <div className="flex gap-2 opacity-50 text-[10px] font-mono">
                                {opt.outcome.money && (
                                    <span className={opt.outcome.money > 0 ? 'text-green-600' : 'text-red-500'}>
                                        {opt.outcome.money > 0 ? '+' : ''}$
                                    </span>
                                )}
                                {opt.outcome.favor && (
                                    <span className={opt.outcome.favor > 0 ? 'text-yellow-600' : 'text-slate-500'}>
                                        {opt.outcome.favor > 0 ? '+' : '-'}Favor
                                    </span>
                                )}
                                {opt.outcome.rage && (
                                    <span className={opt.outcome.rage > 0 ? 'text-red-600' : 'text-green-500'}>
                                        {opt.outcome.rage > 0 ? '+' : '-'}Rage
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
