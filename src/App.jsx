import { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Projects from './components/Projects';
import CustomCursor from './components/CustomCursor';
import MobileNotification from './components/MobileNotification';
import { projectsData } from './data/projects';
import './App.css';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial state based on URL
    const initialMatch = matchPath('/projects/:slug', location.pathname);
    const initialProject = initialMatch
        ? projectsData.find(p => p.slug === initialMatch.params.slug)
        : null;

    const [headerHeight, setHeaderHeight] = useState(300);
    const [viewState, setViewState] = useState(initialProject ? 'CASE_STUDY' : 'GRID');
    const [selectedProject, setSelectedProject] = useState(initialProject ? initialProject.id : null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isReturningToHome, setIsReturningToHome] = useState(false);
    const [layoutGroupKey, setLayoutGroupKey] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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




                if (viewState === 'GRID') {
                    // Transitioning from grid to case study
                    setViewState('CASE_STUDY');
                    setIsTransitioning(true);
                    // Wait for layout animation to complete
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, isMobile ? 1000 : 1100); // Shorter timeout for mobile slide transition
                } else if (isSwitchingProjects) {
                    // Switching between projects - trigger transition
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setIsTransitioning(false);
                    }, 1100);
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
    }, [location.pathname, viewState, selectedProject, isMobile]);

    // Scroll to top when switching to case study view to ensure transition starts from correct position
    useLayoutEffect(() => {
        if (viewState === 'CASE_STUDY') {
            window.scrollTo(0, 0);
        }
    }, [viewState, selectedProject]);

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
                // Faster navigation on mobile for snappier feel
                setTimeout(() => {
                    navigate(`/projects/${project.slug}`);
                }, isMobile ? 10 : 600);
            });
        });
    }, [navigate, isTransitioning, isMobile]);

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
                isMobile={isMobile}
            />
        </>
    );
}

export default App;
