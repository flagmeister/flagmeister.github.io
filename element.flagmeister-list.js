customElements.define('flagmeister-list', class extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const GZsize = 32;
        const delay = 500;    // execute after delay so header IMGs is available
        setTimeout(() => {
            let signals = this.hasAttribute('signals');
            let img = (iso, char = false) => `<img is=flag-${iso} ${char ? 'char=' + char : ''} title="flag-${iso + (char ? ' char=' + char : '')}">`;
            let header = x => `<h3>${x}</h3>`;
            let isoNames = Object.keys(document.querySelector('img[is]').flags);
            this.innerHTML = `<h2 class="flagmeister_SVGinfo"></h2>`
                + header("ISO country code flags")
                + isoNames.map(iso => {
                    let counter = (id, items, title) => `<div id='${id}'>` + ['<h3>', 0, title, "</h3>", ...items]
                        .reduceRight((reducer, char, idx, redarr) =>
                            (
                                idx > 3
                                    ? (redarr[1]++ , img(iso, char))
                                    : char
                            ) + reducer
                            , '') + '</div>';

                    if (iso == 'signal') {
                        if (signals) return counter("FlagMeisterNATOFlags", "abcdefghijklmnopqrstuvwxyz0123456789".split``, " signal flags");
                        else return '';
                    } else if (iso == 'ics') {
                        if (signals) return counter("FlagMeisterICSFlags", "0123456789".split``, ' ICS signal flags')
                        else return '';
                    } else
                        return (iso == 'eu' ? header("non country flags") : '') + img(iso)
                }).join``;

            // process all injected flag
            let flags = [...this.querySelectorAll('img')];
            // set the correct flagcount and filesize in all text elements
            let replaceHTML = (sel, x) => [...document.querySelectorAll(sel)].map(el => el.innerHTML = x);
            replaceHTML('.flagmeister_flagcount', flags.length);
            replaceHTML('.flagmeister_size', GZsize);
            replaceHTML('.flagmeister_SVGinfo', `FlagMeister created <span class=highlightText>${flags.length} SVG flags</span>, totalling ${flags.reduce((totalsvg, flag) => totalsvg + flag.src.length, 0)} hydrated bytes`);
        }, this.getAttribute('delay') || delay)
    }
})