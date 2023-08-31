/** Replace all HTML characters with their escape values. */
export function sanitizeHtml(text: string): string {
    return text
        .split('')
        .map((char) => {
            if (char === '<') return '&lt;';
            else if (char === '>') return '&gt;';
            else if (char === '&') return '&amp;';
            else if (char === '"') return '&quot;';
            else if (char === "'") return '&#39;';
            else if (char === '`') return '&#96;';
            else if (char === '\n') return '<br />';
            else if (char === '\r') return '<br />';
            else if (char === '\t') return '&nbsp;&nbsp;&nbsp;&nbsp;';
            else if (char === '\b') return '&nbsp;&nbsp;&nbsp;';
            else if (char === '\f') return '&nbsp;';
            else if (char === '\v') return '&nbsp;&nbsp;';
            else if (char === '\u00A0') return '&nbsp;';
            else if (char === '\u2028') return '&nbsp;';
            else if (char === '\u2029') return '&nbsp;';
            else return char;
        })
        .join('');
}

/** Split a string into array of characters and HTML tags. */
export function splitHtml(text: string): string[] {
    let parsed: string[] = [];
    while (text.length > 0) {
        if (text[0] === '<') {
            let endIdx = text.indexOf('>', 1);
            parsed.push(text.slice(0, endIdx + 1));
            text = text.slice(endIdx + 1);
        } else {
            parsed.push(text[0]);
            text = text.slice(1);
        }
    }
    return parsed;
}
