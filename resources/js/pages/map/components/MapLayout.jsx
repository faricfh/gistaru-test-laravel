/**
 * MapLayout memisahkan struktur layout agar lebih mudah digunakan ulang
 * dan menjaga komponen halaman tetap fokus pada logika peta.
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
    return (
        <div className="map-app">
            <aside className="map-app__sidebar">
                <header className="map-app__sidebar-header">
                    <h1 className="map-app__title">{title}</h1>
                    {description && <p className="map-app__subtitle">{description}</p>}
                </header>
                <div className="map-app__sidebar-body">{sidebar}</div>
            </aside>

            <main className="map-app__map">
                <div className="map-app__map-canvas" ref={mapContainerRef} />
                {children}
            </main>
        </div>
    );
}
