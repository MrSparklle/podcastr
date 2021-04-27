import { createContext } from 'react';

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
  tooglePlay: () => void;
  setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
