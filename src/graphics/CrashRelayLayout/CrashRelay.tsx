import React from 'react';
import { useReplicant } from '@nodecg/react-hooks';
import { Timer } from "../../lib/schemas/timer";
import { RunDataActiveRun } from "../../lib/schemas/runDataActiveRun";
import { RunDataArray } from "../../lib/schemas/runDataArray";
import styles from "./styles.module.css"
import bg from "./crash_bg.png";
import frame from "./frame.png";
import logo from "./AllGems_event_logo.png";
import type { GameInfoData } from '../../types/schemas/gameInfoData';
import type { TimerState } from '../../types/schemas';

type PlayerData = {
	id: string,
	streamType: string,
	position: string
}

let to:NodeJS.Timeout;
export function Index() {

	// timer
	const [timer, __t] = useReplicant<Timer>("timer", {
		bundle: "nodecg-speedcontrol",
	});

	// 現在選択されているゲーム(初期値はundefined)
	const [runDataActiveRun, _rda] = useReplicant<RunDataActiveRun>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});

	//const [gameInfo, s_] = useReplicant<GameInfoData>("gameInfo", {
	//	bundle: "nodecg-layout-practice",
	//});

    //------------------------------------------------------------------------
    // レイアウト構成
    const count = 4; // とりあえず4人用画面

    // css関連はここで分岐してみる
    const frameStyle:string[] = [
        `${styles.frameLeftTop}`,
        `${styles.frameRightTop}`,
        `${styles.frameLeftBottom}`,
        `${styles.frameRightBottom}`
    ];
	const nameStyle:string[]=[
		`${styles.nameLeftTop}`,
		`${styles.nameRightTop}`,
		`${styles.nameLeftBottom}`,
		`${styles.nameRightBottom}`,
	];
	const displayStyle:string[]=[
		`${styles.leftTopStreamFrame}`,
		`${styles.rightTopStreamFrame}`,
		`${styles.leftBottomStreamFrame}`,
		`${styles.rightBottomStreamFrame}`,
	];

	// 枠の定義
    const images = Array.from({length: count}, (_, length) =>(
        <img src={frame} className={`${frameStyle[length]} ${styles.frameDefault}`}/>
    ));
	// 名前位置
	const names = Array.from({length: count}, (_, length) =>(
		<div data-name="player" className={`${nameStyle[length]} ${styles.nameDefault} ${styles.changeNameToCategory}`}> {runDataActiveRun?.teams[length].players[0].name} </div>
	));
	
	// 配信画面の設定
	const mediaIframe = (data:{
		id: string,
		streamType: string,
		position: string
	})=> {
		if(data.streamType === 'twitch'){
			const URL = `https://player.twitch.tv/?channel=${data.id}&parent=localhost`;
			return (
				<div id="twitch-embed">
					<iframe
					src={URL}
					allowFullScreen
					className={data.position} />
				</div>
			);
		}else{
			const URL = `https://www.youtube.com/embed/${data.id}?si=yTWjuIAALst09TKk`;
			return (
				<iframe
				src={URL}
				title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerPolicy="strict-origin-when-cross-origin"
				allowFullScreen
				className={data.position}></iframe>
			);
		}
	}

	// reactだからcssを使う場合はclassName="~"で指定する
	return (
		<>
			<img src={bg} />
			<img src={logo} className={styles.eventLogo} />
			{images}
			{names}
			<p className={styles.gameTitle}>{runDataActiveRun?.game}</p>
			<p className={styles.gameTimer} style={{ 
				color: timer?.state === 'finished' ? 'green' : 'black'
			}}>{timer?.time}</p>

			{mediaIframe({
				id : runDataActiveRun?.teams[0].players[0].social.twitch as string,
				streamType: runDataActiveRun?.teams[0].players[0].country as string,
				position: displayStyle[0],
			})}

			{mediaIframe({
				id : runDataActiveRun?.teams[1].players[0].social.twitch as string,
				streamType: runDataActiveRun?.teams[1].players[0].country as string,
				position: displayStyle[1],
			})}

			{mediaIframe({
				id : runDataActiveRun?.teams[2].players[0].social.twitch as string,
				streamType: runDataActiveRun?.teams[2].players[0].country as string,
				position: displayStyle[2],
			})}

			{mediaIframe({
				id : runDataActiveRun?.teams[3].players[0].social.twitch as string,
				streamType: runDataActiveRun?.teams[3].players[0].country as string,
				position: displayStyle[3],
			})}
		</>
	);
}
