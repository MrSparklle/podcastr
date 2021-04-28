import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { convertDurationToString } from '../../utils/convertDurationToString';
import Image from 'next/image';
import styles from './episode.module.scss';
import Link from 'next/link';
import Head from 'next/head';
import { usePlayer } from '../../contexts/PlayerContext';

export default function Episode({ episode }) {
  const router = useRouter();

  const { play } = usePlayer();

  if (router.isFallback) {
    // para quando estiver em fallback true em GetStaticPaths
    return <h1>Carregando...</h1>;
  }

  return (
    <div className={styles.episode}>
      <Head>
        <title>Poadcastr | {episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.file.durationAsString}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking', // incremental static regeneration
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    description: data.description,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    file: {
      duration: data.file.duration,
      durationAsString: convertDurationToString(data.file.duration),
      url: data.file.url,
    },
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
