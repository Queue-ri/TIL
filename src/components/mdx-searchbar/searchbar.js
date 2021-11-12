import React, { useState } from 'react';
import styles from './searchbar.module.scss';

export default function SearchBar() {
    const [searchString, setSearchString] = useState();

    function handleKeyPress(event) {
        // event.preventDefault();
        if(event.key === 'Enter'){
            console.log(document.getElementById('search-input').value);
            // Working on here..
        }
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
                <div className={styles.iconsContainer}>
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