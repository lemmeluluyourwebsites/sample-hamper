import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Square, RotateCcw, Sparkles } from 'lucide-react';
import { DIATONIC_OCTAVES, playDiatonicNote, playPopSound } from '../../utils/audio';

export default function OctaveGrid() {
  const [activeNote, setActiveNote] = useState(null);
  const [selectedOctaveIdx, setSelectedOctaveIdx] = useState(1); // default Octave 4 (Mid)
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const startTimeRef = useRef(0);
  const playbackTimersRef = useRef([]);

  const currentOctave = DIATONIC_OCTAVES[selectedOctaveIdx];

  const handlePlayNote = (noteObj) => {
    setActiveNote(noteObj.note);
    playDiatonicNote(noteObj.freq);

    if (isRecording) {
      const timeOffset = Date.now() - startTimeRef.current;
      setRecordedNotes((prev) => [...prev, { ...noteObj, time: timeOffset }]);
    }

    setTimeout(() => {
      setActiveNote((curr) => (curr === noteObj.note ? null : curr));
    }, 280);
  };

  const toggleRecording = () => {
    playPopSound();
    if (isRecording) {
      setIsRecording(false);
    } else {
      setRecordedNotes([]);
      setIsRecording(true);
      startTimeRef.current = Date.now();
    }
  };

  const stopPlayback = () => {
    playbackTimersRef.current.forEach(clearTimeout);
    playbackTimersRef.current = [];
    setIsPlayingBack(false);
    setActiveNote(null);
  };

  const handlePlayRecording = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    playPopSound();
    setIsPlayingBack(true);

    recordedNotes.forEach((item, index) => {
      const timer = setTimeout(() => {
        setActiveNote(item.note);
        playDiatonicNote(item.freq);

        setTimeout(() => {
          setActiveNote(null);
        }, 220);

        if (index === recordedNotes.length - 1) {
          setTimeout(() => {
            setIsPlayingBack(false);
          }, 350);
        }
      }, item.time);

      playbackTimersRef.current.push(timer);
    });
  };

  const handleClear = () => {
    playPopSound();
    stopPlayback();
    setRecordedNotes([]);
    setIsRecording(false);
  };

  const playDemoMelody = () => {
    playPopSound();
    stopPlayback();
    // Sweet lullaby sequence in Octave 4 & 5
    const demo = [
      { solfege: 'Do', note: 'C4', freq: 261.63, time: 0 },
      { solfege: 'Mi', note: 'E4', freq: 329.63, time: 350 },
      { solfege: 'Sol', note: 'G4', freq: 392.00, time: 700 },
      { solfege: 'Do', note: 'C5', freq: 523.25, time: 1050 },
      { solfege: 'Ti', note: 'B4', freq: 493.88, time: 1400 },
      { solfege: 'Sol', note: 'G4', freq: 392.00, time: 1750 },
      { solfege: 'La', note: 'A4', freq: 440.00, time: 2100 },
      { solfege: 'Do', note: 'C5', freq: 523.25, time: 2500 },
    ];
    setRecordedNotes(demo);
    setIsPlayingBack(true);

    demo.forEach((item, index) => {
      const timer = setTimeout(() => {
        setActiveNote(item.note);
        playDiatonicNote(item.freq);
        setTimeout(() => setActiveNote(null), 250);
        if (index === demo.length - 1) {
          setTimeout(() => setIsPlayingBack(false), 400);
        }
      }, item.time);
      playbackTimersRef.current.push(timer);
    });
  };

  useEffect(() => {
    return () => {
      playbackTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Title & Octave Picker */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/90 font-medium">
          <Music className="w-4 h-4 text-[#ff85a1]" />
          <span>Full 3-Octave Harp (Do, Re, Mi, Fa, Sol, La, Ti, Do)</span>
        </div>
      </div>

      {/* Octave Range Tabs */}
      <div className="w-full flex items-center gap-1.5 mb-3">
        {DIATONIC_OCTAVES.map((oct, idx) => (
          <button
            key={idx}
            onClick={() => {
              playPopSound();
              setSelectedOctaveIdx(idx);
            }}
            className={`flex-1 min-h-[40px] px-2 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedOctaveIdx === idx
                ? 'bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black shadow-[0_0_15px_rgba(255,133,161,0.5)]'
                : 'glass-panel text-pink-200/60 hover:text-white border border-pink-400/20'
            }`}
          >
            {oct.name.split(' ')[0]} {oct.name.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Main Piano / Harp Board */}
      <div
        style={{ touchAction: 'none' }}
        className="w-full p-3.5 rounded-3xl glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex flex-col justify-between"
      >
        <div className="text-[11px] text-pink-300/70 mb-2 px-1 flex items-center justify-between">
          <span>{currentOctave.name}</span>
          <span className="text-[#ff85a1]">Tap keys to compose</span>
        </div>

        {/* Diatonic Keys Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 w-full">
          {currentOctave.notes.map((item) => {
            const isPlaying = activeNote === item.note;
            return (
              <motion.button
                key={item.note}
                whileTap={{ scale: 0.92 }}
                onClick={() => handlePlayNote(item)}
                className={`relative min-h-[80px] rounded-2xl flex flex-col items-center justify-center p-2 border transition-all duration-150 cursor-pointer ${
                  isPlaying
                    ? 'bg-gradient-to-t from-[#ff85a1] to-[#f472b6] border-white text-black scale-105 shadow-[0_0_30px_rgba(255,133,161,0.9)] z-10'
                    : 'bg-white/[0.04] border-pink-300/20 text-pink-100 hover:border-pink-400/50 hover:bg-white/[0.08]'
                }`}
              >
                <span className={`text-base font-bold ${isPlaying ? 'text-black' : 'text-white'}`}>
                  {item.solfege}
                </span>
                <span className={`text-[10px] mt-0.5 font-medium ${isPlaying ? 'text-black/80' : 'text-pink-300/50'}`}>
                  {item.note}
                </span>

                {isPlaying && (
                  <motion.div
                    layoutId={`keyGlow-${item.note}`}
                    className="absolute inset-0 rounded-2xl bg-white/40 pointer-events-none"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Melody Recording & Playback Control Station */}
        <div className="mt-4 pt-3.5 border-t border-pink-400/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`min-h-[42px] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition active:scale-95 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                  : 'bg-pink-500/20 border border-pink-400/30 text-pink-200 hover:text-white'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5" /> : <div className="w-2.5 h-2.5 rounded-full bg-red-400" />}
              <span>{isRecording ? 'Finish Piece' : 'Record Song'}</span>
            </button>

            <button
              onClick={handlePlayRecording}
              disabled={recordedNotes.length === 0 || isPlayingBack}
              className="min-h-[42px] px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff85a1] to-[#f472b6] text-black font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-[0_0_15px_rgba(255,133,161,0.4)] active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isPlayingBack ? 'Playing...' : `Play Song (${recordedNotes.length})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={playDemoMelody}
              className="min-h-[42px] px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/25 text-pink-200 hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer active:scale-95 transition"
            >
              <Sparkles className="w-3 h-3 text-[#ff85a1]" />
              <span>Demo Piece</span>
            </button>

            {recordedNotes.length > 0 && (
              <button
                onClick={handleClear}
                title="Clear melody"
                className="min-h-[42px] min-w-[42px] p-2 rounded-full bg-pink-500/10 border border-pink-400/20 text-pink-300 hover:text-white flex items-center justify-center cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-pink-300/50 mt-3 text-center">
        Create and record your own romantic melody piece across 3 octaves ✨
      </p>
    </div>
  );
}
