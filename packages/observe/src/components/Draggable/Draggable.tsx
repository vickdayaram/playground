import React, { useState, useEffect, useRef } from 'react';
import styles from './Draggable.module.scss';
import { Input } from 'antd';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { OptionData } from 'rc-select/lib/interface';
import { useRx } from '../../hooks/rxjs';
import { Button } from 'antd';

type DragItem = {
  name: string,
  color: string
} & Pos;

type Pos = {
  x: number;
  y: number;
}

export const Draggable = () => {

  const [dragItems, setDragItems] = useState(resetDragItems());
  const handleMouseDown = (event: any) => {

  };

  const handleReset = () => {
    setDragItems(resetDragItems());
  }

  return (
    <div className={styles.draggable}>
      <div className={styles.controlPanel}>
        <Button onClick={handleReset} type={"primary"}> Reset </Button>
      </div>
      {dragItems.map(({ name, color, x, y }) => (
        <div
          onMouseDown={handleMouseDown}
          className={styles.dragItem}
          key={name}
          style={{
            backgroundColor: color,
            left: `${x}px`,
            right: `${y}px`
          }}>
          {name}
        </div>
      ))}
    </div>
  );
};


const resetDragItems = (): DragItem[] => {
  const createInitialPos = (): Pos => {
    const wh = window.innerHeight;
    const ww = window.innerWidth;
    const y = Math.random() * wh;
    const x = Math.random() * ww;
    return { x, y };
  }

  return [
    {
      name: "hello",
      color: "red",
      ...createInitialPos()
    }, {
      name: "drag",
      color: "green",
      ...createInitialPos()
    },
    {
      name: "drag2",
      color: "blue",
      ...createInitialPos()
    }
  ]
}


