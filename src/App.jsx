import { useEffect, useState } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import Header from './components/Header';
import Projects from './components/Projects';
import CustomCursor from './components/CustomCursor';
import MobileNotification from './components/MobileNotification';
import { projectsData } from './data/projects';
import './App.css';

function App() {
    const [headerHeight, setHeaderHeight] = useState(300);
    const [viewState, setViewState] = useState('GRID'); // 'GRID', 'CASE_STUDY'
    const [selectedProject, setSelectedProject] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [layoutGroupKey, setLayoutGroupKey] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const updateHeaderHeight = () => {
            const header = document.querySelector('header');
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }, [headerHeight]);

    // Sync URL with State
    useEffect(() => {
        const match = matchPath('/project/:slug', location.pathname);

        if (match) {
            const slug = match.params.slug;
            const project = projectsData.find(p => p.slug === slug);
            if (project) {
                setSelectedProject(project.id);
                if (viewState === 'GRID') {
                    setViewState('CASE_STUDY');
                    setIsTransitioning(false);
                }
            }
        } else if (location.pathname === '/') {
            if (viewState !== 'GRID') {
                setViewState('GRID');
                setSelectedProject(null);
                setIsTransitioning(false);
                setLayoutGroupKey(prev => prev + 1);
            }
        }
    }, [location.pathname]);

    const handleProjectSelect = (id) => {
        const project = projectsData.find(p => p.id === id);
        if (!project) return;

        setSelectedProject(id);
        setIsTransitioning(true);

        // Wait for fade out animation before navigating
        setTimeout(() => {
            navigate(`/project/${project.slug}`);
        }, 1000);
    };

    const handleBackToGrid = () => {
        navigate('/');
    };

    return (
        <>
            <CustomCursor />
            <MobileNotification />
            <Header isHidden={viewState !== 'GRID' || isTransitioning} />
            <Projects
                viewState={viewState}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
                isTransitioning={isTransitioning}
                layoutGroupKey={layoutGroupKey}
            />
        </>
    );
}

export default App;
