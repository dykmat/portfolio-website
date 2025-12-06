import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

function ProjectItem({ project, className, onClick, onMouseEnter, onMouseLeave, isPlaying, isCaseStudy, isSelected, isTransitioning, isReturningToHome }) {
    const videoRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showPoster, setShowPoster] = useState(true);

    // Memoize opacity calculations to avoid recalculations
    // During transition, keep selected project visible for smooth layout animation
    // Only fade out non-selected projects during transition
    const containerOpacity = useMemo(() => {
        if (isReturningToHome) return 0;
        if (isTransitioning) {
            // Keep selected project visible during transition for smooth layout animation
            if (isSelected) return 1;
            // Fade out non-selected projects
            return 0;
        }
        return 1;
    }, [isReturningToHome, isTransitioning, isSelected]);

    const textOpacity = useMemo(() => {
        if (isReturningToHome) return 0;
        // Hide text during transition when going from grid to case study
        if (isTransitioning && isSelected && !isCaseStudy) return 0;
        // Hide text in case study mode
        if (isCaseStudy) return 0;
        return 1;
    }, [isReturningToHome, isTransitioning, isSelected, isCaseStudy]);

    // Memoize transition config
    // Keep opacity transitions smooth, layout animation will be handled by Framer Motion
    const transitionConfig = useMemo(() => ({
        duration: isReturningToHome ? (isCaseStudy ? 1 : 0) : 1,
        ease: [0.43, 0.13, 0.23, 0.96],
        // Ensure layout animations are smooth
        layout: {
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96]
        }
    }), [isReturningToHome, isCaseStudy]);

    // Optimize video handling - only play when visible and not transitioning
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // When returning home, always reset video to show poster image
        if (isReturningToHome) {
            video.pause();
            video.currentTime = 0;
            // Force video to show poster by resetting load state
            video.load();
            setIsPaused(false);
            setShowPoster(true);
            return;
        }



        // When not returning to home and in grid view, ensure video shows poster when not playing
        if (!isCaseStudy && !isPlaying) {
            video.pause();
            video.currentTime = 0;
            // Ensure poster is visible by forcing a load
            if (video.readyState >= 2) {
                video.load();
            }
            setShowPoster(true);
            return;
        }

        // In case study mode or playing state
        if (isPlaying && !isPaused) {
            // Allow autoplay on mobile in case study mode
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Hide poster when video starts playing
                    setShowPoster(false);
                }).catch(() => {
                    // Autoplay prevented - silent fail
                });
            }
        }
    }, [isPlaying, isPaused, isCaseStudy, isTransitioning, isReturningToHome]);

    // Track video play/pause state to show/hide poster
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isCaseStudy) return;

        const handlePlay = () => setShowPoster(false);
        const handlePause = () => {
            if (video.currentTime === 0) {
                setShowPoster(true);
            }
        };
        const handleTimeUpdate = () => {
            if (video.currentTime === 0 && video.paused) {
                setShowPoster(true);
            }
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [isCaseStudy]);

    const togglePlay = useCallback((e) => {
        if (!isCaseStudy) return;
        e.stopPropagation();

        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setIsPaused(false);
            } else {
                video.pause();
                setIsPaused(true);
            }
        }
    }, [isCaseStudy]);

    // Always maintain layoutId for smooth transitions
    // The layoutId must be consistent across states for Framer Motion to animate between them
    // Only disable layout animation when returning to home
    const shouldUseLayout = !isReturningToHome;

    // Critical: Keep layoutId for ALL projects when in grid view (not in case study mode)
    // AND for the selected project when in case study mode
    // This ensures Framer Motion can always find the element to animate from/to
    const shouldHaveLayoutId = !isReturningToHome && (
        !isCaseStudy || isSelected
    );

    return (
        <motion.div
            layout={shouldUseLayout}
            layoutId={shouldHaveLayoutId ? `project-${project.id}` : undefined}
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={false}
            animate={{ opacity: containerOpacity }}
            transition={transitionConfig}
            style={{
                willChange: (isTransitioning && isSelected) ? 'transform' :
                    (isTransitioning || isReturningToHome) ? 'opacity' : 'auto'
            }}
        >
            <motion.div
                className="top-data"
                animate={{ opacity: textOpacity }}
                transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
                <p>{project.title}</p>
                <p>{project.year}</p>
            </motion.div>
            <motion.p
                className="project-info"
                animate={{ opacity: textOpacity }}
                transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
                {project.description}
            </motion.p>
            <div className="media-container" onClick={togglePlay}>
                {/* Show poster image overlay when video is not playing to ensure it's visible */}
                {/* Fade out poster at start of transition for clean video animation */}
                {/* Show poster image overlay when video is not playing to ensure it's visible */}
                {/* Fade out poster at start of transition for clean video animation */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="project-poster"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: showPoster ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        pointerEvents: 'none',
                        zIndex: 2
                    }}
                />
                <video
                    ref={videoRef}
                    src={project.video}
                    poster={project.image}
                    loop
                    muted={!isCaseStudy || isTransitioning}
                    playsInline
                    preload="metadata"
                    className="project-video"
                    style={{
                        pointerEvents: isCaseStudy ? 'auto' : 'none',
                        opacity: isReturningToHome ? 0 : 1,
                        transition: 'none',
                        position: 'relative',
                        zIndex: 1
                    }}
                />
                {isCaseStudy && (
                    <div className="video-controls">
                        <div className={`icon ${isPaused ? 'play' : 'pause'}`}></div>
                    </div>
                )}
            </div>
            <motion.div
                className="bottom-data"
                animate={{ opacity: textOpacity }}
                transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
                <div className="project-scope">
                    <p>Scope</p>
                    <p>{project.scope}</p>
                </div>
                <p>Details</p>
            </motion.div>
        </motion.div>
    );
}

export default ProjectItem;
