import React, { useState, useEffect, useRef } from 'react';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, debounceTime, switchMap } from 'rxjs/operators';

export const useRx = (ocb: (ob: Observable<any>) => Subscription, initialState?: any) => {
    const subject = useRef(new BehaviorSubject(initialState));
    useEffect(() => {
        const sub = ocb(subject.current);
        return () => sub.unsubscribe();
    }, [])
    return subject.current;
}

export const useRxSubject = (value: any) => {
    const subject = useRef(new BehaviorSubject(value));
    useEffect(() => {
        subject.current.next(value);
    }, [value]);
    return subject.current.asObservable();
}

export const useRxSubscribe = (observable: Observable<any>) => {
    const [results, setResults] = useState();
    useEffect(() => {
        const subscription = observable.subscribe((values) => {
            setResults(values);
        })
        return () => subscription.unsubscribe();
    }, [observable])

    return results;
}