export async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

export function extractAppearance(str) {
    let fontMatch = str.match(/\/(\w+)\s/);
    let sizeMatch = str.match(/(\d+(\.\d+)?)\sTf/);
    let colorMatch = str.match(
        /(\d+(\.\d+)?)\s(\d+(\.\d+)?)\s(\d+(\.\d+)?)\srg|(\d+(\.\d+)?)\sg/
    );

    let font = fontMatch ? fontMatch[1] : null;
    let fontSize = sizeMatch ? parseFloat(sizeMatch[1]) : null;
    let color = colorMatch
        ? colorMatch[7]
            ? [
                parseFloat(colorMatch[7]),
                parseFloat(colorMatch[7]),
                parseFloat(colorMatch[7]),
            ]
            : [
                parseFloat(colorMatch[1]),
                parseFloat(colorMatch[3]),
                parseFloat(colorMatch[5]),
            ]
        : null;

    // right now only black or white

    var fontColor = (
        color.toString() === '1,1,1'
        ? 'white'
        : 'black'
    )

    var fontWeight = (
        font === 'HeBo' || font === 'F2'
        ? 'bold'
        : 'normal'
    )

    return { 
        fontWeight, 
        fontSize, 
        fontColor,
    };
}
