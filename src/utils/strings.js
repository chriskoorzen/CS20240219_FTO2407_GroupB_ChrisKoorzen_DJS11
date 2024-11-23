

export function sanitizeHtmlLiterals(string){
    /**
     * Matching all HTML escape sequences:
     * 
     *      &                           Matches the initial ampersand indicating the start of an escape sequence.
     * 
     *      (?:...)                     A non-capturing group to include three possible formats:
     * 
     *          [a-zA-Z][a-zA-Z0-9]*    Matches named entities, starting with a letter
     *                                  and followed by alphanumeric characters.
     * 
     *          #[0-9]+                 Matches numeric entities in decimal format, starting
     *                                  with # and followed by digits.
     * 
     *          #x[0-9a-fA-F]+          Matches numeric entities in hexadecimal format,
     *                                  starting with #x and followed by hexadecimal digits.
     * 
     *      ;                           Matches the semicolon that ends the escape sequence.
     * 
     *  reference: https://mateam.net/html-escape-characters/
     */
    const regex = /&(?:[a-zA-Z][a-zA-Z0-9]*|#[0-9]+|#x[0-9a-fA-F]+);/

    const matches = string.match(regex);
    if (matches){
        for (const match of matches){
            /**
             * Can't find the logic API responsible for mediating between these
             * interpretations, so have to do it the round-about way.
             * 
             * Not every valid pattern is a valid escape sequence eg. "&a;"
             * In these cases it *SHOULD* simply return the string as is.
             */ 
            const transformer = document.createElement("div");
            transformer.innerHTML = match;

            string = string.replace(match, transformer.innerText);
        };
    };

    return string
};