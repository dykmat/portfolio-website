import { useState, useEffect, useRef } from 'react';
import ProjectItem from './ProjectItem';
import CaseStudy from './CaseStudy';
import { projectsData } from '../data/projects';

function Projects({ viewState, selectedProject, onProjectSelect }) {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [activeGridItem, setActiveGridItem] = useState(null);
    const [transitionStyle, setTransitionStyle] = useState({});
    const projectsRef = useRef(null);

    // We don't need local activeItem state anymore if we use selectedProject from props
    // But for the "Expand" effect during TRANSITIONING, we can use selectedProject.

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

    useEffect(() => {
        if (viewState === 'EXPANDING') {
            setTransitionStyle(prev => ({
                ...prev,
                top: 0,
                left: 0,
                width: '100vw',
                height: '50vh',
                padding: 0
            }));
        } else if (viewState === 'CASE_STUDY') {
            // Reset style for static layout, or keep it if needed?
            // In CASE_STUDY, CSS handles the layout. We should clear inline styles to let CSS take over.
            setTransitionStyle({});
        }
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
            // Capture rect for transition
            const rect = e.currentTarget.getBoundingClientRect();
            setTransitionStyle({
                position: 'fixed',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                zIndex: 1000,
                transition: 'all 1s ease',
                margin: 0
            });
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
        } else if (viewState === 'TRANSITIONING' || viewState === 'EXPANDING') {
            if (selectedProject === project.id) {
                classes.push('active');
            } else {
                classes.push('fading-out');
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
        // If Case Study, we override grid styles in CSS or here
        if (viewState === 'CASE_STUDY') return {};

        // Use activeGridItem for grid layout in GRID mode
        // If transitioning, we might want to keep the layout of the selected project
        // But selectedProject is an ID, activeGridItem is an index.
        // Let's rely on activeGridItem if in GRID mode.
        // If transitioning, we should probably keep the same layout.

        let targetIndex = activeGridItem;

        if ((viewState === 'TRANSITIONING' || viewState === 'EXPANDING') && selectedProject !== null) {
            targetIndex = projectsData.findIndex(p => p.id === selectedProject);
        }

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
        <div
            className={`projects ${viewState === 'CASE_STUDY' ? 'case-study-mode' : ''} ${viewState === 'TRANSITIONING' || viewState === 'EXPANDING' ? 'transitioning-mode' : ''}`}
            style={getGridStyles()}
            ref={projectsRef}
        >
            {projectsData.map((project, index) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    className={getItemClasses(index, project)}
                    onMouseEnter={() => handleItemHover(index)}
                    onMouseLeave={handleItemLeave}
                    onClick={(e) => handleItemClick(index, project.id, e)}
                    isPlaying={hoveredItem === index || activeGridItem === index || selectedProject === project.id}
                    isCaseStudy={viewState === 'CASE_STUDY'}
                    style={selectedProject === project.id ? transitionStyle : {}}
                />
            ))}
            {viewState === 'CASE_STUDY' && (
                <CaseStudy project={projectsData.find(p => p.id === selectedProject)} />
            )}
        </div>
    );
}

export default Projects;
