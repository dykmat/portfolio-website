import { useEffect, useRef } from 'react';

function ProjectItem({ project, className, onClick, onMouseEnter, onMouseLeave, isPlaying }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Auto-play was prevented
                        console.log('Autoplay prevented:', error);
                    });
                }
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                // Reloading ensures the first frame is shown if currentTime=0 doesn't update immediately
                // However, load() might cause a flash. Let's try just currentTime = 0 first.
                // If the user says "image isn't visible once again", it implies currentTime=0 isn't working well.
                // Let's try videoRef.current.load() which resets the element.
                videoRef.current.load();
            }
        }
    }, [isPlaying]);

    return (
        <div
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="top-data">
                <p>{project.title}</p>
                <p>{project.year}</p>
            </div>
            <p className="project-info">{project.description}</p>
            <div className="media-container">
                <video
                    ref={videoRef}
                    src={project.video}
                    poster={project.image}
                    loop
                    muted
                    playsInline
                    className="project-video"
                    style={{ pointerEvents: 'none' }}
                />
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
