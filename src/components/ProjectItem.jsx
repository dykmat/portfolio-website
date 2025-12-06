import { useEffect, useRef, useState } from 'react';

function ProjectItem({ project, className, onClick, onMouseEnter, onMouseLeave, isPlaying, isCaseStudy, style }) {
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

    return (
        <div
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={style}
        >
            <div className="top-data">
                <p>{project.title}</p>
                <p>{project.year}</p>
            </div>
            <p className="project-info">{project.description}</p>
            <div className="media-container" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={project.video}
                    poster={project.image}
                    loop
                    muted={!isCaseStudy} // Unmute in case study? User didn't specify, but usually yes. Let's keep muted for now or unmute if requested.
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
            <div className="bottom-data">
                <div className="project-scope">
                    <p>Scope</p>
                    <p>{project.scope}</p>
                </div>
                <p>Details</p>
            </div>
        </div>
    );
}

export default ProjectItem;
