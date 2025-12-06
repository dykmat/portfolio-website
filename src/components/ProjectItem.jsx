import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function ProjectItem({ project, className, onClick, onMouseEnter, onMouseLeave, isPlaying, isCaseStudy, style, isSelected, isTransitioning }) {
    const videoRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying && !isPaused) {
                if (window.innerWidth <= 1024 && isCaseStudy) {
                    setIsPaused(true);
                } else {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('Autoplay prevented:', error);
                        });
                    }
                }
            } else if (!isPlaying) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                videoRef.current.load();
            }
        }
    }, [isPlaying]);

    const togglePlay = (e) => {
        if (!isCaseStudy) return;
        e.stopPropagation();

        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const containerOpacity = () => {
        if (isTransitioning) {
            if (isCaseStudy) return 0; // Leaving Case Study
            if (!isSelected) return 0; // Leaving Grid, non-selected
        }
        return 1;
    };

    const textOpacity = () => {
        if (isTransitioning && isSelected && !isCaseStudy) return 0;
        return 1;
    };

    return (
        <motion.div
            layoutId={isCaseStudy && isTransitioning ? undefined : `project-${project.id}`}
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={style}
            initial={{ opacity: 0 }}
            animate={{ opacity: containerOpacity() }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
            <motion.div
                className="top-data"
                animate={{ opacity: textOpacity() }}
                transition={{ duration: 1 }}
            >
                <p>{project.title}</p>
                <p>{project.year}</p>
            </motion.div>
            <motion.p
                className="project-info"
                animate={{ opacity: textOpacity() }}
                transition={{ duration: 1 }}
            >
                {project.description}
            </motion.p>
            <div className="media-container" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={project.video}
                    poster={project.image}
                    loop
                    muted={!isCaseStudy}
                    playsInline
                    className="project-video"
                    style={{ pointerEvents: isCaseStudy ? 'auto' : 'none' }}
                />
                {isCaseStudy && (
                    <div className="video-controls">
                        <div className={`icon ${isPaused ? 'play' : 'pause'}`}></div>
                    </div>
                )}
            </div>
            <motion.div
                className="bottom-data"
                animate={{ opacity: textOpacity() }}
                transition={{ duration: 1 }}
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
