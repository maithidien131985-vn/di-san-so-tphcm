import { useState, useEffect } from 'react';

// Singleton Audio Player for the entire application
class SharedAudioManager {
  constructor() {
    this.audio = null;
    this.currentStt = null;
    this.audioUrl = '';
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.playbackRate = 1.0;
    this.isMuted = false;
    this.listeners = new Set();
    this.initAudioElement();
  }

  initAudioElement() {
    if (typeof window === 'undefined') return;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'metadata';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime;
        this.notify();
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          this.duration = this.audio.duration;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.notify();
      });

      this.audio.addEventListener('ratechange', () => {
        this.playbackRate = this.audio.playbackRate;
        this.notify();
      });

      this.audio.addEventListener('volumechange', () => {
        this.isMuted = this.audio.muted;
        this.notify();
      });
    }
  }

  setSource(stt, url) {
    this.initAudioElement();
    if (!this.audio) return;

    if (this.currentStt !== stt || this.audioUrl !== url) {
      this.audio.pause();
      this.currentStt = stt;
      this.audioUrl = url;
      this.currentTime = 0;
      this.duration = 0;
      this.isPlaying = false;
      this.audio.src = url;
      this.audio.playbackRate = this.playbackRate;
      this.audio.muted = this.isMuted;
      this.audio.load();
      this.notify();
    }
  }

  play() {
    this.initAudioElement();
    if (!this.audio) return Promise.resolve();
    this.audio.playbackRate = this.playbackRate;
    this.audio.muted = this.isMuted;
    return this.audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(err => {
      console.warn('Audio play failed:', err);
      this.isPlaying = false;
      this.notify();
      throw err;
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
      return Promise.resolve(false);
    } else {
      return this.play().then(() => true).catch(() => false);
    }
  }

  seek(seconds) {
    if (!this.audio) return;
    const target = Math.max(0, Math.min(this.duration || seconds, seconds));
    this.audio.currentTime = target;
    this.currentTime = target;
    this.notify();
  }

  seekOffset(delta) {
    if (!this.audio) return;
    const target = Math.max(0, Math.min(this.duration || this.currentTime, this.currentTime + delta));
    this.seek(target);
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.notify();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
    }
    this.notify();
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
    }
    this.notify();
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      playbackRate: this.playbackRate,
      isMuted: this.isMuted,
      currentStt: this.currentStt,
      audioUrl: this.audioUrl
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }
}

export const sharedAudioManager = new SharedAudioManager();

export function useSharedAudio(monumentStt, customUrl) {
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const resolvedUrl = customUrl || `${baseUrl}/assets/audio/monument-audio-${monumentStt || 1}.mp3`;

  const [state, setState] = useState(() => sharedAudioManager.getState());

  useEffect(() => {
    sharedAudioManager.setSource(monumentStt, resolvedUrl);
    const unsubscribe = sharedAudioManager.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, [monumentStt, resolvedUrl]);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return {
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    playbackRate: state.playbackRate,
    isMuted: state.isMuted,
    currentStt: state.currentStt,
    audioUrl: state.audioUrl,
    play: () => sharedAudioManager.play(),
    pause: () => sharedAudioManager.pause(),
    togglePlay: () => sharedAudioManager.togglePlay(),
    seek: (time) => sharedAudioManager.seek(time),
    seekOffset: (delta) => sharedAudioManager.seekOffset(delta),
    setPlaybackRate: (rate) => sharedAudioManager.setPlaybackRate(rate),
    toggleMute: () => sharedAudioManager.toggleMute(),
    setMuted: (muted) => sharedAudioManager.setMuted(muted),
    formatTime
  };
}
