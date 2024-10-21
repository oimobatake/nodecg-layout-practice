import React from 'react';
import { useReplicant } from '@nodecg/react-hooks';
import { Timer } from "../../lib/schemas/timer";
import { RunDataActiveRun } from "../../lib/schemas/runDataActiveRun";
import { RunDataArray } from "../../lib/schemas/runDataArray";
import styles from "./styles.module.css"
import bg from "./crash_bg.png";
import frame from "./frame.png";
import type { GameInfoData } from '../../types/schemas/gameInfoData';
import type { TimerState } from '../../types/schemas';

let to:NodeJS.Timeout;
export function Index() {

	// replicantの使い方
	const [timer, __t] = useReplicant<Timer>("timer", {
		bundle: "nodecg-speedcontrol",
	});
	console.log(timer?.state);

	// 現在選択されているゲーム(初期値はundefined)
	const [runDataActiveRun, _rda] = useReplicant<RunDataActiveRun>("runDataActiveRun", {
		bundle: "nodecg-speedcontrol",
	});
	console.log(runDataActiveRun?.game);

	// ゲーム全体のリスト
	const [runDataArray, _ra] = useReplicant<RunDataArray>("runDataArray", {
		defaultValue:[],
		bundle: "nodecg-speedcontrol",
	})

	// カウントダウンタイマー
	const [timerState] = useReplicant<TimerState>('timerState', {
		defaultValue:{
			time:0,
			isRunning:false,
			initialTime:0
		}
	});

	if(runDataArray !== undefined){
		for(const data of runDataArray){
			console.log(data);
		}
	}

	const [gameInfo, s_] = useReplicant<GameInfoData>("gameInfo", {
		bundle: "nodecg-layout-practice",
	});

	const formatTime = (time:number | undefined) =>{
		if(time === undefined) return``;
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

    //------------------------------------------------------------------------
    // レイアウト構成
    let count = 4; // とりあえず4人用画面

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

	// 配列に諸々定義してる？
    const images = Array.from({length: count}, (_, length) =>(
        <img src={frame} className={`${frameStyle[length]} ${styles.frameDefault}`}/>
    ));
	// 名前位置
	const names = Array.from({length: count}, (_, length) =>(
		<div data-name="player" className={`${nameStyle[length]} ${styles.nameDefault} ${styles.changeNameToCategory}`}> {gameInfo?.players[length]} </div>
	));

	// 名前とカテゴリ切り替え
	let i = 0;
	function showName(){
		// divのdata-nameセレクタを取得してる
		const namesAndCategorys = document.querySelectorAll('[data-name="player"]');
		namesAndCategorys.forEach((element, index) => {
			element.classList.add(styles.changeHidden);
			setTimeout(()=>{
				element.classList.remove(styles.changeHidden);
				element.textContent = (i == 0) ? gameInfo?.players[index] as string : gameInfo?.categories[index] as string;
			}, 1000);
		});
		i = (i + 1) % 2;
	}
	if(to)clearInterval(to);
	to = setInterval(showName, 8000);

	// reactだからcssを使う場合はclassName="~"で指定する
	return (
		<>
        <img src={bg} />
        {images}
		{names}
        <p className={styles.gameTitle}>{gameInfo?.gameName}</p>
		<p className={styles.gameTimer} style={{ 
			color: timerState?.time === 0 ? 'gray' : 'black'
		}}>{formatTime(timerState?.time)}</p>

		<div id="twitch-embed">
			<iframe
			 src="https://player.twitch.tv/?channel=isogai2971&parent=localhost"
			 allowFullScreen
			 className={styles.leftTopStreamFrame} />

			 <iframe src="https://player.twitch.tv/?channel=harima_moko&parent=localhost" 
			 allowFullScreen
			 className={styles.rightTopStreamFrame}></iframe>

			 <iframe src="https://player.twitch.tv/?channel=rosalie_vt&parent=localhost" 
			 allowFullScreen
			 className={styles.leftBottomStreamFrame}></iframe>

			 <iframe src="https://player.twitch.tv/?channel=fujikura123&parent=localhost" 
			 allowFullScreen
			 className={styles.rightBottomStreamFrame}></iframe>
		</div>
		</>
	);
}
