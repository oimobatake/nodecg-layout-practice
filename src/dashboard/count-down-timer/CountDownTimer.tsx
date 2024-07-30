import React,{ useCallback, useEffect, useState } from 'react';
import { useReplicant } from "@nodecg/react-hooks";
import Button from './component/Button';
import InputField from './component/InputField';
import { time } from 'console';
import { TimerState } from '../../types/schemas/timerState';

// Replicantを生成しておく memo:のちのちextensionに移動
export const state = nodecg.Replicant<TimerState>('timerState');

const CountDownTimer: React.FC = () => {
    const [timerState, setTimerState] = useReplicant<TimerState>('timerState', {
        bundle: "nodecg-layout-practice",
        defaultValue: {
            time: 0,
            isRunning: false,
            initialTime: 0
        }
    });

    // タイマー
    const [inputTime, setInputTime] = useState('00:00:00');

    // useEffectの中でsetIntervalを呼んでしまうと正しく動作しないのでtick関数を噛ませる必要がある
    const tick = useCallback(() => {
        if(timerState?.isRunning && timerState.time > 0){
            const p:TimerState = {
                time:timerState.time - 1,
                isRunning:timerState.isRunning,
                initialTime:timerState.initialTime
            };
            setTimerState(p)
        } else if(timerState?.isRunning && timerState.time === 0){
            const p:TimerState = {
                time:timerState.time,
                isRunning:false,
                initialTime:timerState.initialTime
            };
            setTimerState(p);
        }
      }, [timerState, setTimerState]);

    // タイマーの更新設定
    useEffect(()=>{
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
      }, [tick]);

    // startボタン
    const handleStart = () =>{
        if(timerState === undefined) return;

        // memo:ちゃんと型を指定してコピーすれば問題なく変更が掛かる
        const p:TimerState = {
            ...timerState,
            isRunning:true,
        };
        setTimerState(p);
    }

    // stopボタン
    const handleStop = ()=>{
        if(timerState === undefined) return;
        const p:TimerState = {
            ...timerState,
            isRunning:false
        };
        setTimerState(p);
    }

    // resetボタン
    const handleReset = ()=>{
        if(timerState === undefined) return;
        const p:TimerState = {
            time:timerState.initialTime,
            isRunning:false,
            initialTime:timerState.initialTime
        };
        setTimerState(p);
    }

    // タイマー設定
    const handleSetTime = () =>{
        const [hour, minutes, seconds] = inputTime.split(':').map(Number);
        const totalSeconds = hour * 3600 + minutes * 60 + seconds;
        setTimerState({ time:totalSeconds, isRunning: false, initialTime: totalSeconds});
    }

    // タイマーフォーマット変換
    const formatTime = (time:number | undefined):string => {
        // undefinedは許容しない
        if(time === undefined) return``;
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if(!timerState){
        return <div>Loading...</div>
    }

    return (
        <div className="countdown-timer">
            <h2>RTALearningTimer</h2>
            <div className="timer-display">{formatTime(timerState?.time)}</div>
            <div className="timer-controls">
                <InputField
                    value={inputTime}
                    onChange={setInputTime}
                    placeholder="HH:MM:SS"
                />
                <Button onClick={handleSetTime}>Set Time</Button>
                <Button onClick={handleStart} disabled={timerState?.isRunning}>Start</Button>
                <Button onClick={handleStop} disabled={!timerState?.isRunning}>Stop</Button>
                <Button onClick={handleReset}>Reset</Button>
            </div>
        </div>
    );
}
export default CountDownTimer;