import React, { useState } from 'react';
import styles from './searchbar.module.scss';

export default function SearchBar() {
    const [searchString, setSearchString] = useState();

    function handleKeyPress(event) {
        // event.preventDefault();
        if (event.key === 'Enter') {
            // console.log(document.getElementById('search-input').value);
            handleSearch();
        }
    }

    function handleSearch() {
        if (!searchString || searchString.trim().length < 2) {
            alert("2글자 이상 입력해주십쇼 ㅡㅅㅡ\nPlz type more than 2 characters.");
            return;
        }
        // convert to lowercase & whitespace to dash
        const normalizedSearch = searchString.trim().toLowerCase().replace(/\s+/g, '-');

        // query all anchor ids in the page
        const anchors = Array.from(document.querySelectorAll('[id]'));

        // search anchor id with normalized keyword
        const matchedAnchor = anchors.find(anchor => {
            const anchorId = anchor.id.toLowerCase();
            return anchorId.includes(normalizedSearch);
        });

        if (matchedAnchor) {
            /* Allow navigation to the same hash URL even if already at that position */
            // Remove existing hash then re-set
            // Synchronously changing the hash twice may cause browsers to ignore the first or override with the second
            // -> no navigation
            // -> so we have to cheat the browser
            const tempHash = '#_temp';
            // set fake hash: reload x scroll x -> only change URL
            // -> to cheat the browser to think it's in a different state
            history.replaceState(null, null, tempHash);

            // set real hash in the next event loop tick
            setTimeout(() => {
                // Type A. move directly
                // location.hash = '#' + matchedAnchor.id;

                // Type B. scroll animation
                matchedAnchor.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // update browser url state
                history.replaceState(null, null, '#' + matchedAnchor.id);

                // highlight target anchor
                highlightElement(matchedAnchor);
            }, 0);
        } else {
            alert('그런 단어는 없는뎁쇼 ㅇㅅㅇ\nSowwy~ no such word here!');
        }
    }

    function highlightElement(el) {
        // reset
        el.classList.remove('highlight-active', 'highlight-fade-out');
        void el.offsetWidth; // reflow

        // highlight for 1.5s then fadeout for .5s
        el.classList.add('highlight-active');

        setTimeout(() => {
            el.classList.add('highlight-fade-out');
        }, 1500);

        setTimeout(() => { // 1.5s + .5s -> 2s
            el.classList.remove('highlight-active', 'highlight-fade-out');
        }, 2000);
    }

    return (
        <div className={styles.SearchbarBackground}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>title</h1>
                <h1 className={styles.titleDown}>title changed</h1>
            </div>

            <fieldset className={styles.fieldContainer} onKeyPress={handleKeyPress}>
                <input type="text" defaultValue={searchString} placeholder="Search..." id="search-input" className={styles.field}
                    onChange={event => setSearchString(event.target.value)} />
                <div className={styles.iconsContainer} onClick={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 56.966 56.966">
                        <path fill="#009BFF" d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23
                                s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92
                                c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17
                                s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                    <div className={styles.iconSearch}>
                        // Working on here..
                    </div>
                </div>
            </fieldset>
        </div>
    );
}