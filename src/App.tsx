import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Shield, CheckCircle2, AlertCircle, XCircle, ChevronLeft, Activity, BarChart3, Timer, GraduationCap, Zap, Volume2 } from 'lucide-react';

type Screen = 'dashboard' | 'breakdown' | 'chart' | 'timing' | 'grading';

interface PriceData {
  price: number;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  timestamp: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

const mockSetup = {
  grade: 'A' as const,
  score: 8,
  direction: 'LONG' as const,
  status: 'SAFE' as const,
  entryZone: [2842.00, 2844.00] as [number, number],
  stopLoss: 2840.00,
  takeProfit: 2852.00,
  riskReward: 2.8,
  timeframe: 'M15',
  confluences: [
    { id: '1', name: 'Structure Alignment', description: 'Higher timeframe bullish structure intact', weight: 3, confirmed: true },
    { id: '2', name: 'Liquidity Sweep', description: 'Asian session lows swept cleanly', weight: 2, confirmed: true },
    { id: '3', name: 'Fair Value Gap', description: 'M15 FVG present at entry zone', weight: 2, confirmed: true },
    { id: '4', name: 'Risk Reward', description: '1:2.8 RR exceeds minimum threshold', weight: 2, confirmed: true }
  ],
  missingFactors: [
    { id: '1', name: 'Volume Confirmation', description: 'Below average volume on entry', severity: 'medium' as const },
    { id: '2', name: 'RSI Divergence', description: 'No bullish divergence yet', severity: 'low' as const }
  ]
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [priceData, setPriceData] = useState<PriceData>({
    price: 2845.32,
    bid: 2845.27,
    ask: 2845.39,
    change: 12.45,
    changePercent: 0.44,
    timestamp: Date.now(),
    high24h: 2847.90,
    low24h: 2838.15,
    volume24h: 45200
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => {
        const change = (Math.random() - 0.5) * 0.5;
        const newPrice = prev.price + change;
        return {
          ...prev,
          price: newPrice,
          bid: newPrice - 0.05,
          ask: newPrice + 0.07,
          change: prev.change + change,
          changePercent: ((prev.change + change) / newPrice) * 100,
          high24h: Math.max(prev.high24h, newPrice),
          low24h: Math.min(prev.low24h, newPrice),
          volume24h: prev.volume24h + Math.random() * 10
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const Header = () => (
    <header className="sticky top-0 z-50 glass-panel border-b border-[#D4AF37]/10 px-4 py-3">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center">
            <span className="text-[#050811] font-bold text-lg">Au</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white">AZFX</h1>
            <p className="text-[10px] text-gray-400 uppercase">Gold Trading</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-green-400">LIVE</span>
        </div>
      </div>
    </header>
  );

  const Navigation = () => {
    const items = [
      { id: 'dashboard' as Screen, label: 'Dashboard', icon: Activity },
      { id: 'breakdown' as Screen, label: 'Analysis', icon: Shield },
      { id: 'chart' as Screen, label: 'Chart', icon: BarChart3 },
      { id: 'timing' as Screen, label: 'Timing', icon: Timer },
      { id: 'grading' as Screen, label: 'Grading', icon: GraduationCap },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-[#D4AF37]/10 px-6 py-3 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#D4AF37] scale-110' : 'text-gray-500'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  };

  const Dashboard = () => {
    const isPositive = priceData.change >= 0;
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="glass-panel rounded-2xl p-4 border border-[#D4AF37]/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase">XAUUSD Spot</p>
              <h2 className="text-4xl font-bold font-mono text-white">{priceData.price.toFixed(2)}</h2>
              <span className={`text-sm flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositive ? '+' : ''}{priceData.change.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Spread</p>
              <p className="text-sm font-mono text-[#D4AF37]">0.12</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#D4AF37]/10 text-xs">
            <div><span className="text-gray-500">High</span><p className="font-mono">{priceData.high24h.toFixed(2)}</p></div>
            <div><span className="text-gray-500">Low</span><p className="font-mono">{priceData.low24h.toFixed(2)}</p></div>
            <div><span className="text-gray-500">Vol</span><p className="font-mono">{(priceData.volume24h/1000).toFixed(1)}K</p></div>
            <div><span className="text-gray-500">Session</span><p className="font-mono text-[#D4AF37]">London</p></div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase">Current Setup</p>
              <h3 className="text-xl font-bold text-white">{mockSetup.direction} Setup</h3>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center transform rotate-3">
              <span className="text-2xl font-bold text-[#050811]">{mockSetup.grade}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            <span className="font-bold text-green-400">SAFE TO ENTER</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-[#050811]/50 border border-[#D4AF37]/10">
              <p className="text-[10px] text-gray-500">Entry</p>
              <p className="font-mono font-bold text-[#D4AF37]">{mockSetup.entryZone[0]}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#050811]/50 border border-red-500/10">
              <p className="text-[10px] text-gray-500">SL</p>
              <p className="font-mono font-bold text-red-400">{mockSetup.stopLoss}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#050811]/50 border border-green-500/10">
              <p className="text-[10px] text-gray-500">TP</p>
              <p className="font-mono font-bold text-green-400">{mockSetup.takeProfit}</p>
            </div>
          </div>

          <button onClick={() => setCurrentScreen('breakdown')} className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#050811] font-bold hover:bg-[#FFD700] transition-colors">
            View Analysis
          </button>
        </div>
      </div>
    );
  };

  const TradeBreakdown = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setCurrentScreen('dashboard')} className="p-2 rounded-lg bg-[#0a0e1f] border border-[#D4AF37]/20">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-white">Trade Analysis</h2>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-3xl font-bold gold-gradient-text">Grade {mockSetup.grade}</h3>
          <span className="text-lg font-bold text-white">{mockSetup.score}/10</span>
        </div>
        <div className="h-2 bg-[#0a0e1f] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-full" style={{width: '80%'}}></div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
        <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Confluence Factors
        </h3>
        <div className="space-y-2">
          {mockSetup.confluences.map((c) => (
            <div key={c.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#050811]/50">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-200">{c.name}</p>
                <p className="text-[10px] text-gray-400">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-yellow-500/20 bg-yellow-500/5">
        <h3 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> Missing Factors
        </h3>
        {mockSetup.missingFactors.map((f) => (
          <div key={f.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#050811]/50 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-gray-200">{f.name}</p>
              <p className="text-[10px] text-gray-400">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChartView = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (!chartRef.current) return;
      const chart = createChart(chartRef.current, {
        layout: { background: { type: ColorType.Solid, color: '#0a0e1f' }, textColor: '#9ca3af' },
        grid: { vertLines: { color: 'rgba(212, 175, 55, 0.05)' }, horzLines: { color: 'rgba(212, 175, 55, 0.05)' } },
        rightPriceScale: { borderColor: 'rgba(212, 175, 55, 0.2)' },
        timeScale: { borderColor: 'rgba(212, 175, 55, 0.2)' },
        width: chartRef.current.clientWidth,
        height: 300,
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e', downColor: '#ef4444', borderUpColor: '#22c55e', borderDownColor: '#ef4444',
        wickUpColor: '#22c55e', wickDownColor: '#ef4444',
      });

      const data = [];
      let price = 2838;
      for (let i = 50; i >= 0; i--) {
        const time = Math.floor(Date.now() / 1000) - (i * 900);
        const open = price;
        const close = price + (Math.random() - 0.3) * 3;
        const high = Math.max(open, close) + Math.random();
        const low = Math.min(open, close) - Math.random();
        data.push({ time, open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)), low: parseFloat(low.toFixed(2)), close: parseFloat(close.toFixed(2)) });
        price = close;
      }
      candleSeries.setData(data);
      chart.timeScale().fitContent();

      return () => chart.remove();
    }, []);

    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-white">Technical Chart</h2>
        <div className="glass-panel rounded-2xl p-3 border border-[#D4AF37]/20">
          <div ref={chartRef} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-[#0a0e1f] border-l-2 border-[#D4AF37]">Entry: {mockSetup.entryZone[0]}</div>
          <div className="p-2 rounded bg-[#0a0e1f] border-l-2 border-red-500">SL: {mockSetup.stopLoss}</div>
        </div>
      </div>
    );
  };

  const EntryTiming = () => {
    const [timeLeft, setTimeLeft] = useState({ minutes: 3, seconds: 45 });
    
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
          return { minutes: 14, seconds: 59 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-white">Entry Timing</h2>
        
        <div className="glass-panel rounded-2xl p-6 border-2 border-green-500/30 bg-green-500/5 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-green-400">SAFE TO ENTER</h3>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-[#D4AF37]/20 text-center">
          <p className="text-xs text-gray-400 mb-3">Candle Close (M15)</p>
          <div className="flex justify-center gap-3 text-2xl font-bold font-mono">
            <span className="bg-[#0a0e1f] px-4 py-2 rounded-lg border border-[#D4AF37]/20">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[#D4AF37]">:</span>
            <span className="bg-[#0a0e1f] px-4 py-
