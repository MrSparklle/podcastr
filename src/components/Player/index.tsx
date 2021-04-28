import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToString } from '../../utils/convertDurationToString';

export function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    tooglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    IsLooping,
    toogleLoop,
    IsShufle,
    toogleShufle,
    clearPlayingState,
  } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  // lidar com elemento HTML Audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0); // quanto tempo em segundo o progresso do player ja tocou

  function setupProgressListner() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function onEpisodeEnd() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayingState();
    }
  }

  // controlando o play e pause dentro HTML
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando Agora</strong>
      </header>

      {episode ? (
        // player com episódio tocando
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        // player vazio
        <div className={styles.emptyPlayer}>
          <strong>Selecione um poadcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.file.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderStyle: '#04d361' }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToString(episode?.file?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.file.url}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={onEpisodeEnd}
            loop={IsLooping}
            onLoadedMetadata={setupProgressListner}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1}>
            <img
              src="/shuffle.svg"
              className={IsShufle ? styles.isActive : ''}
              alt="Embaralhar"
              onClick={() => toogleShufle()}
            />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button
            type="button"
            onClick={() => tooglePlay()}
            className={styles.playButton}
            disabled={!episode}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>
          <button
            type="button"
            className={IsLooping ? styles.isActive : ''}
            disabled={!episode}
            onClick={() => toogleLoop()}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
