import classNames from "classnames";

const FilmPoster = ({
  image,
  name,
  className,
}: {
  image: string;
  className?: string;
  name: string;
}) => (
  <div
    className={classNames("relative h-full w-full transition-all", className)}
  >
    <img
      src={image}
      alt={name}
      className="h-full w-full  scale-105 rounded object-contain opacity-0 blur-lg"
      draggable={false}
    />
    <img
      src={image}
      alt=""
      className="absolute top-0 z-10 h-full rounded object-contain "
      draggable={false}
    />
  </div>
);

export default FilmPoster;
