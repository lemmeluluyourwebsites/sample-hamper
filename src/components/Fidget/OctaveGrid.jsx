import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Square, RotateCcw, Sparkles } from 'lucide-react';
import { DIATONIC_OCTAVES, playDiatonicNote, playPopSound, getAudioContext } from '../../utils/audio';

// 10 Distinct, recognizable and charming demo pieces
const DEMO_PIECES = [
  {
    title: 'Twinkle Star 🌟',
    notes: [
      { note: 'C4', freq: 261.63, time: 0 },
      { note: 'C4', freq: 261.63, time: 300 },
      { note: 'G4', freq: 392.00, time: 600 },
      { note: 'G4', freq: 392.00, time: 900 },
      { note: 'A4', freq: 440.00, time: 1200 },
      { note: 'A4', freq: 440.00, time: 1500 },
      { note: 'G4', freq: 392.00, time: 1800 },
      { note: 'F4', freq: 349.23, time: 2300 },
      { note: 'F4', freq: 349.23, time: 2600 },
      { note: 'E4', freq: 329.63, time: 2900 },
      { note: 'E4', freq: 329.63, time: 3200 },
      { note: 'D4', freq: 293.66, time: 3500 },
      { note: 'D4', freq: 293.66, time: 3800 },
      { note: 'C4', freq: 261.63, time: 4100 },
    ],
  },
  {
    title: 'Can’t Help Falling in Love 💖',
    notes: [
      { note: 'C4', freq: 261.63, time: 0 },
      { note: 'G4', freq: 392.00, time: 400 },
      { note: 'A4', freq: 440.00, time: 800 },
      { note: 'F4', freq: 349.23, time: 1200 },
      { note: 'E4', freq: 329.63, time: 1600 },
      { note: 'D4', freq: 293.66, time: 2000 },
      { note: 'C4', freq: 261.63, time: 2400 },
      { note: 'G4', freq: 392.00, time: 2800 },
      { note: 'C5', freq: 523.25, time: 3300 },
    ],
  },
  {
    title: 'Für Elise (Melody) 🎹',
    notes: [
      { note: 'E5', freq: 659.25, time: 0 },
      { note: 'D5', freq: 587.33, time: 250 },
      { note: 'E5', freq: 659.25, time: 500 },
      { note: 'D5', freq: 587.33, time: 750 },
      { note: 'E5', freq: 659.25, time: 1000 },
      { note: 'B4', freq: 493.88, time: 1250 },
      { note: 'D5', freq: 587.33, time: 1500 },
      { note: 'C5', freq: 523.25, time: 1750 },
      { note: 'A4', freq: 440.00, time: 2000 },
    ],
  },
  {
    title: 'Canon in D (Harmony) 🎻',
    notes: [
      { note: 'D4', freq: 293.66, time: 0 },
      { note: 'A3', freq: 220.00, time: 400 },
      { note: 'B3', freq: 246.94, time: 800 },
      { note: 'F3', freq: 174.61, time: 1200 },
      { note: 'G3', freq: 196.00, time: 1600 },
      { note: 'D3', freq: 130.81, time: 2000 },
      { note: 'G3', freq: 196.00, time: 2400 },
      { note: 'A3', freq: 220.00, time: 2800 },
      { note: 'D4', freq: 293.66, time: 3200 },
    ],
  },
  {
    title: 'Titanic: My Heart Will Go On 🌊',
    notes: [
      { note: 'E4', freq: 329.63, time: 0 },
      { note: 'F4', freq: 349.23, time: 350 },
      { note: 'G4', freq: 392.00, time: 700 },
      { note: 'A4', freq: 440.00, time: 1200 },
      { note: 'G4', freq: 392.00, time: 1600 },
      { note: 'F4', freq: 349.23, time: 2000 },
      { note: 'E4', freq: 329.63, time: 2400 },
      { note: 'D4', freq: 293.66, time: 2800 },
      { note: 'C4', freq: 261.63, time: 3300 },
    ],
  },
  {
    title: 'Ode to Joy ☀️',
    notes: [
      { note: 'E4', freq: 329.63, time: 0 },
      { note: 'E4', freq: 329.63, time: 300 },
      { note: 'F4', freq: 349.23, time: 600 },
      { note: 'G4', freq: 392.00, time: 900 },
      { note: 'G4', freq: 392.00, time: 1200 },
      { note: 'F4', freq: 349.23, time: 1500 },
      { note: 'E4', freq: 329.63, time: 1800 },
      { note: 'D4', freq: 293.66, time: 2100 },
      { note: 'C4', freq: 261.63, time: 2400 },
      { note: 'C4', freq: 261.63, time: 2700 },
      { note: 'D4', freq: 293.66, time: 3000 },
      { note: 'E4', freq: 329.63, time: 3300 },
      { note: 'E4', freq: 329.63, time: 3700 },
      { note: 'D4', freq: 293.66, time: 4100 },
    ],
  },
  {
    title: 'La La Land: City of Stars 🌃',
    notes: [
      { note: 'D4', freq: 293.66, time: 0 },
      { note: 'G4', freq: 392.00, time: 400 },
      { note: 'A4', freq: 440.00, time: 800 },
      { note: 'B4', freq: 493.88, time: 1200 },
      { note: 'A4', freq: 440.00, time: 1700 },
      { note: 'D4', freq: 293.66, time: 2200 },
      { note: 'G4', freq: 392.00, time: 2600 },
      { note: 'A4', freq: 440.00, time: 3000 },
      { note: 'B4', freq: 493.88, time: 3400 },
    ],
  },
  {
    title: 'Safe Haven Ballad 🌸',
    notes: [
      { note: 'C4', freq: 261.63, time: 0 },
      { note: 'E4', freq: 329.63, time: 350 },
      { note: 'G4', freq: 392.00, time: 700 },
      { note: 'C5', freq: 523.25, time: 1050 },
      { note: 'E5', freq: 659.25, time: 1400 },
      { note: 'C5', freq: 523.25, time: 1800 },
      { note: 'A4', freq: 440.00, time: 2200 },
      { note: 'G4', freq: 392.00, time: 2600 },
      { note: 'C4', freq: 261.63, time: 3100 },
    ],
  },
  {
    title: 'Moonlight Lullaby 🌙',
    notes: [
      { note: 'G4', freq: 392.00, time: 0 },
      { note: 'E4', freq: 329.63, time: 400 },
      { note: 'G4', freq: 392.00, time: 800 },
      { note: 'C5', freq: 523.25, time: 1300 },
      { note: 'B4', freq: 493.88, time: 1700 },
      { note: 'A4', freq: 440.00, time: 2100 },
      { note: 'G4', freq: 392.00, time: 2500 },
      { note: 'E4', freq: 329.63, time: 3000 },
      { note: 'C4', freq: 261.63, time: 3500 },
    ],
  },
  {
    title: 'Over the Rainbow 🌈',
    notes: [
      { note: 'C4', freq: 261.63, time: 0 },
      { note: 'C5', freq: 523.25, time: 450 },
      { note: 'B4', freq: 493.88, time: 900 },
      { note: 'G4', freq: 392.00, time: 1300 },
      { note: 'A4', freq: 440.00, time: 1700 },
      { note: 'B4', freq: 493.88, time: 2100 },
      { note: 'C5', freq: 523.25, time: 2500 },
      { note: 'A4', freq: 440.00, time: 3000 },
      { note: 'G4', freq: 392.00, time: 3500 },
    ],
  },
];

