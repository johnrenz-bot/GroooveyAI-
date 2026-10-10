import React, { useState, useEffect } from 'react';
import { startMetronome, stopMetronome, updateMetronomeBpm } from '../utils/audio';

interface Props {
  initialBpm?: number;
  label?: string;
}

export const InteractivePracticeBar: React.FC<Props> = ({
  initialBpm = 108,
  label = 'Rehearsal mm. 14–32 • Patter Lab',
}) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [transposition, setTransposition] = useState<'baritone' | 'score' | 'tenor'>('score');

  const getTempoLabel = (val: number) => {
    if (val < 92) return 'Andante (Slow Drill)';
    if (val < 104) return 'Moderato';
    if (val < 116) return 'Allegro Moderato (Audition)';
    return 'Presto (Hyper Drill)';
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopMetronome();
      setIsPlaying(false);
    } else {
      startMetronome(bpm, (beat) => {
        setActiveBeat(beat);
      });
      setIsPlaying(true);
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBpm(val);
    updateMetronomeBpm(val);
  };

  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, []);

  return (
    <div className="bg-[#EFEAE3] rounded-2xl p-4 shadow-xs space-y-3.5 border border-[#E3DDD4]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#FBE6D4] flex items-center justify-center text-[#92400e] border border-[#F5D5BE]">
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </span>
          <div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Interactive Practice Bar</h3>
            <span className="text-xs text-stone-500 font-medium">{label}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
            isPlaying ? 'bg-amber-800 hover:bg-amber-900' : 'bg-[#92400e] hover:bg-[#78350f]'
          }`}
          title={isPlaying ? 'Stop metronome' : 'Start tempo drill'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
          <span>{isPlaying ? 'Stop Metronome' : 'Audition Tempo'}</span>
        </button>
      </div>

      {/* Metronome Speed & Audio Wave Visualization */}
      <div className="bg-[#F8F5F0] rounded-xl p-3 space-y-2.5 border border-[#E4DDD3]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#92400e]">speed</span>
            <span className="text-xs text-stone-800 font-semibold">Target Metronome:</span>
            <span className="text-base text-[#92400e] font-bold font-mono">{bpm}</span>
            <span className="text-xs text-stone-500">BPM</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFEAE3] text-[#92400e] font-medium border border-[#E3DDD4]">
            {getTempoLabel(bpm)}
          </span>
        </div>

        {/* Tempo Slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-mono">80</span>
          <input
            type="range"
            min={80}
            max={132}
            value={bpm}
            onChange={handleBpmChange}
            className="w-full accent-[#92400e] h-1.5 bg-[#E3DDD4] rounded-lg cursor-pointer"
          />
          <span className="text-xs text-stone-500 font-mono">132</span>
        </div>

        {/* Waveform Animation Simulation with live beat tracking */}
        <div className="h-10 bg-[#EFEAE3] rounded-lg flex items-center justify-center gap-1.5 px-3 overflow-hidden select-none border border-[#E5DFD5]">
          {[
            { color: '#92400e', h: 'h-3', peak: 'h-6' },
            { color: '#92400e', h: 'h-6', peak: 'h-8' },
            { color: '#92400e', h: 'h-4', peak: 'h-7' },
            { color: '#78350f', h: 'h-7', peak: 'h-9' },
            { color: '#78350f', h: 'h-8', peak: 'h-10' },
            { color: '#92400e', h: 'h-5', peak: 'h-8' },
            { color: '#92400e', h: 'h-3', peak: 'h-6' },
            { color: '#78350f', h: 'h-6', peak: 'h-9' },
            { color: '#92400e', h: 'h-8', peak: 'h-10' },
            { color: '#92400e', h: 'h-4', peak: 'h-7' },
            { color: '#78350f', h: 'h-5', peak: 'h-8' },
            { color: '#92400e', h: 'h-3', peak: 'h-6' },
            { color: '#92400e', h: 'h-6', peak: 'h-9' },
          ].map((bar, idx) => {
            const isBeating = isPlaying && idx % 4 === activeBeat;
            return (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isBeating ? `${bar.peak} scale-y-125 opacity-100` : `${bar.h} opacity-75`
                }`}
                style={{
                  backgroundColor: bar.color,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Transposition Key Selector */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-stone-600 font-medium">Transposition Key:</span>
        <div className="flex items-center bg-[#F8F5F0] rounded-full p-1 gap-1 border border-[#E5DFD5]">
          <button
            type="button"
            onClick={() => setTransposition('baritone')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              transposition === 'baritone'
                ? 'bg-[#EFEAE3] text-[#92400e] font-bold shadow-xs border border-[#E0D9CE]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            -1 (Baritone)
          </button>
          <button
            type="button"
            onClick={() => setTransposition('score')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              transposition === 'score'
                ? 'bg-[#EFEAE3] text-[#92400e] font-bold shadow-xs border border-[#E0D9CE]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            0 (Score Key)
          </button>
          <button
            type="button"
            onClick={() => setTransposition('tenor')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              transposition === 'tenor'
                ? 'bg-[#EFEAE3] text-[#92400e] font-bold shadow-xs border border-[#E0D9CE]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            +1 (Tenor)
          </button>
        </div>
      </div>
    </div>
  );
};
