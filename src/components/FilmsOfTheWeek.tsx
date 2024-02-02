import classNames from "classnames";
import { type ReactNode } from "react";
import Carousel from "./Carousel";
import FilmPoster from "./FilmPoster";

interface FilmOfTheWeekInfos {
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
}

interface Props {
  content: FilmOfTheWeekInfos[];
}

const FilmsOfTheWeek = ({ content }: Props) => (
  <Carousel
    className="gap-24"
    classNameWrapperContent="self-center w-full max-w-3xl md:pl-8 lg:pl-0"
    content={content}
    ContentElement={FilmOfTheWeek}
    CarouselElement={({ title, image }) => (
      <FilmPoster name={title} image={image} />
    )}
  />
);

const FilmOfTheWeek = ({
  aNutshell,
  filmmaker,
  rating,
  summary,
  title,
  selected,
  synopsis,
  year,
  id,
}: FilmOfTheWeekInfos & {
  selected: boolean;
}) => (
  <div
    className={classNames(
      "relative flex max-w-md flex-col gap-4 pl-6 font-serif transition-all duration-300 lg:max-w-lg",
      { "scale-90 opacity-75": !selected }
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
);

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
