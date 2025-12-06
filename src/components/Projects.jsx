import { useState, useEffect, useRef } from 'react';
import { LayoutGroup, AnimatePresence, motion } from 'framer-motion';
import ProjectItem from './ProjectItem';
import CaseStudy from './CaseStudy';
import { projectsData } from '../data/projects';

function Projects({ viewState, selectedProject, onProjectSelect, isTransitioning, layoutGroupKey }) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [activeGridItem, setActiveGridItem] = useState(null);
    const projectsRef = useRef(null);

    useEffect(() => {
        setActiveGridItem(null);
    }, [layoutGroupKey]);

    const [enableTransitions, setEnableTransitions] = useState(false);

    useEffect(() => {
        if (viewState === 'GRID') {
            setEnableTransitions(false);
            const timer = setTimeout(() => setEnableTransitions(true), 100);
            return () => clearTimeout(timer);
        }
    }, [viewState]);

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

    const handleItemHover = (index) => {
        if (window.innerWidth > 1024 && viewState === 'GRID') {
            setHoveredItem(index);
        }
    };

    const handleItemLeave = () => {
        setHoveredItem(null);
    };

    const handleItemClick = (index, projectId, e) => {
        if (viewState !== 'GRID') return;

        if (window.innerWidth <= 1024) {
            onProjectSelect(projectId);
            return;
        }

        if (activeGridItem === index) {
            onProjectSelect(projectId);
        } else {
            setActiveGridItem(index);
        }
    };

    const getItemClasses = (index, project) => {
        const classes = ['project-item'];

        if (viewState === 'GRID') {
            classes.push('inactive');
            if (hoveredItem !== null && hoveredItem !== index) {
                classes.push('fade-text');
            }
            if (activeGridItem === index) {
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
    };

    const getGridStyles = () => {
        if (viewState === 'CASE_STUDY') return {};

        let targetIndex = activeGridItem;

        if (targetIndex === null) return {};

        const colIndex = targetIndex % 3;
        const rowIndex = Math.floor(targetIndex / 3);

        let gridTemplateColumns = '1fr 1fr 1fr';
        let gridTemplateRows = '1fr 1fr';

        if (colIndex === 0) gridTemplateColumns = '2fr 1fr 1fr';
        else if (colIndex === 1) gridTemplateColumns = '1fr 2fr 1fr';
        else if (colIndex === 2) gridTemplateColumns = '1fr 1fr 2fr';

        if (rowIndex === 0) gridTemplateRows = '2fr 1fr';
        else if (rowIndex === 1) gridTemplateRows = '1fr 2fr';

        return { gridTemplateColumns, gridTemplateRows };
    };

    return (
        <LayoutGroup id={`projects-${layoutGroupKey}`}>
            <div
                className={`projects ${viewState === 'CASE_STUDY' ? 'case-study-mode' : ''} ${isTransitioning ? 'transitioning-mode' : ''} ${enableTransitions ? 'enable-transitions' : ''}`}
                style={getGridStyles()}
                ref={projectsRef}
            >
                {projectsData.map((project, index) => (
                    <ProjectItem
                        key={`${project.id}-${layoutGroupKey}`}
                        project={project}
                        className={getItemClasses(index, project)}
                        onMouseEnter={() => handleItemHover(index)}
                        onMouseLeave={handleItemLeave}
                        onClick={(e) => handleItemClick(index, project.id, e)}
                        isPlaying={hoveredItem === index || activeGridItem === index || selectedProject === project.id}
                        isCaseStudy={viewState === 'CASE_STUDY'}
                        isSelected={selectedProject === project.id}
                        isTransitioning={isTransitioning}
                    />
                ))}
                {viewState === 'CASE_STUDY' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isTransitioning ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <CaseStudy project={projectsData.find(p => p.id === selectedProject)} />
                    </motion.div>
                )}
            </div>
        </LayoutGroup>
    );
}

export default Projects;
