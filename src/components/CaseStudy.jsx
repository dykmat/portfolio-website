import { useNavigate } from 'react-router-dom';

function CaseStudy({ project }) {
    const navigate = useNavigate();

    if (!project) return null;

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="case-study-content">
            <button className="back-button" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Projects
            </button>
            <div className="case-study-details">
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="meta">
                    <p><strong>Year:</strong> {project.year}</p>
                    <p><strong>Scope:</strong> {project.scope}</p>
                </div>
                {/* Placeholder for more content */}
                <div className="content-placeholder">
                    <p>More project details, images, and process would go here.</p>
                    <div style={{ height: '500px', background: '#e0e0e0', marginTop: '20px' }}></div>
                </div>
            </div>
        </div>
    );
}

export default CaseStudy;
