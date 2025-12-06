import React from 'react';

function CaseStudy({ project }) {
    if (!project) return null;

    return (
        <div className="case-study-content">
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
