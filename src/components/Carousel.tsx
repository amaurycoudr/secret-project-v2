import classNames from "classnames";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";

interface ElementBorder {
  yStart: number;
  yEnd: number;
}
interface CarouselProps<T> {
  content: T[];
  className: string;
  classNameWrapperContent?: string;
  ContentElement: FC<T & { selected: boolean }>;
  CarouselElement: FC<T>;
}

const Carousel = <T extends object>({
  CarouselElement,
  ContentElement,
  content,
  classNameWrapperContent,
  className,
}: CarouselProps<T>) => {
  const INITIAL_INDEX = -1;
  const FIRST_INDEX = 0;
  const LAST_INDEX = content.length - 1;
  const FINISHED_INDEX = content.length;

  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const positionsRef = useRef<Record<number, ElementBorder>>({});

  const updatePositionInfo = useCallback(
    (index: number, { yEnd, yStart }: ElementBorder) => {
      const newYEnd = yEnd + window.scrollY;
      const newYStart = yStart + window.scrollY;
      positionsRef.current[index] = { yEnd: newYEnd, yStart: newYStart };
    },
    []
  );

  const scrollToElement = useCallback((index: number) => {
    if (positionsRef.current[index] === undefined) return;
    const { yStart, yEnd } = positionsRef.current[index];
    const top = Math.floor(yStart - (innerHeight - (yEnd - yStart)) / 2);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const screenCenter = window.scrollY + window.innerHeight / 2;

    const indexPositions = Object.entries(positionsRef.current);
    if (indexPositions.length === 0) return;

    const centerIndex = indexPositions.find(
      ([, { yEnd, yStart }]) => yStart < screenCenter && screenCenter < yEnd
    )?.[0];
    const isBeforeFirst = indexPositions[0][1].yStart > screenCenter;
    const isAfterLast =
      indexPositions[indexPositions.length - 1][1].yEnd < screenCenter;

    if (centerIndex === undefined && isBeforeFirst) {
      setCurrentIndex(-1);
    } else if (centerIndex === undefined && isAfterLast) {
      setCurrentIndex(indexPositions.length);
    } else if (centerIndex !== undefined) {
      setCurrentIndex(parseInt(centerIndex[0]));
    } else if (centerIndex === undefined && currentIndex === INITIAL_INDEX) {
      const nearestIndex = parseInt(
        indexPositions.sort(
          ([, { yStart: yStart1 }], [, { yStart: yStart2 }]) =>
            Math.min(yStart2 - screenCenter, 0) <
            Math.min(yStart1 - screenCenter, 0)
              ? -1
              : 1
        )[0][0]
      );

      setCurrentIndex(nearestIndex);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (
        (ev.key === " " || ev.key === "ArrowDown") &&
        currentIndex < LAST_INDEX
      ) {
        scrollToElement(Math.min(currentIndex + 1, LAST_INDEX));
        ev.preventDefault();
      }
      if (ev.key === "ArrowUp" && currentIndex > FIRST_INDEX) {
        scrollToElement(Math.max(currentIndex - 1, FIRST_INDEX));
        ev.preventDefault();
      }
    },
    [currentIndex]
  );

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScroll]);
  return (
    <div className={classNames("flex flex-col", className)}>
      {content.map(({ ...props }, index) => (
        <WrapperContentElement
          key={index}
          index={index}
          className={classNameWrapperContent}
          updatePositionInfo={updatePositionInfo}
        >
          <ContentElement {...props} selected={index === currentIndex} />
        </WrapperContentElement>
      ))}

      <div
        className={classNames(
          "fixed right-16 top-1/2 text-4xl transition-all duration-200",
          "md:h-[250px] md:w-[187px] md:-translate-y-[125px]",
          "lg:h-[300px] lg:w-[225px] lg:-translate-y-[150px]",
          "xl:h-[400px] xl:w-[300px] xl:-translate-y-[200px]"
        )}
      >
        {content.map((props, index) => (
          <WrapperCarouselElement
            key={index}
            currentIndex={currentIndex}
            index={index}
            isHidden={
              currentIndex === INITIAL_INDEX || currentIndex === FINISHED_INDEX
            }
            onClick={() => {
              scrollToElement(index);
            }}
          >
            <CarouselElement {...props} />
          </WrapperCarouselElement>
        ))}
      </div>
    </div>
  );
};

const WrapperContentElement = ({
  index,
  updatePositionInfo,
  className,
  children,
}: {
  index: number;
  updatePositionInfo: (index: number, info: ElementBorder) => void;
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localRef = ref.current;
    if (localRef === null) return;
    const handleSize = () => {
      if (localRef === null) return;
      const { y, height } = localRef.getBoundingClientRect();
      updatePositionInfo(index, { yStart: y, yEnd: y + height });
    };

    handleSize();
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [updatePositionInfo, index]);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

const WrapperCarouselElement = ({
  onClick,
  currentIndex,
  index,
  isHidden,
  children,
}: {
  children: ReactNode;
  onClick: () => void;
  currentIndex: number;
  index: number;
  isHidden: boolean;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
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
          "scale-75 opacity-70 cursor-pointer": !isCurrent && !isHidden,
          "-translate-y-full translate-x-[200%] rotate-90": isFarBefore,
          "-translate-y-full translate-x-3/4 rotate-45 hover:scale-90 hover:opacity-100":
            isBefore && !isHidden,
          "translate-x-3/4 translate-y-full -rotate-45 hover:scale-90 hover:opacity-100":
            isAfter && !isHidden,
          "translate-x-[200%] translate-y-full -rotate-90": isFarAfter,
          "translate-x-0 translate-y-0": isCurrent,
          "opacity-0": isHidden,
        }
      )}
      onFocus={() => {
        ref.current?.blur();
      }}
      ref={ref}
      tabIndex={-1}
    >
      {children}
    </button>
  );
};

export default Carousel;
