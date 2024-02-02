import classNames from "classnames";
import React, {
  useEffect,
  useRef,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import FilmsCarousel from "./FilmsCarousel";

interface Props {
  content: Array<{
    title: string;
    id: number;
    year: number;
    kind: string;
    filmmaker: string[];
    synopsis: string;
    rating: number;
    aNutshell: string;
    summary: string;
    image: string;
  }>;
}

const FilmsOfTheWeek = ({ content }: Props) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const positionsRef = useRef<Record<number, SectionPosition>>({});
  console.log(currentMovie);

  const updatePositionInfo = useCallback(
    (id: number, { yEnd, yStart }: SectionPosition) => {
      const newYEnd = yEnd + window.scrollY;
      const newYStart = yStart + window.scrollY;

      positionsRef.current[id] = { yEnd: newYEnd, yStart: newYStart };
    },
    []
  );

  const scrollToMovie = (id: number) => {
    const top = Math.floor(
      positionsRef.current[id].yStart -
        (innerHeight -
          (positionsRef.current[id].yEnd - positionsRef.current[id].yStart)) /
          2
    );

    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleScroll = useCallback(() => {
    const screenCenter = window.scrollY + window.innerHeight / 2;

    const movies = Object.entries(positionsRef.current);
    if (movies.length === 0) return;

    const idsPosition = movies.find(
      ([, { yEnd, yStart }]) => yStart < screenCenter && screenCenter < yEnd
    );
    const isCurrentMovieFirst =
      parseInt(movies[0][0]) === currentMovie &&
      movies[0][1].yStart > screenCenter;
    const isCurrentMovieLast =
      parseInt(movies[movies.length - 1][0]) === currentMovie &&
      movies[movies.length - 1][1].yEnd < screenCenter;

    if (idsPosition === undefined && isCurrentMovieFirst) {
      setCurrentMovie(-1);
      return;
    }
    if (idsPosition === undefined && isCurrentMovieLast) {
      setCurrentMovie(Infinity);
      return;
    }
    if (idsPosition !== undefined) {
      setCurrentMovie(parseInt(idsPosition[0]));
    }
  }, [currentMovie]);

  const handleScrollEnd = useCallback(() => {
    if (positionsRef.current[currentMovie] === undefined) return;
    const top = Math.floor(
      positionsRef.current[currentMovie].yStart -
        (innerHeight -
          (positionsRef.current[currentMovie].yEnd -
            positionsRef.current[currentMovie].yStart)) /
          2
    );
    if (top === window.scrollY) return;

    window.scrollTo({ top, behavior: "smooth" });
  }, [currentMovie]);

  const movies = content.map(({ title, year, image, id }) => ({
    title,
    year,
    image,
    id,
  }));
  const currentMovieIndex =
    currentMovie === -1
      ? currentMovie
      : currentMovie === Infinity
      ? movies.length
      : movies.findIndex(({ id }) => id === currentMovie);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, handleScrollEnd]);
  return (
    <>
      {content.map((props) => (
        <FilmOfTheWeek
          {...props}
          selected={props.id === currentMovie}
          key={props.title + props.filmmaker.join()}
          updatePositionInfo={updatePositionInfo}
        />
      ))}
      <FilmsCarousel
        currentIndex={currentMovieIndex}
        onClick={scrollToMovie}
        movies={movies}
      />
    </>
  );
};

interface SectionPosition {
  yStart: number;
  yEnd: number;
}
const FilmOfTheWeek = ({
  aNutshell,
  filmmaker,
  rating,
  summary,
  title,
  selected,
  updatePositionInfo,
  synopsis,
  year,
  id,
}: {
  title: string;
  year: number;
  filmmaker: string[];
  rating: number;
  synopsis: string;
  aNutshell: string;
  id: number;
  selected: boolean;
  updatePositionInfo: (id: number, position: SectionPosition) => void;
  summary: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  console.log("----- ----- ----- ----- RENDER ----- ----- ----- -----");

  useEffect(() => {
    const localRef = ref.current;
    if (localRef === null) return;
    const handleSize = () => {
      if (localRef === null) return;

      const { y, height } = localRef.getBoundingClientRect();

      updatePositionInfo(id, { yStart: y, yEnd: y + height });
    };

    handleSize();
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [updatePositionInfo, id]);

  return (
    <div
      ref={ref}
      className="w-full max-w-3xl bg-red-500 self-center md:pl-8 lg:pl-0"
    >
      <div
        className={classNames(
          "relative flex max-w-md flex-col gap-4 pl-6 font-serif transition-all duration-300 lg:max-w-lg",
          {
            "scale-90 opacity-75": !selected,
          }
        )}
      >
        <FilmHeader year={year} filmmaker={filmmaker} title={title} />
        <LabelWrapper label="le mot">
          <Info>{aNutshell}</Info>
        </LabelWrapper>
        <LabelWrapper label="la note">
          <Info>{rating}</Info>
        </LabelWrapper>
        <LabelWrapper label="le résumé">
          <Paragraph>{synopsis}</Paragraph>
        </LabelWrapper>
        <LabelWrapper label="l'avis">
          <Paragraph>{summary}</Paragraph>
        </LabelWrapper>
        <div
          className={classNames(
            "absolute left-0 w-[2px] rounded bg-white transition-all ",
            {
              "h-full duration-500": selected,
              "h-0 duration-0": !selected,
            }
          )}
        />
      </div>
    </div>
  );
};

const LabelWrapper = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-baseline gap-1">
    <span className="flex-shrink-0 text-sm ">{label}</span>
    {children}
  </div>
);
const FilmHeader = ({
  filmmaker,
  title,
  year,
}: {
  title: string;
  year: number;
  filmmaker: string[];
}) => (
  <div className="flex flex-col gap-1 text-gray-200">
    <h1 className="text-4xl italic">
      {title} <span className="text-lg not-italic">({year})</span>
    </h1>
    <h2 className="text-lg">{filmmaker.join(", ")}</h2>
  </div>
);

const Info = ({ children }: { children: string | number }) => (
  <h2 className="text-xl">{children}</h2>
);
const Paragraph = ({ children }: { children: string }) => (
  <p className="text-justify text-xl">{children}</p>
);

export default FilmsOfTheWeek;
