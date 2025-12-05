import { useEffect, useState } from 'react';
import Header from './components/Header';
import Projects from './components/Projects';
import CustomCursor from './components/CustomCursor';
import MobileNotification from './components/MobileNotification';
import './App.css';

function App() {
    const [headerHeight, setHeaderHeight] = useState(300);

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

    return (
        <>
            <CustomCursor />
            <MobileNotification />
            <Header />
            <Projects />
        </>
    );
}

export default App;
