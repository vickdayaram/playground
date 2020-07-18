import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { Input } from 'antd';
import { BehaviorSubject } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { OptionData } from 'rc-select/lib/interface';

const subject$ = new BehaviorSubject('');

export const App = () => {

  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = subject$.pipe(
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
    return () => subscription.unsubscribe();
  }, [])

  const fetchResults = (searchQuery: string) => {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    return fetch(endpoint)
      .then(response => response.json())
      .then(data => data)
      .catch(() => console.log('An error occurred'));
  }

  const onSelect = () => {
    console.log('nothing');
  }

  const onSearch = (event: any) => {
    const query = event.target.value;
    subject$.next(query);
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
