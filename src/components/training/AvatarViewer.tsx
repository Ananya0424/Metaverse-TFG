import { useEffect, useRef } from 'react';
import { AvatarLoader } from '../../lib/avatar-loader';

export function AvatarViewer({ audioSrc, onPlaybackEnd }: { audioSrc: string | null, onPlaybackEnd?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarLoaderRef = useRef<AvatarLoader | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!avatarLoaderRef.current && containerRef.current) {
      avatarLoaderRef.current = new AvatarLoader('avatar-container');
      avatarLoaderRef.current.init();
      avatarLoaderRef.current.onReady(() => {
        avatarLoaderRef.current?.loadExternalAnimation(
          '/models/F_Standing_Idle_001.glb',
          'idle',
          () => avatarLoaderRef.current?._playAnimation('idle')
        );
        avatarLoaderRef.current?.loadExternalAnimation(
          '/models/F_Talking_Variations_001.glb',
          'Talking1'
        );
      });
    }

    return () => {
      if (avatarLoaderRef.current) {
        avatarLoaderRef.current.destroy();
        avatarLoaderRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (audioSrc && avatarLoaderRef.current) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      audio.addEventListener('canplaythrough', () => {
        if (avatarLoaderRef.current) {
          avatarLoaderRef.current.startLipSync(audio);
          audio.play().catch(console.error);
        }
      });

      audio.addEventListener('ended', () => {
        if (avatarLoaderRef.current) {
          avatarLoaderRef.current.stopLipSync();
        }
        if (onPlaybackEnd) onPlaybackEnd();
      });
      
      audio.load();
    }
  }, [audioSrc, onPlaybackEnd]);

  return (
    <div
      id="avatar-container"
      ref={containerRef}
      className="w-full h-full min-h-[600px] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden relative shadow-lg"
    />
  );
}
