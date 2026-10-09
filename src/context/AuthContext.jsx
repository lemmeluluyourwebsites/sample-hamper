import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('hamper_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize background music
  useEffect(() => {
    const audio = new Audio('/assets/background.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playBackgroundMusic = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsMusicPlaying(true);
      } catch (err) {
        console.warn('Autoplay blocked or audio error:', err);
        // Will be played on first user interaction
      }
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(err => console.warn('Audio play prevented:', err));
    }
  };

  const login = (username, password) => {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    // Strictly accepts Username: influencer and Password: influence
    if (u === 'influencer' && p === 'influence') {
      try {
        sessionStorage.setItem('hamper_unlocked', 'true');
      } catch (e) {
        console.error(e);
      }
      setIsAuthenticated(true);
      playBackgroundMusic();
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter the correct key to your hamper.'
    };
  };

  const lock = () => {
    try {
      sessionStorage.removeItem('hamper_unlocked');
    } catch (e) {
      console.error(e);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        lock,
        isMusicPlaying,
        toggleMusic,
        playBackgroundMusic
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
