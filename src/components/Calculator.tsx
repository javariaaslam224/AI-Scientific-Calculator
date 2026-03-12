import React, { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
import { 
  Delete, 
  RotateCcw, 
  Equal, 
  Sparkles, 
  History, 
  Info, 
  X,
  ChevronRight,
  Calculator as CalcIcon,
  Cpu
} from 'lucide-react';
import Markdown from 'react-markdown';
import { askMathAI } from '../services/aiService';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

const BUTTONS = [
  { label: 'sin', type: 'func', value: 'sin(' },
  { label: 'cos', type: 'func', value: 'cos(' },
  { label: 'tan', type: 'func', value: 'tan(' },
  { label: 'deg', type: 'func', value: 'deg' },
  
  { label: 'log', type: 'func', value: 'log10(' },
  { label: 'ln', type: 'func', value: 'log(' },
  { label: '√', type: 'func', value: 'sqrt(' },
  { label: '^', type: 'func', value: '^' },

  { label: '(', type: 'func', value: '(' },
  { label: ')', type: 'func', value: ')' },
  { label: 'π', type: 'func', value: 'pi' },
  { label: 'e', type: 'func', value: 'e' },

  { label: '7', type: 'num', value: '7' },
  { label: '8', type: 'num', value: '8' },
  { label: '9', type: 'num', value: '9' },
  { label: '÷', type: 'op', value: '/' },

  { label: '4', type: 'num', value: '4' },
  { label: '5', type: 'num', value: '5' },
  { label: '6', type: 'num', value: '6' },
  { label: '×', type: 'op', value: '*' },

  { label: '1', type: 'num', value: '1' },
  { label: '2', type: 'num', value: '2' },
  { label: '3', type: 'num', value: '3' },
  { label: '-', type: 'op', value: '-' },

  { label: '0', type: 'num', value: '0' },
  { label: '.', type: 'num', value: '.' },
  { label: 'EXP', type: 'func', value: 'e' },
  { label: '+', type: 'op', value: '+' },
];

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiResponse]);

  const handleInput = (val: string) => {
    setError(null);
    setDisplay(prev => prev + val);
  };

  const clear = () => {
    setDisplay('');
    setResult(null);
    setError(null);
  };

  const backspace = () => {
    setDisplay(prev => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (!display) return;
      const evalResult = math.evaluate(display);
      const formattedResult = math.format(evalResult, { precision: 14 });
      setResult(formattedResult.toString());
      setHistory(prev => [{ expression: display, result: formattedResult.toString() }, ...prev].slice(0, 10));
    } catch (err) {
      setError('Invalid Expression');
    }
  };

  const handleAiAsk = async () => {
    if (!display && !result) return;
    setIsAiLoading(true);
    setAiResponse(null);
    
    const prompt = display || result || "";
    const response = await askMathAI(prompt, result ? `The current calculated result is ${result}` : undefined);
    setAiResponse(response || "No response from AI.");
    setIsAiLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto p-4 lg:p-8 min-h-[80vh]">
      {/* Main Calculator Body */}
      <div className="flex-1 flex flex-col glass rounded-3xl overflow-hidden shadow-2xl">
        {/* Display Area */}
        <div className="p-6 bg-zinc-900/50 flex flex-col justify-end items-end min-h-[160px] relative">
          <div className="absolute top-4 left-6 flex gap-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400"
              title="History"
            >
              <History size={18} />
            </button>
          </div>

          <div className="w-full text-right overflow-x-auto whitespace-nowrap custom-scrollbar pb-2">
            <span className="text-zinc-500 text-lg font-mono">{display || '0'}</span>
          </div>
          
          <div className="w-full text-right mt-2">
            {error ? (
              <span className="text-rose-400 text-sm font-medium">{error}</span>
            ) : (
              <span className="text-emerald-400 text-4xl font-mono font-bold">
                {result ? `= ${result}` : ''}
              </span>
            )}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="p-6 grid grid-cols-4 gap-3 bg-zinc-950/30">
          <button onClick={clear} className="calc-btn calc-btn-danger col-span-1 py-4">
            AC
          </button>
          <button onClick={backspace} className="calc-btn calc-btn-func py-4">
            <Delete size={20} />
          </button>
          <button onClick={handleAiAsk} disabled={isAiLoading} className="calc-btn calc-btn-op bg-emerald-950/30 hover:bg-emerald-900/30 border border-emerald-500/20 py-4 flex gap-2">
            {isAiLoading ? <RotateCcw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span className="text-xs font-bold uppercase tracking-wider">AI</span>
          </button>
          <button onClick={calculate} className="calc-btn calc-btn-action py-4">
            <Equal size={24} />
          </button>

          {BUTTONS.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleInput(btn.value)}
              className={cn(
                "calc-btn py-4 text-lg",
                btn.type === 'num' && "calc-btn-num",
                btn.type === 'op' && "calc-btn-op",
                btn.type === 'func' && "calc-btn-func"
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Sidebar / Response Area */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {aiResponse ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-3xl p-6 flex-1 flex flex-col max-h-[600px]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Cpu size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-widest">AI Insights</h3>
                </div>
                <button onClick={() => setAiResponse(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 prose prose-invert prose-sm max-w-none">
                <Markdown>{aiResponse}</Markdown>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 flex-1 border-dashed border-white/5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-zinc-200">AI Math Assistant</h3>
                <p className="text-zinc-500 text-sm mt-2">
                  Enter an expression and tap the AI button to get step-by-step solutions or explanations.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 w-full mt-4">
                {['Solve for x: 2x + 5 = 15', 'Explain sin(x) derivative', 'What is the golden ratio?'].map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => { setDisplay(q); handleAiAsk(); }}
                    className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-400 transition-colors flex items-center justify-between group"
                  >
                    {q}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Panel (Floating or Sidebar) */}
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <History size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">History</h3>
              </div>
              <button onClick={() => setHistory([])} className="text-[10px] uppercase tracking-tighter text-zinc-500 hover:text-rose-400">Clear All</button>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
              {history.length === 0 ? (
                <p className="text-zinc-600 text-xs italic">No history yet</p>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => { setDisplay(item.expression); setResult(item.result); }}
                  >
                    <div className="text-[10px] text-zinc-500 font-mono truncate">{item.expression}</div>
                    <div className="text-sm text-emerald-400 font-mono font-bold">= {item.result}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
