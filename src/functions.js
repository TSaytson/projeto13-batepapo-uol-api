export function verifyURL(url) {
    try {
        let testURL = new URL(url);
        return url;
    }
    catch (err) {
        console.log('URL inválida');
        return false;
    }
}