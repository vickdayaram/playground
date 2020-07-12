import React, { useState } from 'react';
import styles from './App.module.scss';
import { AutoComplete } from 'antd';

export const App = () => {

  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState([]);

  const onSelect = () => {
    console.log('nothing');
  }

  const onSearch = () => {
    console.log('nothing also');
  }

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
