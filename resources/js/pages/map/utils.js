/**
 * Format angka dengan locale Indonesia dan menambahkan sufiks bila perlu.
 *
 * @param {number | string | null | undefined} value
 * @param {string} suffix
 * @returns {string}
 */
export function formatNumber(value, suffix = '') {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return '';
    }

    const formatted = Number(value).toLocaleString('id-ID');
    return `${formatted}${suffix}`;
}
