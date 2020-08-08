import React, { useState, useEffect, useRef } from 'react';
import styles from './DragDiv.module.scss';
import { fromEvent, animationFrameScheduler } from 'rxjs';
import { switchMap, map, takeUntil, subscribeOn, mergeMap } from 'rxjs/operators';

type OwnProps = {
  name: string;
  color: string;
  x: number;
  y: number;
}

export const DragDiv = (props: OwnProps) => {

  const { name, color, x, y } = props;
  const [offset, setOffset] = useState<{ x: number, y: number } | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPos({ x, y });
  }, [x, y]);

  useEffect(() => {
    if (divRef.current) {
      const mouseDown = fromEvent(divRef.current, 'mousedown');
      const mouseMove = fromEvent(divRef.current, 'mousemove');
      const mouseUp = fromEvent(divRef.current, 'mouseup');

      const drag = mouseDown.pipe(
        switchMap(
          (start: any) => {
            return mouseMove.pipe(
              map((event: any) => {
                event.preventDefault();
                console.log(start);
                if (event) {
                  const x = event.clientX - 300;
                  const y = event.clientY - 100;
                  return { x, y };
                }
                return undefined;
              }),
              takeUntil(mouseUp)
            )
          }
        )
      )

      const pos = drag.pipe(subscribeOn(animationFrameScheduler));
      pos.subscribe(pos => {
        if (pos) {
          setPos({ ...pos });
        }
      })

    }
  }, [divRef.current]);

  const handleMouseDown = (event: any) => {
    const dragdiv = event.target
    const x = event.clientX - dragdiv.offsetLeft;
    const y = event.clientY - dragdiv.offsetTop;
    setOffset({ x, y })
    event.stopPropagation();
  }

  const handleMouseMove = (event: any) => {
    if (offset) {
      const x = (event.pageX - offset.x);
      const y = (event.pageY - offset.y);
      requestAnimationFrame(() => setPos({ x, y }));
    }
    event.stopPropagation();
    console.log('move');
  }

  const handleDragEnd = (event: any) => {
    setOffset(null);
    event.stopPropagation();
  }

  return (
    <div
      ref={divRef}
      className={styles.dragItem}
      key={name}
      style={{
        backgroundColor: color,
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}>
      {name}
    </div>
  )
}