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
    const [viewState, setViewState] = useState('GRID'); // 'GRID', 'TRANSITIONING', 'EXPANDING', 'CASE_STUDY'
    const [selectedProject, setSelectedProject] = useState(null);

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
                // If we are already in CASE_STUDY or EXPANDING, don't reset to CASE_STUDY immediately to avoid breaking animation
                // But if we are loading directly or navigating back/forward, we should set it.
                // We can check if viewState is GRID to decide if we need to jump.
                if (viewState === 'GRID') {
                    setViewState('CASE_STUDY');
                }
            }
        } else if (location.pathname === '/') {
            if (viewState !== 'GRID') {
                setViewState('GRID');
                setSelectedProject(null);
            }
        }
    }, [location.pathname]);

    const handleProjectSelect = (id) => {
        const project = projectsData.find(p => p.id === id);
        if (!project) return;

        setSelectedProject(id);

        if (window.innerWidth <= 1024) {
            setViewState('CASE_STUDY');
            navigate(`/project/${project.slug}`);
            return;
        }

        setViewState('TRANSITIONING');
        setTimeout(() => {
            setViewState('EXPANDING');
        }, 1000);
        setTimeout(() => {
            setViewState('CASE_STUDY');
            navigate(`/project/${project.slug}`);
        }, 2200);
    };

    const handleBackToGrid = () => {
        navigate('/');
    };

    return (
        <>
            <CustomCursor />
            <MobileNotification />
            <Header isHidden={viewState !== 'GRID'} />
            <Projects
                viewState={viewState}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
            />
        </>
    );
}

export default App;
