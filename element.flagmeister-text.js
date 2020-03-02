customElements.define('flagmeister-text', class extends HTMLElement {
    static get observedAttributes() {
        return ['word']
    }
    constructor() {
        super();
    }
    attributeChangedCallback(
        name
        , oldValue
        , word  // works because it is the ONLY observedattribute!
        , isos
        , iso
        , width
    ) {
        isos = this.getAttribute('iso').split`,`;

        //passed as parameter:
        //let word = this.getAttribute('word');// can't read innerHTML here yet

        //let iso, width;// declared outside loop so no 'let ' inside loop required,saves 4 bytes.. and 7 bytes for no return... total byte save:11 bytes

        this.innerHTML = `<style>[word='${word}']{
display:flex;justify-content:flex-start}
[word='${word}'] img{width:auto;height:var(--flagmeisterletterheight,100px);filter:var(--flagmeistertextfilter,drop-shadow(1px 1px 0 grey) drop-shadow(-1px -1px 0 white) drop-shadow(4px 4px 2px black))</style>`;
        //setTimeout so previous STYLE is implemented and global CSS variables can be read !!?!!?
        setTimeout(p => //! todo ask SO
            this.innerHTML += word.split``.map((str, idx) => (
                // first (x1,y2,z3),but cannot use 'let ' declaration here
                // width = ~~fmPropValue(this, 'letterwidth_' + str, (
                //     {   // make viewBox for these letters smaller 5=50% or larger 13=130%
                //         i: 5, l: 5,
                //         I: 6, t: 6, t: 6, f: 6, s: 6,
                //         e: 7, r: 7, j: 7, o: 7, v: 7, z: 7,
                //         u: 8, g: 8, a: 8, d: 8, b: 8, p: 8, q: 8, c: 8, y: 8, x: 8,
                //         J: 9, Z: 9,
                //         M: 12, w: 12,
                //         m: 13
                //     }[str] / 10 || 1)
                //     * fmPropValue(this, 'letterwidth', 420)// read --flagmeisterletterwidth or use default 420
                // )// end first
                // ,

                //WIDTH
                //width = 320,
                //iso = isos[idx] || isos[0]// can save one more GZip byte by pasting this TWICE below
                // last in (x1,y2,z3) is return value,saves 7 characters 'return ' statement
                //, 
                `<img is=flag-${isos[idx] || isos[0]} detail=99999 letter=${str} clip='text:${
                // create text paramaters object:
                JSON.stringify({
                    str: str === '_' ? ' ' : str                // change _ to space
                    , y: word.match(/[gjqyQ]/) ? 355 : 420      // if these characters are used,change y location
                    , ...JSON.parse(this.getAttribute('text'))  // user overrules settings 
                })
                } ' filter=light box='160 0 320 480'/>`
                //WIDTH
                //} ' filter=light box='${(640 - width) / 2} 0 ${width} 480'/>`
            )).join`` // ??SO?? because we add on innerHTML with += we DO need a join here
        );
    }
});