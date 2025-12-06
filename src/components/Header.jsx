import { useCallback } from 'react';

function Header({ isHidden }) {
    const handleCopyEmail = useCallback(async () => {
        const email = 'contact@dykmat.com';

        try {
            await navigator.clipboard.writeText(email);

            const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

            if (isTouchDevice) {
                const notification = document.getElementById('mobileNotification');
                if (notification) {
                    notification.classList.add('show');
                    setTimeout(() => {
                        notification.classList.remove('show');
                    }, 2000);
                }
            } else {
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) {
                    cursor.classList.remove('hovering');
                    cursor.classList.add('copied');
                    setTimeout(() => {
                        cursor.classList.remove('copied');
                    }, 2000);
                }
            }
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    }, []);

    return (
        <header className={isHidden ? 'fade-out' : ''}>
            <div className="profile">
                <div className="profile-container">
                    <div className="info">
                        <img src="/media/profile.png" alt="Dykmat" width="40" height="40" />
                        <p>Mateusz Dykiel</p>
                    </div>
                    <div className="title">
                        <p>Technical Product & Experience Designer</p>
                    </div>
                </div>
                <hr />
            </div>
            <h1>
                Leveraging generalist mindset to craft experiences at the crossroads of design, technology, and video.
            </h1>
            <button id="copyEmailBtn" onClick={handleCopyEmail}>
                <img src="/media/copy-icon.svg" alt="Copy" />
                contact@dykmat.com
            </button>
        </header>
    );
}

export default Header;
