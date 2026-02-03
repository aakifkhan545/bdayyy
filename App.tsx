
import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Sparkles, Gift, RefreshCw, ChevronRight, MailOpen, MessageSquareHeart } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const HeartLeaf = ({ x, y, size, delay, opacity }: { x: number, y: number, size: number, delay: number, opacity: number }) => (
  <g transform={`translate(${x}, ${y}) rotate(${Math.random() * 360})`}>
    <path
      d="M0 0 C -5 -10, -15 -10, -15 0 C -15 10, 0 20, 0 20 C 0 20, 15 10, 15 0 C 15 -10, 5 -10, 0 0"
      fill="#ff4d6d"
      className="heart-pulse"
      style={{ 
        animationDelay: `${delay}s`,
        transform: `scale(${size})`,
        opacity: opacity,
        filter: 'drop-shadow(0 0 4px rgba(255, 77, 109, 0.4))'
      }}
    />
  </g>
);

const BackgroundHeart = ({ style }: { style: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 32 32" 
    className="absolute pointer-events-none animate-float-up" 
    style={style}
  >
    <path 
      d="M16 28.5C16 28.5 2 20.5 2 11.5C2 6.5 6 4.5 9 4.5C12 4.5 14.5 6 16 9C17.5 6 20 4.5 23 4.5C26 4.5 30 6.5 30 11.5C30 20.5 16 28.5 16 28.5Z" 
      fill="currentColor" 
    />
  </svg>
);

type ViewState = 'landing' | 'greeting' | 'apology';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [poem, setPoem] = useState<string>("");
  const [extraReassurance, setExtraReassurance] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Memoized leaf generation for performance with high density
  const leaves = useMemo(() => {
    const leafData: { x: number, y: number, size: number, delay: number, opacity: number }[] = [];
    const centerX = 200;
    const centerY = 190; 
    const scale = 11.8;
    
    // Extreme density: 1500 heart leaves
    for (let i = 0; i < 1500; i++) {
      const t = Math.random() * 2 * Math.PI;
      // Denser distribution toward the center using power factor
      const r = Math.pow(Math.random(), 0.35); 
      const rawX = 16 * Math.pow(Math.sin(t), 3);
      const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      const xPos = centerX + rawX * scale * r;
      const yPos = centerY + rawY * scale * r;

      // Only add leaves that are above the "trunk" line
      if (yPos < 370) {
        leafData.push({
          x: xPos + (Math.random() - 0.5) * 15, // High variance for a lush, organic feel
          y: yPos + (Math.random() - 0.5) * 15,
          size: 0.07 + Math.random() * 0.38,
          delay: Math.random() * 6,
          opacity: 0.4 + Math.random() * 0.6
        });
      }
    }
    return leafData;
  }, []);

  const generateSpecialPoem = async () => {
    setLoading(true);
    try {
      // Initialize inside the function to avoid top-level process.env crashes
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      if (!apiKey) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Write a beautiful, very short (under 25 words), and sophisticated birthday poem for Alisha. Focus on her kind soul and the light she brings to the world.",
      });
      setPoem(response.text || "To the one who lights up every room, Happy Birthday!");
    } catch (error) {
      console.warn("Using fallback poem");
      setPoem("In the dance of life, you shine the brightest Alisha. Happy Birthday to my amazing friend.");
    } finally {
      setLoading(false);
    }
  };

  const generateExtraReassurance = async () => {
    setLoading(true);
    try {
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Write a short, gentle sentence of reassurance for a friend named Alisha, telling her that her feelings are valid and the friendship is a safe space. Keep it under 20 words.",
      });
      setExtraReassurance(response.text || "Your peace of mind matters most to me.");
    } catch (error) {
      setExtraReassurance("I value you more than words can express.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'greeting' && !poem) {
      generateSpecialPoem();
    }
    if (view === 'apology' && !extraReassurance) {
      generateExtraReassurance();
    }
  }, [view]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-pink-50 flex flex-col items-center justify-center">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,182,193,0.3)_0%,_transparent_70%)]" />
      
      {/* Floating Background Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(view === 'apology' ? 60 : 40)].map((_, i) => (
          <BackgroundHeart
            key={i}
            style={{
              width: Math.random() * 25 + 10 + 'px',
              top: '110%',
              left: Math.random() * 100 + '%',
              color: i % 2 === 0 ? 'rgba(255, 77, 109, 0.1)' : 'rgba(255, 150, 180, 0.08)',
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 12 + 18}s`
            }}
          />
        ))}
      </div>

      {/* View 1: Landing (Denser Heart Tree) */}
      {view === 'landing' && (
        <div className="relative flex flex-col items-center justify-center animate-in fade-in duration-1000 w-full px-4">
          <svg 
            viewBox="0 0 400 500" 
            className="floating drop-shadow-[0_0_50px_rgba(255,77,109,0.2)] w-full max-w-[500px] h-auto max-h-[65vh]"
          >
            <g className="tree-path opacity-30">
              <path d="M200 480 Q200 440 200 380" stroke="#8B5E5E" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M200 380 Q160 360 120 340" stroke="#8B5E5E" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M200 380 Q240 360 280 340" stroke="#8B5E5E" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M200 350 Q170 300 150 260" stroke="#8B5E5E" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M200 350 Q230 300 250 260" stroke="#8B5E5E" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M200 300 Q200 220 200 180" stroke="#8B5E5E" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
            
            {leaves.map((leaf, index) => (
              <HeartLeaf key={index} {...leaf} />
            ))}
          </svg>

          <div className="mt-4 text-center space-y-6 md:space-y-8 z-20">
            <h2 className="font-syncopate text-[9px] md:text-[10px] tracking-[0.6em] text-rose-900/40 uppercase">Heart of Eternal Bloom</h2>
            <button
              onClick={() => setView('greeting')}
              className="group relative px-10 py-5 md:px-14 md:py-6 bg-white text-rose-600 font-syncopate text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_15px_40px_rgba(255,77,109,0.15)] border border-rose-100"
            >
              <span className="relative z-10">Enter Alisha's Heart</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}

      {/* View 2: Greeting Card */}
      {view === 'greeting' && (
        <div className="z-10 w-full max-w-2xl p-4 md:p-6 animate-in zoom-in-95 fade-in duration-700">
          <div className="bg-white/75 backdrop-blur-2xl rounded-[40px] md:rounded-[45px] p-6 md:p-12 text-center shadow-2xl shadow-rose-200 border border-white/50">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-300">
                <Gift className="text-white w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>

            <h1 className="font-syncopate text-rose-900 text-lg md:text-2xl font-bold tracking-tighter mb-2 uppercase">HAPPY BIRTHDAY ALISHA</h1>
            <p className="font-dancing text-3xl md:text-4xl text-rose-500 mb-6">To My Dearest Friend</p>

            <div className="mb-8 px-1 md:px-8">
              <p className="text-rose-800/80 text-sm md:text-base font-light leading-relaxed italic animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Happy Birthday! My heart is so full just thinking about the amazing person you are. 
                You save lives by day and make mine better by night just by being in it. 
                I hope this year treats you with the gentleness you deserve and brings you more smiles than you can count. 
                You’re truly one of a kind.
              </p>
            </div>

            <div className="relative min-h-[80px] flex items-center justify-center px-4 mb-8 border-t border-rose-100/50 pt-6">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-rose-400" />
                </div>
              ) : (
                <p className="animate-in fade-in duration-1000 text-base md:text-xl font-dancing text-rose-600/70">
                  {poem}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <button 
                onClick={() => setView('apology')}
                className="group flex items-center justify-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-full font-syncopate text-[9px] md:text-[10px] tracking-[0.3em] uppercase hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-rose-200"
              >
                A Personal Message
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => setView('landing')}
                className="text-[9px] font-syncopate text-rose-900/40 hover:text-rose-600 underline underline-offset-[8px] transition-colors uppercase tracking-[0.3em]"
              >
                Back to Tree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Apology Letter */}
      {view === 'apology' && (
        <div className="z-10 w-full max-w-3xl h-[92vh] p-4 md:p-6 animate-in slide-in-from-bottom-10 duration-700 flex items-center justify-center">
          <div className="bg-white/85 backdrop-blur-3xl rounded-[40px] p-6 md:p-10 text-center shadow-2xl shadow-rose-200 border border-white/60 overflow-hidden relative max-h-full flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MailOpen className="w-24 h-24 text-rose-900" />
            </div>
            
            <div className="mb-6 flex justify-center shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-400 blur-3xl opacity-10 animate-pulse" />
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center shadow-inner border border-rose-100 relative z-10">
                  <MessageSquareHeart className="text-rose-400 w-8 h-8" />
                </div>
              </div>
            </div>

            <h2 className="font-syncopate text-rose-900 text-sm md:text-base font-bold tracking-[0.3em] mb-2 uppercase shrink-0">Sincere Apology</h2>
            <p className="font-dancing text-xl text-rose-400 mb-6 italic shrink-0">For Alisha...</p>

            <div className="flex-1 overflow-y-auto pr-2 mb-6 custom-scrollbar text-left bg-white/40 rounded-3xl p-5 md:p-8 border border-white/50 shadow-inner">
              <div className="space-y-4 font-inter text-rose-900/80 leading-relaxed text-sm md:text-base whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <p>Hey, I want to sincerely apologize for everything that happened yesterday.
                I’ve been thinking about it a lot, and I understand why you’re upset.
                The situation was confusing, and I didn’t handle it the right way.</p>

                <p>I should have been clearer from the beginning, and that’s on me.
                She is genuinely just my girl best friend, nothing more than that.
                There has never been anything romantic between us at all.</p>

                <p>I didn’t ask my friends to message you, and I didn’t expect them to do that.
                But even so, I take full responsibility for it.</p>

                <p>I know how it must have looked from your side, and I’m really sorry for putting you in that position.
                You didn’t deserve to feel angry, uncomfortable, or disrespected.</p>

                <p>My intention was never to hurt you or make you doubt anything.
                You mean a lot to me, and your feelings truly matter to me.
                If I were in your place, I’d probably feel the same way.</p>

                <p>I should’ve communicated better and reassured you earlier.
                I promise to be more careful and clear moving forward.
                I don’t want misunderstandings to come between us.</p>

                <p>I value what we have, and I don’t want this to define us.
                I hope you can see that my heart is in the right place.</p>

                <p>I’m really sorry for the stress and frustration this caused you.
                All I ask is a chance to talk it through properly.
                I care about you, and I want to make things right.</p>
              </div>

              <div className="mt-8 pt-6 border-t border-rose-100 flex flex-col items-center gap-4 italic text-center">
                 {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-rose-300" />
                ) : (
                  <div className="animate-in fade-in duration-1000">
                    <p className="text-rose-400 text-lg font-dancing">
                      {extraReassurance}
                    </p>
                  </div>
                )}
                <button 
                  onClick={generateExtraReassurance}
                  className="text-[8px] font-syncopate uppercase tracking-[0.2em] text-rose-300 hover:text-rose-500 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3 h-3" />
                  Request Reassurance
                </button>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-6 pt-2">
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="w-3 h-3 text-rose-200 fill-current animate-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
                ))}
              </div>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setView('greeting')}
                  className="flex-1 px-4 py-4 bg-white border border-rose-100 text-rose-400 font-syncopate text-[9px] tracking-[0.2em] uppercase rounded-full transition-all hover:bg-rose-50 active:scale-95"
                >
                  Back
                </button>
                <button 
                  onClick={() => setView('landing')}
                  className="flex-1 px-4 py-4 bg-rose-500 text-white font-syncopate text-[9px] tracking-[0.2em] uppercase rounded-full transition-all hover:bg-rose-600 active:scale-95 shadow-lg shadow-rose-200"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 228, 230, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 113, 133, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 113, 133, 0.5); }
      `}</style>
    </div>
  );
};

export default App;
