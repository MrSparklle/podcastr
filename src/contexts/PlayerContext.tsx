import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  file: {
    duration: number;
    url: string;
  };
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number; // indice da lista do episodio que esta tocando.
  isPlaying: boolean;
  play: (episode: Episode) => void; // função
  playList: (list: Episode[], index: number) => void;
  tooglePlay: () => void;
  toogleShufle: () => void;
  setPlayingState: (state: boolean) => void;
  clearPlayingState: () => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  IsLooping: boolean;
  IsShufle: boolean;
  toogleLoop: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [IsLooping, setIsLooping] = useState(false);
  const [IsShufle, setIsShufle] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toogleLoop() {
    setIsLooping(!IsLooping);
  }

  function toogleShufle() {
    setIsShufle(!IsShufle);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayingState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const hasNext = IsShufle || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (IsShufle) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playNext,
        playPrevious,
        isPlaying,
        tooglePlay,
        setPlayingState,
        playList,
        hasNext,
        hasPrevious,
        IsLooping,
        toogleLoop,
        IsShufle,
        toogleShufle,
        clearPlayingState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// exportação basica para facilitar a importação do useContexxt e PlayerContext juntos
export const usePlayer = () => {
  return useContext(PlayerContext);
};
