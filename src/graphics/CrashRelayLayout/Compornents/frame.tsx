import React from "react";
import styles from "../styles.module.css";

interface FrameProps {
  position: string;
}

export const Frame: React.FC<FrameProps> = ({ position }) => (
  <img src="../crash_frame.png" className={`${position} ${styles.frameDefault}`} />
);