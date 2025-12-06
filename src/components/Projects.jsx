import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProjectItem from './ProjectItem';
import CaseStudy from './CaseStudy';
import { projectsData } from '../data/projects';

function Projects({ viewState, selectedProject, onProjectSelect, isTransitioning, isReturningToHome, layoutGroupKey, isMobile }) {
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [activeGridItem, setActiveGridItem] = useState(null);
    const [enableTransitions, setEnableTransitions] = useState(false);
    const projectsRef = useRef(null);


    useEffect(() => {
        // Reset active grid item when returning to grid view
        if (viewState === 'GRID') {
            setActiveGridItem(null);
        }
    }, [viewState]);

    useEffect(() => {
        if (viewState === 'GRID') {
            // Always enable transitions in grid view (except when actively returning home)
            // This ensures layoutIds are ready for smooth animations
            if (isReturningToHome) {
                setEnableTransitions(false);
                // Enable transitions after return animation completes
                const timer = setTimeout(() => {
                    setEnableTransitions(true);
                }, 1100); // Slightly after the 1000ms fade out
                return () => clearTimeout(timer);
            } else {
                // Add a small delay to ensure DOM has settled before enabling transitions
                // This prevents jumpy animations when switching between projects
                const timer = setTimeout(() => {
                    setEnableTransitions(true);
                }, 50);
                return () => clearTimeout(timer);
            }
        } else {
            // In case study mode, disable grid transitions but keep layout animations active
            setEnableTransitions(false);
        }
    }, [viewState, isReturningToHome]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (viewState === 'GRID' && projectsRef.current && !projectsRef.current.contains(event.target)) {
                setActiveGridItem(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [viewState]);

    const handleItemHover = useCallback((index) => {
        if (!isMobile && viewState === 'GRID') {
            setHoveredItem(index);
        }
    }, [isMobile, viewState]);

    const handleItemLeave = useCallback(() => {
        setHoveredItem(null);
    }, []);

    const handleItemClick = useCallback((index, projectId) => {
        if (viewState !== 'GRID') return;

        if (isMobile) {
            onProjectSelect(projectId);
            return;
        }

        if (activeGridItem === index) {
            onProjectSelect(projectId);
        } else {
            setActiveGridItem(index);
        }
    }, [viewState, isMobile, activeGridItem, onProjectSelect]);

    const getItemClasses = useCallback((index, project) => {
        const classes = ['project-item'];

        if (viewState === 'GRID') {
            classes.push('inactive');
            if (hoveredItem !== null && hoveredItem !== index) {
                classes.push('fade-text');
            }
            if (activeGridItem === index || selectedProject === project.id) {
                classes.push('active');
            }
        } else if (viewState === 'CASE_STUDY') {
            if (selectedProject === project.id) {
                classes.push('case-study-active');
            } else {
                classes.push('hidden');
            }
        }

        return classes.join(' ');
    }, [viewState, hoveredItem, activeGridItem, selectedProject]);

    const gridStyles = useMemo(() => {
        if (viewState === 'CASE_STUDY' || activeGridItem === null) return {};

        const colIndex = activeGridItem % 3;
        const rowIndex = Math.floor(activeGridItem / 3);

        let gridTemplateColumns = '1fr 1fr 1fr';
        let gridTemplateRows = '1fr 1fr';

        if (colIndex === 0) gridTemplateColumns = '2fr 1fr 1fr';
        else if (colIndex === 1) gridTemplateColumns = '1fr 2fr 1fr';
        else if (colIndex === 2) gridTemplateColumns = '1fr 1fr 2fr';

        if (rowIndex === 0) gridTemplateRows = '2fr 1fr';
        else if (rowIndex === 1) gridTemplateRows = '1fr 2fr';

        return { gridTemplateColumns, gridTemplateRows };
    }, [viewState, activeGridItem]);

    const selectedProjectData = useMemo(() => {
        return viewState === 'CASE_STUDY' ? projectsData.find(p => p.id === selectedProject) : null;
    }, [viewState, selectedProject]);

    return (
        <LayoutGroup id={`projects-${layoutGroupKey}`}>
            <div
                className={`projects ${viewState === 'CASE_STUDY' ? 'case-study-mode' : ''} ${isTransitioning ? 'transitioning-mode' : ''} ${enableTransitions ? 'enable-transitions' : ''}`}
                style={gridStyles}
                ref={projectsRef}
            >
                {projectsData.map((project, index) => (
                    <ProjectItem
                        key={`${project.id}-${layoutGroupKey}${isMobile && viewState === 'CASE_STUDY' ? '-mobile-case' : ''}`}
                        project={project}
                        className={getItemClasses(index, project)}
                        onMouseEnter={() => handleItemHover(index)}
                        onMouseLeave={handleItemLeave}
                        onClick={() => handleItemClick(index, project.id)}
                        isPlaying={(hoveredItem === index || activeGridItem === index || selectedProject === project.id) && !isReturningToHome}
                        isCaseStudy={viewState === 'CASE_STUDY'}
                        isSelected={selectedProject === project.id}
                        isTransitioning={isTransitioning}
                        isReturningToHome={isReturningToHome}
                        isMobile={isMobile}
                    />
                ))}
                {selectedProjectData && (
                    <>
                        <motion.button
                            className="back-button"
                            onClick={() => navigate('/')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: (isTransitioning || isReturningToHome) ? 0 : 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1,
                                ease: [0.43, 0.13, 0.23, 0.96],
                                delay: (isTransitioning || isReturningToHome) ? 0 : 0.4
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Projects
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: (isTransitioning || isReturningToHome) ? 0 : 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1,
                                ease: [0.43, 0.13, 0.23, 0.96],
                                delay: (isTransitioning || isReturningToHome) ? 0 : 0.4
                            }}
                            style={{
                                willChange: (isTransitioning || isReturningToHome) ? 'opacity' : 'auto'
                            }}
                        >
                            <CaseStudy project={selectedProjectData} />
                        </motion.div>
                    </>
                )}
            </div>
        </LayoutGroup>
    );
}

export default Projects;
