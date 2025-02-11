import React from "react";
import styles from "../styles.module.css";

interface PlayerNameProps {
  name?: string;
  position: string;
}

export const PlayerName: React.FC<PlayerNameProps> = ({ name, position }) => (
  <div className={`${position} ${styles.nameDefault} ${styles.changeNameToCategory}`}>
    {name || "No Name"}
  </div>
);