import React, { useState, useEffect, useRef } from 'react';
import styles from './Wikisearch.module.scss';
import { Input } from 'antd';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { OptionData } from 'rc-select/lib/interface';
import { useRx } from '../../hooks/rxjs';

export const Wikisearch = () => {

    const [selected, setSelected] = useState('');
    const [options, setOptions] = useState<OptionData[]>([]);
    const [loading, setIsLoading] = useState(false);

    const setUpStream = (o: Observable<any>) => {
        return o.pipe(
            // Stream that I want
            filter((text) => text.length > 2),
            debounceTime(750),
            switchMap(searchQuery => {
                setIsLoading(true);
                return fetchResults(searchQuery);
            }))
            // This is the forEach, consuming the stream
            .subscribe(data => {
                const searchResults = data.query.search.map((result: any) => ({ ...result, value: result.title }));;
                setOptions(searchResults);
                setIsLoading(false);
            });
    }
    const subject = useRx(setUpStream, '')

    const fetchResults = (searchQuery: string) => {
        const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
        return fetch(endpoint)
            .then(response => response.json())
            .then(data => data)
            .catch(() => console.log('An error occurred'));
    }

    const onSearch = (event: any) => {
        const query = event.target.value;
        subject.next(query);
    }

    return (
        <div className={styles.app}>
            <Input
                style={{ width: 200 }}
                onChange={onSearch}
                placeholder="input here"
            />
            <div>
                {options.map(option => <div> {option.title} </div>)}
            </div>
        </div>
    );
};


