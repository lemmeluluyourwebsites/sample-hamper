import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const VALID_USERS = [
  { username: 'influencer', password: 'influence', name: 'Influencer' },
  { username: 'geet', password: 'hehe', name: 'Geet' },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('hamper_unlocked_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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

    const matched = VALID_USERS.find(
      (entry) => entry.username.toLowerCase() === u && entry.password === p
    );

    if (matched) {
      const userData = { username: matched.username, name: matched.name };
      try {
        sessionStorage.setItem('hamper_unlocked_user', JSON.stringify(userData));
      } catch (e) {
        console.error(e);
      }
      setUser(userData);
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
      sessionStorage.removeItem('hamper_unlocked_user');
    } catch (e) {
      console.error(e);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        user,
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
