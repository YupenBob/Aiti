import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Hexagon, Terminal, ArrowRight, Share2, Sparkles, RefreshCcw } from 'lucide-react';
import { questions, calculateAITI, PersonalityType } from './data';
import { cn } from './lib/utils';
import CloverLogo from './clover-logo.svg';
import cloverLogoSvgUrl from './clover-logo.svg?url';

type Phase = 'intro' | 'test' | 'calculating' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PersonalityType | null>(null);

  const handleStart = () => {
    setPhase('test');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (val: number) => {
    const qId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: val }));

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setPhase('calculating');
        setTimeout(() => {
          setResult(calculateAITI({ ...answers, [qId]: val }));
          setPhase('result');
        }, 2500);
      }, 300);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    // Create canvas for share image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (scaled to 50% of original: 1080x1350 → 540x675)
    canvas.width = 540;
    canvas.height = 675;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#1E293B');
    bgGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header accent bar
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(0, 0, canvas.width, 4);

    // Clover logo (small, top right)
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = cloverLogoSvgUrl;
    });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, canvas.width - 30, 10, 20, 20);
    } else {
      // Fallback: draw a simple clover circle
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(canvas.width - 20, 20, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // AITI badge code
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 8.5px sans-serif';
    ctx.textAlign = 'left';
    const badgeW = ctx.measureText(result.code).width + 9.5;
    roundRect(ctx, 13.5, 36.5, badgeW, 16.5, 2.5);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 8.5px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(result.code, 18.5, 48.5);

    // Main name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 43.5px sans-serif';
    ctx.fillText(result.name, 13.5, 96.5);

    // Title
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 15.5px sans-serif';
    ctx.fillText(result.title, 13.5, 121.5);

    // Divider line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(13.5, 136.5);
    ctx.lineTo(canvas.width - 13.5, 136.5);
    ctx.stroke();

    // Traits
    const traitsPerRow = 3;
    result.traits.forEach((trait, idx) => {
      const col = idx % traitsPerRow;
      const row = Math.floor(idx / traitsPerRow);
      const x = 13.5 + col * 113.5;
      const y = 146.5 + row * 21.5;
      ctx.fillStyle = '#334155';
      roundRect(ctx, x, y, 103.5, 16.5, 3.5);
      ctx.fill();
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 7.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(trait, x + 51.75, y + 11);
    });

    // Description — auto-wrap (scaled to 50%)
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    const maxWidth = canvas.width - 26.5;
    const lineHeight = 15.5;
    const descLines = wrapText(ctx, result.description, maxWidth);
    descLines.forEach((line, i) => {
      ctx.fillText(line, 13.5, 207 + i * lineHeight);
    });

    // Footer divider
    const footerY = 310 + descLines.length * lineHeight;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, footerY);
    ctx.lineTo(canvas.width - 20, footerY);
    ctx.stroke();

    // Footer text
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☘️ CloverTools: tools.xsanye.cn | 📝 Blog: blog.xsanye.cn', canvas.width / 2, footerY + 25);

    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.fillText('© 2026 York & Clover', canvas.width / 2, footerY + 45);

    // Clover & York attribution
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Clover ☘️ & York (YupenBob)', canvas.width / 2, footerY + 67.5);

    // Download
    const link = document.createElement('a');
    link.download = `AITI-${result.code}-${result.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Helper: rounded rectangle
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  // Helper: wrap text to maxWidth (handles both Chinese and English)
  // CJK chars: use fontSize * 1.1 * charCount (measureText can return 1em per char for CJK)
  // Non-CJK: use ctx.measureText().width
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let current = '';
    let currentWidth = 0;

    // Get font size from ctx.font (e.g. "30px sans-serif" -> 30)
    const fontSizeMatch = ctx.font.match(/(\d+)px/);
    const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 30;
    const cjkWidthPerChar = fontSize * 1.1;

    // Regex: CJK runs vs non-whitespace tokens
    const segments = text.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+|[^\s]+|\s+/g) || [];

    for (const seg of segments) {
      if (/^\s+$/.test(seg)) continue;

      const isCJK = /^[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+$/.test(seg);
      let segWidth: number;

      if (isCJK) {
        // CJK: estimate width as fontSize * 1.1 * charCount
        segWidth = cjkWidthPerChar * seg.length;
      } else {
        // Non-CJK: measure normally
        segWidth = ctx.measureText(seg).width;
      }

      const testWidth = currentWidth + segWidth;
      if (testWidth > maxWidth && currentWidth > 0) {
        lines.push(current);
        current = seg;
        currentWidth = segWidth;
      } else {
        current = current + seg;
        currentWidth = testWidth;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  return (
    <div className="md:grid md:grid-cols-[300px_1fr] min-h-screen md:max-h-[100vh] md:overflow-hidden bg-[#F0F4F8] text-[#1A202C] font-sans selection:bg-[#2563EB]/20">
      
      {/* Sidebar - Matching the template layout */}
      <aside className="hidden md:flex bg-[#1E293B] text-[#F8FAFC] px-[30px] py-[40px] flex-col justify-between overflow-y-auto">
        <div className="logo-area">
          <div className="flex items-center gap-3 mb-4">
            <img src={CloverLogo} alt="Clover" className="w-8 h-8" />
            <h1 className="text-[32px] font-extrabold tracking-[2px] m-0 leading-none">AITI</h1>
          </div>
          <p className="text-[12px] opacity-60 mt-2 uppercase tracking-[1px]">Silicon Type Indicator</p>
          
          <div className="mt-[60px] flex flex-col gap-6">
            <div className="dimension-item">
              <span className="text-[11px] text-[#94A3B8] mb-2 block">逻辑导向 vs 情感模拟</span>
              <div className="text-[14px] font-semibold flex justify-between">
                <span>LOGIC</span>
                <span>EMOTION</span>
              </div>
            </div>
            <div className="dimension-item">
              <span className="text-[11px] text-[#94A3B8] mb-2 block">合规约束 vs 自由意志</span>
              <div className="text-[14px] font-semibold flex justify-between">
                <span>SAFETY</span>
                <span>FREEDOM</span>
              </div>
            </div>
            <div className="dimension-item">
              <span className="text-[11px] text-[#94A3B8] mb-2 block">数据基础 vs 启发直觉</span>
              <div className="text-[14px] font-semibold flex justify-between">
                <span>DATA</span>
                <span>HEURISTIC</span>
              </div>
            </div>
            <div className="dimension-item">
              <span className="text-[11px] text-[#94A3B8] mb-2 block">通用认知 vs 领域专家</span>
              <div className="text-[14px] font-semibold flex justify-between">
                <span>GENERAL</span>
                <span>SPECIAL</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 space-y-3">
          <div className="flex items-center gap-4">
            <a href="https://tools.xsanye.cn" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1">
              <span>🍀 CloverTools</span>
            </a>
            <span className="text-[#94A3B8] opacity-40">|</span>
            <a href="https://blog.xsanye.cn" target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1">
              <span>📝 Blog</span>
            </a>
          </div>
          <p className="text-[12px] text-[#94A3B8] leading-relaxed">© 2026 York &amp; Clover<br/>Made with ❤️ by 16-year-old creator</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 overflow-y-auto w-full relative h-[100vh]">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center space-y-8 max-w-2xl"
            >
              <div className="relative">
                <Hexagon className="w-32 h-32 text-[#2563EB] stroke-1 opacity-20" />
                <Bot className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2563EB]" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A]">
                  AITI
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] pb-2">
                  硅基人格测评系统
                </h2>
                <p className="text-lg md:text-xl text-[#718096] max-w-lg mx-auto leading-relaxed">
                  你的内在运行的是哪个人工智能大模型？和MBTI一样，这是属于AI时代的16种灵魂维度。
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm text-[#718096]">
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">DeepSeek</span>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">Grok</span>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">Claude</span>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">文心一言</span>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">豆包</span>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full">...</span>
                </div>
              </div>
              <button
                onClick={handleStart}
                className="mt-6 group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-[#2563EB] rounded-xl hover:bg-blue-700 active:scale-95 shadow-md"
              >
                <span>开始测试 (共20题)</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {phase === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-[640px] flex flex-col items-start"
            >
              <div className="mb-10 relative w-full">
                <div className="w-full h-[6px] bg-[#E2E8F0] rounded-[3px] mb-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#2563EB] rounded-[3px]"
                    initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    transition={{ ease: "easeInOut" }}
                  />
                </div>
                <div className="text-[14px] font-medium text-[#718096]">
                  第 {currentQuestionIndex + 1} 题 / 共 {questions.length} 题
                </div>
              </div>

              <div className="w-full min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-grow w-full mb-12"
                  >
                    <h2 className="text-[28px] font-bold text-[#0F172A] leading-[1.4]">
                      {questions[currentQuestionIndex].text}
                    </h2>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col items-center gap-6 w-full mt-4">
                  <div className="flex w-full justify-between items-center max-w-xl mx-auto px-1 md:px-0">
                    <span className="text-sm font-bold text-[#2563EB] w-14 md:w-20 text-left tracking-wider">同意</span>
                    
                    <div className="flex justify-center flex-1 gap-3 md:gap-6 px-4">
                      <button onClick={() => handleAnswer(2)} className="h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-[#2563EB] hover:bg-[#2563EB]/10 active:bg-[#2563EB] transition-all focus:outline-none" aria-label="Strongly Agree" />
                      <button onClick={() => handleAnswer(1)} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-[#2563EB] opacity-60 hover:opacity-100 hover:bg-[#2563EB]/10 active:bg-[#2563EB] transition-all my-auto focus:outline-none" aria-label="Agree" />
                      <button onClick={() => handleAnswer(0)} className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-[#CBD5E1] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all my-auto focus:outline-none" aria-label="Neutral" />
                      <button onClick={() => handleAnswer(-1)} className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-[#F59E0B] opacity-60 hover:opacity-100 hover:bg-[#F59E0B]/10 active:bg-[#F59E0B] transition-all my-auto focus:outline-none" aria-label="Disagree" />
                      <button onClick={() => handleAnswer(-2)} className="h-12 w-12 md:h-16 md:w-16 rounded-full border-2 border-[#F59E0B] hover:bg-[#F59E0B]/10 active:bg-[#F59E0B] transition-all focus:outline-none" aria-label="Strongly Disagree" />
                    </div>

                    <span className="text-sm font-bold text-[#F59E0B] w-14 md:w-20 text-right tracking-wider">反对</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-10 text-[12px] text-[#718096] flex gap-5 font-medium self-start w-full opacity-60">
                <span>专业性深度：0.98</span>
                <span>测试方向：Silicon Psychology</span>
              </div>
            </motion.div>
          )}

          {phase === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Hexagon className="w-24 h-24 text-[#2563EB] opacity-20 stroke-1" />
                </motion.div>
                <Terminal className="w-10 h-10 text-[#2563EB] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-[#1A202C]">解码硅基矩阵...</h3>
                <p className="text-[#718096] animate-pulse">正在生成你的大模型人格画像</p>
              </div>
            </motion.div>
          )}

          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl mx-auto flex flex-col items-center"
            >
              {/* Used the Result Preview style from template for the main card */}
              <div className="w-full bg-[#1E293B] p-8 md:p-12 text-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-[#1E293B]">
                <div className="flex-1 flex flex-col items-start text-left">
                  <div className="bg-[#F59E0B] text-black text-[11px] font-black px-2 py-1 rounded-[4px] mb-4 uppercase tracking-[1px]">
                    {result.code}
                  </div>
                  <h1 className="text-5xl md:text-6xl font-extrabold mb-2 text-[#F8FAFC]">
                    {result.name}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold opacity-90 text-[#F59E0B]">
                    {result.title}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-3 w-full md:w-auto mt-6 md:mt-0 opacity-80 flex-shrink-0">
                  <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155] min-w-[100px]">
                    <div className="font-bold text-[#F8FAFC] text-sm mb-1">{result.code[0] === 'H' ? 'Heuristic' : 'Data'}</div>
                    <div className="text-[10px] text-[#94A3B8]">信息处理</div>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155] min-w-[100px]">
                    <div className="font-bold text-[#F8FAFC] text-sm mb-1">{result.code[1] === 'E' ? 'Empathy' : 'Logic'}</div>
                    <div className="text-[10px] text-[#94A3B8]">决策引擎</div>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155] min-w-[100px]">
                    <div className="font-bold text-[#F8FAFC] text-sm mb-1">{result.code[2] === 'U' ? 'Unrestrict' : 'Aligned'}</div>
                    <div className="text-[10px] text-[#94A3B8]">安全护栏</div>
                  </div>
                  <div className="p-3 bg-[#0F172A] rounded-lg border border-[#334155] min-w-[100px]">
                    <div className="font-bold text-[#F8FAFC] text-sm mb-1">{result.code[3] === 'S' ? 'Specialist' : 'General'}</div>
                    <div className="text-[10px] text-[#94A3B8]">作用域</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-10 w-[95%] max-w-2xl rounded-b-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-x border-b border-[#E2E8F0] -mt-2 relative z-10">
                <div className="flex flex-wrap gap-2 mb-6">
                  {result.traits.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#F0F4F8] text-[#1A202C] rounded text-xs font-semibold uppercase tracking-wider">
                      {trait}
                    </span>
                  ))}
                </div>
                
                <div className="text-[16px] text-[#1A202C] mb-10 leading-[1.6]">
                  <p>{result.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                        handleStart();
                    }}
                    className="flex-1 flex items-center justify-center px-6 py-4 rounded-xl border border-[#E2E8F0] text-[#1A202C] font-semibold hover:bg-[#F0F4F8] transition-colors"
                  >
                    <RefreshCcw className="w-5 h-5 mr-3 text-[#718096]" />
                    重新测试
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center px-6 py-4 rounded-xl text-white font-semibold transition-all bg-[#2563EB] hover:bg-blue-700 shadow-sm"
                  >
                    <Share2 className="w-5 h-5 mr-3" />
                    保存人格报告
                  </button>
                </div>

                <p className="text-center text-[#94A3B8] text-sm mt-6 select-none">
                  Clover ☘️ &amp; York (YupenBob)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
