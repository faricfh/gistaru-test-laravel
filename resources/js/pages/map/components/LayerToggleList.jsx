/**
 * LayerToggleList merender daftar checkbox untuk mengatur visibilitas layer peta.
 *
 * @param {object} props
 * @param {Array<{
 *   id: string,
 *   label: string,
 *   checked: boolean,
 *   disabled?: boolean,
 *   helperText?: string,
 *   status?: 'idle' | 'loading' | 'error',
 *   error?: string
 * }>} props.items
 * @param {(layerId: string) => void} props.onToggle
 * @returns {JSX.Element}
 */
export default function LayerToggleList({ items, onToggle }) {
    return (
        <section aria-label="Pengaturan layer peta" className="map-app__layer-group">
            {items.map((item) => {
                const { id, label, checked, disabled, helperText, status, error } = item;
                let hint = helperText;

                if (status === 'loading') {
                    hint = 'Sedang memuat data…';
                } else if (status === 'error') {
                    hint = error || 'Gagal memuat data layer.';
                }

                return (
                    <label key={id} className="map-app__layer-item">
                        <input
                            type="checkbox"
                            className="map-app__layer-checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => onToggle(id)}
                        />
                        <div className="map-app__layer-text">
                            <span className="map-app__layer-label">{label}</span>
                            {hint && (
                                <span
                                    className={`map-app__layer-hint${
                                        status === 'error' ? ' map-app__layer-hint--error' : ''
                                    }`}
                                >
                                    {hint}
                                </span>
                            )}
                        </div>
                    </label>
            );
        })}
        </section>
    );
}
