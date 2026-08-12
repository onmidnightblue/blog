"use client";

import { useState } from "react";
import { Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { SmallLoadingSpinner } from "@components/common";
import { useProjects } from "@hooks";
import ProjectCard from "./ProjectCard";

import "swiper/css";

interface Props {
  isAdmin?: boolean;
}

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14.5 6L8.5 12L14.5 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9.5 6L15.5 12L9.5 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProjectFeed = ({ isAdmin = false }: Props) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProjects();

  const projects = data?.pages.flatMap((page) => page.projects) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const updateNavState = (instance: SwiperInstance) => {
    const progress = instance.progress;
    setIsBeginning(progress <= 0.001);
    setIsEnd(progress >= 0.999 && !hasNextPage);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center px-4 md:px-12">
        <SmallLoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="flex h-full items-center justify-center px-4 md:px-12 text-sm text-center text-error">
        Failed to load projects. Please try again later.
      </p>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="mx-4 md:mx-12 flex h-full flex-col items-center justify-center px-6 text-center border border-dashed border-foreground/10 rounded-md">
        <p className="text-foreground-muted">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="project-feed flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-hidden pb-3">
        <Swiper
          className="project-feed-swiper h-full w-full"
          modules={[Keyboard]}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          slidesPerView="auto"
          spaceBetween={16}
          slidesOffsetBefore={48}
          slidesOffsetAfter={48}
          nested
          touchStartPreventDefault={false}
          onSwiper={(instance) => {
            setSwiper(instance);
            updateNavState(instance);
          }}
          onReachEnd={handleLoadMore}
          onSlideChange={(instance) => {
            updateNavState(instance);
            if (instance.activeIndex >= projects.length - 2) {
              handleLoadMore();
            }
          }}
          onTransitionEnd={updateNavState}
          onProgress={updateNavState}
          onSlidesLengthChange={updateNavState}
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id} className="project-feed-slide">
              <ProjectCard project={project} isAdmin={isAdmin} />
            </SwiperSlide>
          ))}

          {isFetchingNextPage && (
            <SwiperSlide className="project-feed-slide project-feed-slide--loader">
              <div className="flex h-full items-center justify-center">
                <SmallLoadingSpinner />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <div className="project-feed-controls shrink-0">
        <button
          type="button"
          aria-label="Previous project"
          className="project-feed-nav"
          disabled={isBeginning}
          onClick={() => swiper?.slidePrev()}
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Next project"
          className="project-feed-nav"
          disabled={isEnd}
          onClick={() => swiper?.slideNext()}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default ProjectFeed;