export default function OctaveGrid() {
  const [activeNotes, setActiveNotes] = useState({});
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [currentSongTitle, setCurrentSongTitle] = useState('');
  const startTimeRef = useRef(0);
  const playbackTimersRef = useRef([]);

  const handlePlayNote = (noteObj) => {
    getAudioContext();
    setActiveNotes((prev) => ({ ...prev, [noteObj.note]: true }));
    playDiatonicNote(noteObj.freq);

    if (isRecording) {
      const timeOffset = Date.now() - startTimeRef.current;
      setRecordedNotes((prev) => [...prev, { ...noteObj, time: timeOffset }]);
    }

    setTimeout(() => {
      setActiveNotes((prev) => {
        const next = { ...prev };
        delete next[noteObj.note];
        return next;
      });
    }, 280);
  };

  const toggleRecording = () => {
    playPopSound();
    if (isRecording) {
      setIsRecording(false);
    } else {
      stopPlayback();
      setRecordedNotes([]);
      setCurrentSongTitle('My Custom Song');
      setIsRecording(true);
      startTimeRef.current = Date.now();
    }
  };

  const stopPlayback = () => {
    playbackTimersRef.current.forEach(clearTimeout);
    playbackTimersRef.current = [];
    setIsPlayingBack(false);
    setActiveNotes({});
  };

  const playSongSequence = (notesList, title) => {
    if (notesList.length === 0) return;
    stopPlayback();
    getAudioContext();
    setIsPlayingBack(true);
    setCurrentSongTitle(title);

    notesList.forEach((item, index) => {
      const timer = setTimeout(() => {
        setActiveNotes((prev) => ({ ...prev, [item.note]: true }));
        playDiatonicNote(item.freq);

        setTimeout(() => {
          setActiveNotes((prev) => {
            const next = { ...prev };
            delete next[item.note];
            return next;
          });
        }, 240);

        if (index === notesList.length - 1) {
          setTimeout(() => {
            setIsPlayingBack(false);
          }, 400);
        }
      }, item.time);

      playbackTimersRef.current.push(timer);
    });
  };

  const handlePlayRecording = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    playPopSound();
    playSongSequence(recordedNotes, 'My Custom Song');
  };

  // Play random demo from the 10 curated pieces
  const playRandomDemo = () => {
    playPopSound();
    const randomIndex = Math.floor(Math.random() * DEMO_PIECES.length);
    const demo = DEMO_PIECES[randomIndex];
    playSongSequence(demo.notes, demo.title);
  };

  const handleClear = () => {
    playPopSound();
    stopPlayback();
    setRecordedNotes([]);
    setIsRecording(false);
    setCurrentSongTitle('');
  };

  useEffect(() => {
    return () => {
      playbackTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-pink-200/90 font-medium">
          <Music className="w-4 h-4 text-[#ff85a1]" />
          <span>Full 3 Octaves (Do, Re, Mi, Fa, Sol, La, Ti, Do)</span>
        </div>

        {currentSongTitle && (
          <span className="text-[11px] font-semibold text-[#ff85a1] bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-400/30">
            {currentSongTitle}
          </span>
        )}
      </div>

      {/* Main Board: ALL 3 OCTAVES STACKED BELOW EACH OTHER */}
      <div
        style={{ touchAction: 'pan-y' }}
        className="w-full p-4 rounded-3xl glass-card border border-pink-400/30 shadow-[0_4px_30px_rgba(255,133,161,0.25)] flex flex-col gap-4"
      >
        {DIATONIC_OCTAVES.map((octave, octaveIdx) => (
          <div key={octave.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-white tracking-wide">
                {octave.name}
              </span>
              <span className="text-[10px] text-pink-300/50">
                {octaveIdx === 0 ? 'Low Range' : octaveIdx === 1 ? 'Mid Range' : 'High Range'}
              </span>
            </div>

            {/* Keys row for this octave */}
            <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-8 gap-2 w-full">
              {octave.notes.map((item) => {
                const isPlaying = Boolean(activeNotes[item.note]);
                return (
                  <motion.button
                    key={item.note}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePlayNote(item)}
                    className={`relative min-h-[58px] rounded-xl flex flex-col items-center justify-center p-1.5 border transition-all duration-150 cursor-pointer ${
                      isPlaying
                        ? 'bg-gradient-to-t from-[#ff85a1] to-[#f472b6] border-white text-black scale-105 shadow-[0_0_25px_rgba(255,133,161,0.95)] z-10'
                        : 'bg-white/[0.05] border-pink-300/20 text-pink-100 hover:border-pink-400/50 hover:bg-white/[0.09]'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isPlaying ? 'text-black' : 'text-white'}`}>
                      {item.solfege}
                    </span>
                    <span className={`text-[9px] mt-0.5 font-medium ${isPlaying ? 'text-black/80' : 'text-pink-300/60'}`}>
                      {item.note}
                    </span>

                    {isPlaying && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/40 pointer-events-none"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Melody Recording & Playback Control Bar */}
        <div className="mt-2 pt-3 border-t border-pink-400/20 flex flex-wrap items-center justify-between gap-2">
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
              onClick={playRandomDemo}
              className="min-h-[42px] px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/25 text-pink-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff85a1]" />
              <span>Random Demo Piece 🎶</span>
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
        All 3 octaves directly at your fingertips — play your own melodies or listen to random classical demos ✨
      </p>
    </div>
  );
}
