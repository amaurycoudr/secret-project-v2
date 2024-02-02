import classNames from "classnames";
import FilmPoster from "./FilmPoster";

const FilmsCarousel = ({
  movies,
  currentIndex,
  onClick,
}: {
  movies: Array<{ image: string; id: number; title: string }>;
  currentIndex: number;

  onClick: (id: number) => void;
}) => (
  <div
    className={classNames(
      "fixed right-16 top-1/2 text-4xl  transition-all duration-200",
      "md:h-[250px] md:w-[187px] md:-translate-y-[100px]",
      "lg:h-[300px] lg:w-[225px] lg:-translate-y-[150px]",
      "xl:h-[400px] xl:w-[300px] xl:-translate-y-[200px]"
    )}
  >
    <div className="top-1/2 absolute h-0.5 bg-green-500 w-screen right-0" />
    {movies.map(({ image, id, title }, index) => (
      <FilmCarousel
        key={id}
        name={title}
        image={image}
        onClick={() => {
          onClick(id);
        }}
        index={index}
        currentIndex={currentIndex}
        isHidden={currentIndex === -1 || currentIndex === movies.length}
      />
    ))}
  </div>
);

const FilmCarousel = ({
  image,
  onClick,
  currentIndex,
  index,
  isHidden,
  name,
}: {
  image: string;
  name: string;
  onClick: () => void;
  currentIndex: number;
  index: number;
  isHidden: boolean;
}) => {
  const isFarBefore = index < currentIndex - 1;
  const isFarAfter = index > currentIndex + 1;
  const isBefore = index === currentIndex - 1;
  const isAfter = index === currentIndex + 1;
  const isCurrent = index === currentIndex;

  return (
    <button
      onClick={onClick}
      className={classNames(
        "absolute -z-10 flex h-full w-full object-contain transition-all duration-200",
        {
          "-translate-y-full translate-x-[200%] rotate-90 scale-75 opacity-70":
            isFarBefore,
          "-translate-y-full translate-x-3/4 rotate-45 scale-75 cursor-pointer opacity-70 hover:scale-90 hover:opacity-100":
            isBefore && !isHidden,
          "translate-x-3/4 translate-y-full -rotate-45 scale-75 cursor-pointer opacity-70 hover:scale-90 hover:opacity-100":
            isAfter && !isHidden,
          "translate-x-[200%] translate-y-full -rotate-90 scale-75 opacity-70":
            isFarAfter,
          "translate-x-0 translate-y-0": isCurrent,
          "opacity-0": isHidden,
        }
      )}
      tabIndex={-1}
    >
      <FilmPoster name={name} image={image} />
    </button>
  );
};

export default FilmsCarousel;
