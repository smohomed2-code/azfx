import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Shield, CheckCircle2, AlertCircle, ChevronLeft, Activity, BarChart3, Timer, GraduationCap } from 'lucide-react';

// ============================================
// CONFIGURATION - PUT YOUR API KEY HERE
const FINNHUB_API_KEY = 'd6ggca1r01quah09evs0d6ggca1r01quah09evsg';
// ============================================

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
  isReal: boolean;
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
    change: 0,
    changePercent: 0,
    timestamp: Date.now(),
    high24h: 2847.90,
    low24h: 2838.15,
    volume24h: 45200,
    isReal: false
  });
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'live' | 'error'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

 // ============================================
// REAL DATA CONNECTION
// ============================================
useEffect(() => {

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('Received:', data);

          if (data.type === 'trade' && data.data) {
            const trade = data.data[0];
            const newPrice = trade.p;
            
            setPriceData(prev => ({
              price: newPrice,
              bid: newPrice - 0.05,
              ask: newPrice + 0.07,
              change: newPrice - prev.price,
              changePercent: ((newPrice - prev.price) / prev.price) * 100,
              timestamp: trade.t,
              high24h: Math.max(prev.high24h, newPrice),
              low24h: Math.min(prev.low24h, newPrice),
              volume24h: trade.v || prev.volume24h,
              isReal: true
            }));
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
        };

        ws.onclose = () => {
          console.log('WebSocket closed, reconnecting...');
          setConnectionStatus('connecting');
          setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
        };

      } catch (error) {
        console.error('Failed to connect:', error);
        setConnectionStatus('error');
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // ============================================
  // REST OF YOUR APP (same as before)
  // ============================================

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
        <div className="flex items-center gap-2">
          {/* Connection Status Indicator */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${
            connectionStatus === 'live' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
              : connectionStatus === 'connecting'
              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'live' ? 'bg-green-500 animate-pulse' 
              : connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse'
              : 'bg-red-500'
            }`}></div>
            <span className="text-[10px] font-medium">
              {connectionStatus === 'live' ? 'LIVE' 
               : connectionStatus === 'connecting' ? 'CONNECTING'
               : 'SIMULATION'}
            </span>
          </div>
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
        {/* Data Source Badge */}
        {!priceData.isReal && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-400">
              ⚠️ Using simulated data. Add your Finnhub API key for real market data.
            </p>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-4 border border-[#D4AF37]/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-gray-400 uppercase">XAUUSD Spot</p>
              <h2 className={`text-4xl font-bold font-mono ${priceData.isReal ? 'text-white' : 'text-yellow-400'}`}>
                {priceData.price.toFixed(2)}
              </h2>
              <span className={`text-sm flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositive ? '+' : ''}{priceData.change.toFixed(2)} ({priceData.changePercent.toFixed(2)}%)
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Spread</p>
              <p className="text-sm font-mono text-[#D4AF37]">{(priceData.ask - priceData.bid).toFixed(2)}</p>
              {priceData.isReal && (
                <p className="text-[10px] text-green-400 mt-1">● Real-time</p>
              )}
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

      // Use real price data if available, otherwise generate
      const basePrice = priceData.price || 2845;
      const data = [];
      let price = basePrice - 10;
      
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
    }, [priceData.price]);

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
        {!priceData.isReal && (
          <p className="text-xs text-yellow-400 text-center">Chart uses simulated historical data</p>
        )}
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
          <p className="text-xs text-gray-400 mt-2">
            Current Price: <span className={priceData.isReal ? 'text-green-400' : 'text-yellow-400'}>
              {priceData.price.toFixed(2)} {priceData.isReal ? '(Live)' : '(Simulated)'}
            </span>
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-[#D4AF37]/20 text-center">
          <p className="text-xs text-gray-400 mb-3">Candle Close (M15)</p>
          <div className="flex justify-center gap-3 text-2xl font-bold font-mono">
            <span className="bg-[#0a0e1f] px-4 py-2 rounded-lg border border-[#D4AF37]/20">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[#D4AF37]">:</span>
            <span className="bg-[#0a0e1f] px-4 py-2 rounded-lg border border-[#D4AF37]/20">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm transition-colors">
            Execute Long
          </button>
          <button className="py-3 rounded-xl bg-[#0a0e1f] hover:bg-[#1a1e2f] text-gray-300 font-bold text-sm transition-colors border border-[#D4AF37]/20">
            Set Alert
          </button>
        </div>
      </div>
    );
  };

  const GradingSystem = () => {
    const grades = [
      { grade: 'A+', desc: 'Exceptional', color: 'from-yellow-300 to-yellow-500' },
      { grade: 'A', desc: 'High Quality', color: 'from-[#FFD700] to-[#B8860B]' },
      { grade: 'B', desc: 'Acceptable', color: 'from-yellow-400 to-yellow-600' },
      { grade: 'C', desc: 'Questionable', color: 'from-orange-400 to-orange-600' },
      { grade: 'D', desc: 'Avoid', color: 'from-red-500 to-red-700' },
    ];

    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl font-bold text-white">Grading System</h2>
        
        <div className="glass-panel rounded-2xl p-5 border border-[#D4AF37]/20">
          <h3 className="text-sm font-bold text-[#D4AF37] mb-4">How We Grade</h3>
          <div className="space-y-3">
                        {grades.map((g) => (
              <div
                key={g.grade}
                className="flex justify-between items-center p-3 rounded-xl bg-[#050811]/50 border border-[#D4AF37]/10"
              >
                <div>
                  <p className="text-sm font-bold text-white">{g.grade}</p>
                  <p className="text-xs text-gray-400">{g.desc}</p>
                </div>
                <div
                  className={`w-16 h-4 rounded-full bg-gradient-to-r ${g.color}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050811] text-white pb-24">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-4">
        {currentScreen === 'dashboard' && <Dashboard />}
        {currentScreen === 'breakdown' && <TradeBreakdown />}
        {currentScreen === 'chart' && <ChartView />}
        {currentScreen === 'timing' && <EntryTiming />}
        {currentScreen === 'grading' && <GradingSystem />}
      </main>
      <Navigation />
    </div>
  );
}

export default App;
