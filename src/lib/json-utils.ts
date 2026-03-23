export const applyFilter = (data: any, path: string): any => {
    if (!path || path === 'root') return data;

    const cleanPath = path.replace(/^root\.?/, '');
    if (!cleanPath) return data;

    // Split path into segments while respecting braces and brackets
    const segments: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < cleanPath.length; i++) {
        const char = cleanPath[i];
        if (char === '{' || char === '[') depth++;
        if (char === '}' || char === ']') depth--;

        if (char === '.' && depth === 0) {
            if (current) segments.push(current);
            current = '';
        } else if (char === '[' && depth === 1 && current !== '') {
            segments.push(current);
            current = '[';
        } else {
            current += char;
        }
    }
    if (current) segments.push(current);

    let result = data;

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        if (segment.startsWith('[') && segment.endsWith(']')) {
            const content = segment.slice(1, -1);
            if (content === '*') {
                if (!Array.isArray(result)) return undefined;
                const remainingPath = segments.slice(i + 1).join('.');
                return applyFilter(result.map(item => applyFilter(item, remainingPath)).filter(val => val !== undefined), '');
            } else {
                const idx = parseInt(content);
                if (!Array.isArray(result) || isNaN(idx)) return undefined;
                result = result[idx];
            }
        } else if (segment.startsWith('{') && segment.endsWith('}')) {
            const keys = segment.slice(1, -1).split(',').map(k => k.trim());
            if (result === null || typeof result !== 'object' || Array.isArray(result)) return undefined;

            const projection: any = {};
            keys.forEach(key => {
                if (key in result) projection[key] = result[key];
            });
            result = projection;
        } else {
            if (result === null || typeof result !== 'object' || Array.isArray(result)) return undefined;
            result = result[segment];
        }
    }

    return result;
};
