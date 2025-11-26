
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FloatingText, GameState, JobConfig, Emotion, GameAction, NPCConfig } from '../types';
import Character from './Character';
import { GET_SCENE_ACTIONS } from '../constants';
import { Code, Coffee, MessageCircle, AlertCircle } from 'lucide-react';

interface OfficeSceneProps {
  gameState: GameState;
  jobConfig: JobConfig;
  npcConfig?: NPCConfig;
  onHitBoss: (x: number, y: number) => void;
  floatingTexts: FloatingText[];
  onSelectAction?: (action: GameAction) => void;
  onEarn: (amount: number) => void;
  onTriggerEvent?: () => void; // New callback for interactive triggers
}

// --- HELPER COMPONENT: DRAGGABLE ITEM ---
const DraggableItem: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
        className={`${className} ${isDragging ? 'cursor-grabbing scale-110 z-50 shadow-xl' : 'cursor-grab'} transition-transform duration-75`}
        style={{ ...style, transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()} 
    >
        {children}
    </div>
  );
};


const OfficeScene: React.FC<OfficeSceneProps> = ({ gameState, jobConfig, npcConfig, onHitBoss, floatingTexts, onSelectAction, onEarn, onTriggerEvent }) => {
  const [npcShake, setNpcShake] = useState(false);
  const [playerAction, setPlayerAction] = useState<string>('idle');
  const [npcEmotion, setNpcEmotion] = useState<Emotion>('NEUTRAL');
  const [interactionBubble, setInteractionBubble] = useState<string | null>(null);
  
  // Drag & Drop State (Player)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{x: number, y: number}>({x:0, y:0});
  const playerRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, show: boolean} | null>(null);

  // Cast to string to avoid TypeScript overlapping error if it narrows incorrectly
  const isWorkstation = (gameState.currentScene as string) === 'WORKSTATION';

  // Initialize player position based on scene
  useEffect(() => {
      if (gameState.currentScene === 'WORKSTATION') {
          setPlayerPos({ x: window.innerWidth / 2 - 100, y: 60 }); // Center at desk
      } else if (gameState.currentScene === 'HR') {
          setPlayerPos({ x: 50, y: 20 });
      } else {
          setPlayerPos({ x: 100, y: 0 });
      }
  }, [gameState.currentScene]);

  // Handle NPC Mood Bubbles (Randomly appear)
  useEffect(() => {
    if (gameState.currentEvent) {
        setInteractionBubble(null);
        return;
    }
    const interval = setInterval(() => {
        // 25% chance every 4 seconds to show a bubble if not already showing
        if (Math.random() < 0.25 && !interactionBubble) {
            const types = ['!', '?', '...'];
            setInteractionBubble(types[Math.floor(Math.random() * types.length)]);
            // Auto hide after 5 seconds
            setTimeout(() => setInteractionBubble(null), 5000);
        }
    }, 4000);
    return () => clearInterval(interval);
  }, [gameState.currentEvent, interactionBubble]);

  // Handle Action Animations
  useEffect(() => {
    if (!gameState.lastActionId) return;

    const actionId = gameState.lastActionId;
    
    // Animation Trigger logic
    if (['punch', 'kick', 'combo', 'scold', 'slap', 'argue_hr'].some(s => actionId.includes(s))) {
       setPlayerAction(actionId.includes('kick') ? 'kick' : 'punch');
       setNpcEmotion('PAIN');
       setNpcShake(true);
    } else if (['tea', 'clean', 'gift', 'ot', 'help'].some(s => actionId.includes(s))) {
       setPlayerAction('tea');
       setNpcEmotion('HAPPY');
    } else if (['ignore', 'slack', 'refuse', 'resign'].some(s => actionId.includes(s))) {
       setPlayerAction('rebel');
       setNpcEmotion('ANGRY');
    } else if (['work_hard', 'type'].some(s => actionId.includes(s))) {
        setPlayerAction('type');
    } else {
       setPlayerAction('work');
    }

    const timer = setTimeout(() => {
      setPlayerAction('idle');
      setNpcEmotion('NEUTRAL');
      setNpcShake(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [gameState.lastActionId]);

  // Determine NPC Emotion Display
  const getDisplayEmotion = (): Emotion => {
      if (npcEmotion !== 'NEUTRAL') return npcEmotion;
      if (gameState.currentScene === 'BOSS_OFFICE') {
         if (gameState.bossHealth < 200) return 'KO';
         if (gameState.favor > gameState.maxFavor * 0.8) return 'HAPPY';
         if (gameState.rage > 200) return 'SHOCK';
      }
      if (gameState.currentScene === 'HR' && gameState.isResigning) return 'SUSPICIOUS';
      return 'NEUTRAL';
  };

  // --- DRAG LOGIC (PLAYER) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; 
    if (isWorkstation) return; // Lock player in workstation
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setContextMenu(prev => prev ? { ...prev, show: false } : null);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPlayerPos(prev => ({ x: prev.x + dx, y: prev.y - dy }));
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
       window.removeEventListener('mousemove', handleMouseMove);
       window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- CONTEXT MENU ---
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, show: true });
  };

  const handleMenuAction = (action: GameAction) => {
     if (onSelectAction) onSelectAction(action);
     setContextMenu(prev => prev ? { ...prev, show: false } : null);
  };

  const handleNpcClick = () => {
      // If bubble exists, clicking triggers event
      if (interactionBubble && onTriggerEvent) {
          onTriggerEvent();
          setInteractionBubble(null);
      } else if (onSelectAction && isWorkstation) {
          // Default action for colleague
          onSelectAction({id: 'gossip', label: 'Gossip', description: '', type: 'TALK', value: 0, cooldown: 0});
      }
  };

  useEffect(() => {
      const closeMenu = () => setContextMenu(prev => prev ? { ...prev, show: false } : null);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleDeskClick = () => {
      // Manual work click interaction
      const baseEarn = 100; 
      onEarn(baseEarn);
      setPlayerAction('type');
      
      // Reset animation
      setTimeout(() => setPlayerAction('idle'), 200);
  };


  // --- RENDER HELPERS ---
  const renderBackground = () => {
      switch(gameState.currentScene) {
          case 'HR':
              return (
                  <div className="absolute inset-0 pointer-events-none bg-[#f0f9ff]">
                      <div className="absolute bottom-0 w-full h-1/3 bg-[#e2e8f0] border-t-8 border-[#cbd5e1]"></div>
                      {/* Plants */}
                      <div className="absolute bottom-[25%] left-10 w-20 h-40 bg-green-200 rounded-t-full opacity-50"></div>
                      <div className="absolute top-20 right-20 w-40 h-40 bg-white border-4 border-slate-200 p-4 flex flex-col gap-2">
                          <div className="w-full h-2 bg-slate-200"></div>
                          <div className="w-3/4 h-2 bg-slate-200"></div>
                          <div className="text-[8px] text-slate-400 mt-2">HUMAN RESOURCES</div>
                      </div>
                  </div>
              );
          case 'WORKSTATION':
              // Return null for background to allow IsometricCanvas to show through
              return null;
          default: // Boss
              return (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 w-full h-1/3 bg-[#cbd5e1] border-t-8 border-[#94a3b8]"></div>
                    <div className="absolute top-0 w-full h-2/3 bg-[#e2e8f0]">
                        <div className="w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    </div>
                    <div className="absolute top-10 left-20 w-48 h-64 bg-gradient-to-b from-sky-300 to-sky-100 border-8 border-white shadow-lg overflow-hidden">
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-yellow-200 opacity-80 blur-sm"></div>
                        <div className="absolute bottom-0 w-full h-20 bg-white/30 cloud-shape transform scale-150"></div>
                    </div>
                </div>
              )
      }
  }

  const renderDesk = () => {
      if (gameState.currentScene === 'HR') {
          return (
            <div className="absolute bottom-0 w-[120%] h-24 bg-white rounded-xl shadow-2xl border-t-[6px] border-slate-200 flex items-center justify-center z-20 pointer-events-none">
                <div className="bg-pink-100 px-4 py-1 rounded shadow border-b-2 border-pink-300 transform -translate-y-2">
                    <div className="text-pink-800 font-black text-xs tracking-widest uppercase">HR DEPARTMENT</div>
                </div>
            </div>
          )
      }
      if (isWorkstation) {
          // Hide 2D desk for Isometric View
          return null;
      }
      // Boss
      return (
        <div className="absolute bottom-0 w-[120%] h-24 bg-[#78350f] rounded-xl shadow-2xl border-t-[6px] border-[#92400e] flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-[#fcd34d] px-4 py-1 rounded shadow-lg border-b-4 border-[#b45309] transform -translate-y-2">
            <div className="text-[#78350f] font-black text-xs tracking-widest uppercase">{jobConfig.bossName}</div>
            </div>
            <div className="absolute left-4 top-2 w-16 h-10 bg-white shadow transform -rotate-6 rounded-sm"></div>
            <div className="absolute right-8 top-4 w-12 h-14 bg-white shadow transform rotate-12 rounded-sm"></div>
        </div>
      )
  }

  // --- RENDER BUBBLE ---
  const renderBubble = () => {
      if (!interactionBubble) return null;
      return (
          <div 
             className="absolute top-[-40px] right-[20%] z-50 animate-bounce cursor-pointer hover:scale-110 transition-transform"
             onClick={(e) => { e.stopPropagation(); handleNpcClick(); }}
          >
              <div className="bg-white border-4 border-slate-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg relative">
                   <span className="text-2xl font-black text-slate-800">{interactionBubble}</span>
                   {/* Triangle pointer */}
                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-4 border-b-4 border-slate-800 transform rotate-45"></div>
              </div>
          </div>
      )
  }

  return (
    <div 
        className="relative w-full h-full overflow-hidden select-none perspective-1000 cursor-default"
        onContextMenu={(e) => e.preventDefault()} 
    >
      {renderBackground()}

      {/* NPC AREA (Only visible in HR and Boss Scenes, or background colleague in workstation) */}
      {!isWorkstation && (
        <div 
            onContextMenu={handleContextMenu}
            onClick={handleNpcClick}
            className={`absolute top-[15%] md:top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform duration-100 z-10 w-64 md:w-80 cursor-crosshair
            ${npcShake ? 'translate-x-[-48%] rotate-3 brightness-75' : 'hover:scale-105 duration-300'}
            `}
        >
            {/* Interaction Bubble */}
            {renderBubble()}
            
            {/* NPC Character */}
            <div className="relative w-full h-64 md:h-80">
                <Character 
                    role={npcConfig ? npcConfig.role : 'BOSS'} 
                    emotion={getDisplayEmotion()} 
                    action={npcEmotion === 'ANGRY' ? 'scold' : 'idle'}
                />
            </div>
            {renderDesk()}
        </div>
      )}

      {/* Workstation Colleague (Gary) - Appearing randomly or fixed somewhere? Let's put him peeking over the cubicle */}
      {isWorkstation && (
           <div className="absolute top-[20%] right-[10%] w-40 h-40 z-0 opacity-80 hover:opacity-100 transition-all hover:translate-y-[-10px] cursor-pointer"
                onClick={handleNpcClick}
           >
               {renderBubble()}
               <div className="bg-slate-800 text-white text-[10px] p-1 rounded mb-1 text-center opacity-0 hover:opacity-100 transition-opacity">Psst... 摸鱼吗?</div>
               <Character role="COLLEAGUE" emotion="NEUTRAL" action="idle" />
           </div>
      )}

      {/* PLAYER */}
      {/* Hide Player for Isometric WORKSTATION view */}
      {!isWorkstation && (
        <div 
            ref={playerRef}
            onMouseDown={handleMouseDown}
            className={`absolute transition-transform duration-75 
            z-30 cursor-move
            ${isDragging ? 'scale-110 shadow-2xl' : 'scale-100'}
            ${playerAction === 'kick' ? 'origin-bottom -rotate-12' : ''}
            `}
            style={{
                bottom: playerPos.y + 'px',
                left: playerPos.x + 'px',
                transform: `translate(0, 0) ${playerAction === 'punch' ? 'scale(1.2) translateX(100px) translateY(-50px)' : ''}`
            }}
        >
            <div className="relative w-56 h-64 md:w-72 md:h-80 pointer-events-none">
                <Character 
                    role="PLAYER" 
                    profession={gameState.profession}
                    emotion={playerAction === 'punch' || playerAction === 'kick' ? 'ANGRY' : playerAction === 'tea' ? 'HAPPY' : 'NEUTRAL'}
                    action={playerAction}
                    originType={gameState.origin}
                />
            </div>
            {!isDragging && playerAction === 'idle' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/80 px-2 py-1 rounded text-xs font-bold animate-bounce">Drag Me!</div>
            )}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-center py-1 px-3 font-bold text-sm rounded-full shadow-lg border-2 border-slate-600 whitespace-nowrap">
                {jobConfig.title}
            </div>
        </div>
      )}

      {/* Render Desk Overlay for Workstation */}
      {renderDesk()}

      {/* Context Menu */}
      {contextMenu?.show && (
          <div 
            className="fixed z-50 bg-white rounded-lg shadow-2xl border-4 border-slate-800 p-1 min-w-[150px] flex flex-col gap-1 animate-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
              <div className="px-2 py-1 text-xs font-black text-slate-400 uppercase border-b border-slate-100 mb-1">Interaction</div>
              {GET_SCENE_ACTIONS(gameState.profession, gameState.currentScene).map(action => (
                  <button
                    key={action.id}
                    onClick={(e) => { e.stopPropagation(); handleMenuAction(action); }}
                    className={`text-left px-3 py-2 rounded text-sm flex justify-between items-center group font-bold
                        ${action.type === 'VIOLENCE' ? 'text-red-900 hover:bg-red-100' : 'text-slate-700 hover:bg-slate-100'}
                    `}
                  >
                     <span>{action.label}</span>
                     {action.cost && <span className="text-xs bg-red-200 px-1 rounded text-red-800">-{action.cost}</span>}
                  </button>
              ))}
          </div>
      )}

      {/* VFX Layer */}
      {floatingTexts.map(ft => (
          <div key={ft.id} className={`absolute pointer-events-none z-50 
            ${ft.type === 'SEAFOOD' ? 'text-4xl animate-spin' : ft.type === 'RARE' ? 'text-xl animate-bounce shadow-lg bg-yellow-100 p-1 rounded' : 'text-3xl'} 
            font-black`} 
            style={{ left: ft.x, top: ft.y, color: ft.color, textShadow: '1px 1px 0 black' }}>
              {ft.text}
          </div>
      ))}
    </div>
  );
};

export default OfficeScene;
