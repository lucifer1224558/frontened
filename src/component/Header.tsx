import './header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        className="search-input"
                    />
                </div>
                <div className="header-actions">
                    <button className="icon-button">
                        <span>🔔</span>
                    </button>
                    <button className="icon-button">
                        <span>💬</span>
                    </button>
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        Online
                    </div>
                </div>
            </div>
        </header>
    );
}
