import { useMemo, useState } from 'react';

const MENU_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'layer', label: 'Layer' },
    { id: 'baseMap', label: 'Base Map' },
];

function Icon({ name }) {
    if (name === 'home') {
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M11.3 3.25a1 1 0 0 1 1.4 0l7.5 7.5a1 1 0 0 1-1.4 1.42L18 11.77V19a1 1 0 0 1-1 1h-3.75a.25.25 0 0 1-.25-.25V15a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v4.75a.25.25 0 0 1-.25.25H5a1 1 0 0 1-1-1v-7.23l-.8.8A1 1 0 0 1 1.8 10.7z"
                />
            </svg>
        );
    }

    if (name === 'layer') {
        return (
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M3.2 9.63a1 1 0 0 1 .37-1.36l7.97-4.6a1 1 0 0 1 .92 0l7.97 4.6a1 1 0 0 1 0 1.72l-7.97 4.6a1 1 0 0 1-.92 0l-7.97-4.6a1 1 0 0 1-.37-1.36Zm0 4.74a1 1 0 0 1 1.36-.37l6.9 3.98a1 1 0 0 0 .92 0l6.9-3.98a1 1 0 0 1 .99 1.73l-7.97 4.6a1 1 0 0 1-.92 0l-7.97-4.6a1 1 0 0 1-.37-1.36Zm0 4.74a1 1 0 0 1 1.36-.37l6.9 3.98a1 1 0 0 0 .92 0l6.9-3.98a1 1 0 0 1 .99 1.73l-7.97 4.6a1 1 0 0 1-.92 0l-7.97-4.6a1 1 0 0 1-.37-1.36Z"
                />
            </svg>
        );
    }

    return (
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M12 2a1 1 0 0 1 .92.62l1.34 3.08l3.36-.27a1 1 0 0 1 .82 1.57l-2.11 2.75l1.57 3.01a1 1 0 0 1-1.09 1.43l-3.19-.72l-2.5 2.34a1 1 0 0 1-1.36 0L7.76 13.5l-3.19.7a1 1 0 0 1-1.08-1.42l1.57-3L3 7a1 1 0 0 1 .83-1.57l3.36.27L8.53 2.6A1 1 0 0 1 9.5 2z"
            />
        </svg>
    );
}

/**
 * MapLayout menampilkan sidebar ikon dan panel konten peta.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {import('react').ReactNode} props.sidebar
 * @param {import('react').MutableRefObject<HTMLDivElement | null>} props.mapContainerRef
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export default function MapLayout({ title, description, sidebar, mapContainerRef, children }) {
    const [activePanel, setActivePanel] = useState(null);

    const menuItems = useMemo(
        () =>
            MENU_ITEMS.map((item) => ({
                ...item,
                isActive: activePanel === item.id,
                isDisabled: item.id === 'baseMap',
            })),
        [activePanel],
    );

    const handleMenuClick = (itemId) => {
        if (itemId === 'home') {
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
            return;
        }

        if (itemId === 'layer') {
            setActivePanel((current) => (current === 'layer' ? null : 'layer'));
            return;
        }
    };

    const closePanel = () => setActivePanel(null);
    const isPanelOpen = activePanel === 'layer';

    return (
        <div className="map-app">
            <aside className="map-app__sidebar">
                <nav className="map-app__sidebar-icons" aria-label="Navigasi peta">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`map-app__sidebar-button${
                                item.isActive ? ' map-app__sidebar-button--active' : ''
                            }`}
                            onClick={() => handleMenuClick(item.id)}
                            disabled={item.isDisabled}
                            aria-pressed={item.isActive}
                            aria-label={item.label}
                        >
                            <span className="map-app__sidebar-icon">
                                <Icon name={item.id === 'baseMap' ? 'baseMap' : item.id} />
                            </span>
                            <span className="map-app__sidebar-text">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div
                    className={`map-app__sidebar-panel${isPanelOpen ? ' map-app__sidebar-panel--open' : ''}`}
                    aria-hidden={!isPanelOpen}
                >
                    <div className="map-app__sidebar-panel-header">
                        <div className="map-app__sidebar-header-text">
                            <h1 className="map-app__title">{title}</h1>
                            {description && <p className="map-app__subtitle">{description}</p>}
                        </div>
                        <button type="button" className="map-app__sidebar-close" onClick={closePanel} aria-label="Tutup">
                            x
                        </button>
                    </div>
                    <div className="map-app__sidebar-panel-body">{isPanelOpen ? sidebar : null}</div>
                </div>
            </aside>

            <main className="map-app__map">
                <div className="map-app__map-canvas" ref={mapContainerRef} />
                {children}
            </main>
        </div>
    );
}
