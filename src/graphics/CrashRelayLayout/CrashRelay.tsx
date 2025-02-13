import React from "react";
import { useReplicant } from "@nodecg/react-hooks";
import { Timer } from "../../lib/schemas/timer";
import { RunDataActiveRun } from "../../lib/schemas/runDataActiveRun";
import styles from "./styles.module.css";
import { RunFinishTimes } from "../../lib/schemas";
import { Frame } from "./Compornents/frame";
import { PlayerName } from "./Compornents/playerName";
import { TimerDisplay } from "./Compornents/timerDisplay";
import { StreamEmbed } from "./Compornents/streamEmbed";

export function Index() {
  // Replicants
  const [gameTimer] = useReplicant<Timer>("timer", { bundle: "nodecg-speedcontrol" });
  const [runDataActiveRun] = useReplicant<RunDataActiveRun>("runDataActiveRun", {
    bundle: "nodecg-speedcontrol",
  });
  const [runFinishTime] = useReplicant<RunFinishTimes>("runFinishTimes", {
    bundle: "nodecg-speedcontrol",
  });

  // UI配置
  // チームのstyle情報をまとめる
  const teamPositionMap: Record<string, { timer: string; frame: string; name: string; stream: string }> = {
    "Aチーム": { timer: styles.leftTopTimer, frame: styles.frameLeftTop, name: styles.nameLeftTop, stream: styles.leftTopStreamFrame },
    "Bチーム": { timer: styles.rightTopTimer, frame: styles.frameRightTop, name: styles.nameRightTop, stream: styles.rightTopStreamFrame },
    "Cチーム": { timer: styles.leftBottomTimer, frame: styles.frameLeftBottom, name: styles.nameLeftBottom, stream: styles.leftBottomStreamFrame },
    "Dチーム": { timer: styles.rightBottomTimer, frame: styles.frameRightBottom, name: styles.nameRightBottom, stream: styles.rightBottomStreamFrame },
  };

  // タイマーポジションをチームIDと紐づける
  const timerPositions: Record<string, string> = {};
  runDataActiveRun?.teams.forEach((team) => {
	if(team.name){
		if (teamPositionMap[team.name]) {
			timerPositions[team.id] = teamPositionMap[team.name].timer;
		}
	}
  });

  // フレーム、名前、ストリームのスタイルリスト
  const framePositions = Object.values(teamPositionMap).map((t) => t.frame);
  const namePositions = Object.values(teamPositionMap).map((t) => t.name);
  const streamPositions = Object.values(teamPositionMap).map((t) => t.stream);

  return (
    <>
      <img src="/crash_bg.png" alt="Background" />
      <img src="/AllGems_event_logo.png" className={styles.eventLogo} alt="Event Logo" />

      {// keyはReact側に渡すもので、コンポーネントのpropとは関係ない、keyが無いと全て再レンダリングされてしまうので、
	   // 今回の様な固定位置に関してはkeyを設定してしまった方が効率が良い
	   framePositions.map((pos, index) => (
        <Frame key={index} position={pos} />
      ))}

      {runDataActiveRun?.teams.map((team, index) => (
        <PlayerName key={team.id} name={team.players[0]?.name} position={namePositions[index]} />
      ))}

      {gameTimer?.teamFinishTimes &&
        Object.entries(gameTimer.teamFinishTimes).map(([teamId, timeData]) => (
          <TimerDisplay key={teamId} time={timeData.time} position={timerPositions[teamId]} />
        ))}

      <p className={styles.gameTitle}>{runDataActiveRun?.game}</p>
      <p className={styles.gameTimer} style={{ color: gameTimer?.state === "finished" ? "yellow" : "ghostwhite" }}>
        {gameTimer?.time}
      </p>
      <p className={styles.estimateBase}>{runDataActiveRun?.region}</p>
      <p className={styles.estimateTimer}>{runDataActiveRun?.estimate}</p>

      {runDataActiveRun?.teams.map((team, index) => (
        <StreamEmbed
          key={team.id}
          id={team.players[0]?.social?.twitch}
          streamType={team.players[0]?.country}
          position={streamPositions[index]}
        />
      ))}
    </>
  );
}
