import React from "react";
import styles from "../styles.module.css";

interface TimerDisplayProps {
  time?: string;
  position: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, position }) => (
  <div className={position}>{time || "--:--:--"}</div>
);