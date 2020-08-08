import React, { useState, useEffect, useRef } from 'react';
import styles from './Draggable.module.scss';
import { Input } from 'antd';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';
import { OptionData } from 'rc-select/lib/interface';
import { useRx } from '../../hooks/rxjs';
import { Button } from 'antd';
import { DragDiv } from './DragDiv/DragDiv';

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

  const handleReset = () => {
    setDragItems(resetDragItems());
  }

  return (
    <div className={styles.draggable}>
      <div className={styles.controlPanel}>
        <div className={styles.header}>Control Panel</div>
        <Button onClick={handleReset} type={"primary"}> Reset </Button>
      </div>
      <div className={styles.draggableWindow} id={"draggableWindow"}>
        {dragItems.map(({ name, color, x, y }) => (
          <DragDiv
            key={name}
            name={name}
            color={color}
            x={x}
            y={y}
          />
        ))}
      </div>
    </div>
  );
};


const resetDragItems = (): DragItem[] => {

  const padding = 100;

  const createInitialPos = (): Pos => {
    const dw = document.getElementById('draggableWindow');
    if (dw) {
      const wh = dw.clientHeight;
      const ww = dw.clientWidth;
      const y = Math.abs((Math.random() * wh) - padding);
      const x = Math.abs((Math.random() * ww) - padding);
      return { x, y };
    }
    return { x: 0, y: 0 };
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


