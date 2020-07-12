import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { AutoComplete } from 'antd';
import { BehaviorSubject } from 'rxjs';

const subject$ = new BehaviorSubject('');

export const App = () => {

  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  const fetchResults = (searchQuery: string) => {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(() => console.log('An error occurred'));
  }

  const onSelect = () => {
    console.log('nothing');
  }

  const onSearch = (e: any) => {
    const query = e.target.value;
    if (query.length > 2) {
      subject$.next(query);
    }
    setSelected(query);
    console.log('nothing also');
  }

  useEffect(() => {
    const subscription = subject$.subscribe(
      values => {
        setOptions([values]);
      },
      error => { console.log(error) }
    );
    return () => subscription.unsubscribe();
  }, [])

  return (
    <div className={styles.app}>
      <AutoComplete
        options={[]}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="input here"
      />
    </div>
  );
};
