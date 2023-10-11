const serverUrl = import.meta.env.VITE_SERVER_URL;


/**
 *
 * @returns string
 * @param code
 * @param args
 * @param lang
 */
export function codeCompile(code: string, args: string, lang: string) {
    return fetch(`${serverUrl}/code/compile`, {
        method: 'POST',
        body: JSON.stringify({ code, args, lang }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }).then((res) => res.json());
}