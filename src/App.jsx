import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Projects from './components/Projects';
import CustomCursor from './components/CustomCursor';
import MobileNotification from './components/MobileNotification';
import { projectsData } from './data/projects';
import './App.css';

function App() {
    const [headerHeight, setHeaderHeight] = useState(300);
    const [viewState, setViewState] = useState('GRID');
    const [selectedProject, setSelectedProject] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isReturningToHome, setIsReturningToHome] = useState(false);
    const [layoutGroupKey, setLayoutGroupKey] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const updateHeaderHeight = () => {
            const header = document.querySelector('header');
            if (header) {
                const height = header.offsetHeight;
                setHeaderHeight(height);
                document.documentElement.style.setProperty('--header-height', `${height}px`);
            }
        };

        updateHeaderHeight();
        const resizeObserver = new ResizeObserver(updateHeaderHeight);
        const header = document.querySelector('header');
        if (header) {
            resizeObserver.observe(header);
        }
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, []);

    // Sync URL with State
    useEffect(() => {
        const match = matchPath('/projects/:slug', location.pathname);

        if (match) {
            const slug = match.params.slug;
            const project = projectsData.find(p => p.slug === slug);
            if (project && (selectedProject !== project.id || viewState === 'GRID')) {
                const isSwitchingProjects = viewState === 'CASE_STUDY' && selectedProject !== project.id;

                setSelectedProject(project.id);
                setIsReturningToHome(false);

                // Scroll to top when navigating to a project page
                window.scrollTo(0, 0);

                if (viewState === 'GRID') {
                    // Transitioning from grid to case study
                    setViewState('CASE_STUDY');
                    setIsTransitioning(true);
                    // Wait for layout animation to complete
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 1500);
                } else if (isSwitchingProjects) {
                    // Switching between projects - trigger transition
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 1500);
                } else {
                    // Already on this project, just ensure transition is complete
                    setIsTransitioning(false);
                }
            }
        } else if (location.pathname === '/') {
            if (viewState !== 'GRID') {
                // First, fade out all content
                setIsReturningToHome(true);
                setIsTransitioning(true);

                // After fade out completes, reset to default state
                setTimeout(() => {
                    setViewState('GRID');
                    setSelectedProject(null);
                    setIsTransitioning(false);
                    // Reset returning state after a brief moment to ensure clean render
                    setTimeout(() => {
                        setIsReturningToHome(false);
                    }, 100);
                }, 1000);
            }
        }
    }, [location.pathname, viewState, selectedProject]);

    const handleProjectSelect = useCallback((id) => {
        const project = projectsData.find(p => p.id === id);
        if (!project) return;

        // If we're already transitioning, don't start a new transition
        if (isTransitioning) return;

        // Set selected project first to establish layoutId
        setSelectedProject(id);
        setIsReturningToHome(false);

        // Use requestAnimationFrame to ensure layoutId is set before transition starts
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsTransitioning(true);

                // Wait for fade out animation before navigating
                setTimeout(() => {
                    navigate(`/projects/${project.slug}`);
                }, 600);
            });
        });
    }, [navigate, isTransitioning]);

    return (
        <>
            <CustomCursor />
            <MobileNotification />
            <Header isHidden={viewState !== 'GRID' || isTransitioning || isReturningToHome} />
            <Projects
                viewState={viewState}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
                isTransitioning={isTransitioning}
                isReturningToHome={isReturningToHome}
                layoutGroupKey={layoutGroupKey}
            />
        </>
    );
}

export default App;
