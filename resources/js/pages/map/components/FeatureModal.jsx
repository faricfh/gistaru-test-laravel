import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * FeatureModal menampilkan detail fitur yang dipilih dari peta.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {string} props.title
 * @param {Array<{ label: string, value: string }>} props.details
 * @param {() => void} props.onClose
 * @returns {JSX.Element | null}
 */
export default function FeatureModal({ isOpen, title, details, onClose }) {
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="map-app__modal-backdrop" role="dialog" aria-modal="true" aria-label="Detail fitur terpilih">
            <div className="map-app__modal">
                <header className="map-app__modal-header">
                    <h2 className="map-app__modal-title">{title}</h2>
                    <button type="button" className="map-app__modal-close" onClick={onClose} aria-label="Tutup">
                        ×
                    </button>
                </header>
                <div className="map-app__modal-body">
                    {details.length === 0 ? (
                        <p className="map-app__modal-empty">Detail tidak tersedia.</p>
                    ) : (
                        <dl className="map-app__modal-list">
                            {details.map((entry) => (
                                <div key={entry.label} className="map-app__modal-list-item">
                                    <dt className="map-app__modal-term">{entry.label}</dt>
                                    <dd className="map-app__modal-definition">{entry.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
                <footer className="map-app__modal-footer">
                    <button type="button" className="map-app__modal-button" onClick={onClose}>
                        Tutup
                    </button>
                </footer>
            </div>
        </div>,
        document.body,
    );
}
