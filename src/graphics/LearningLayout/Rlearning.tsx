import React from 'react';
import { useReplicant } from '@nodecg/react-hooks';
import { Timer } from "../../lib/schemas/timer";
import { RunDataActiveRun } from "../../lib/schemas/runDataActiveRun";
import { RunDataArray } from "../../lib/schemas/runDataArray";
import styles from "./styles.module.css"
import bg from "./bg.png";
import frame from "./Rlearning-frame.png";

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
	if(runDataArray !== undefined){
		for(const data of runDataArray){
			console.log(data);
		}
	}

    //------------------------------------------------------------------------
    // レイアウト構成
    let count = 4; // とりあえず4人用画面

	const playerNames:string[] = 
	[
		"ばたけ。/batake_", "すりぴ/ThreePeaks", "セレナーデ☆ゆうき/serenade_yuuki", "ハリマ/harima_moko"
	];

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
		<p className={`${nameStyle[length]} ${styles.nameDefault}`}>{playerNames[length]}</p>
	));
	// reactだからcssを使う場合はclassName="~"で指定する
	return (
		<>
        <img src={bg} />
        <div>{images}</div>
		<div>{names}</div>
        <p className={styles.gameTitle}>RTALearning レイアウトテスト</p>
		<p className={styles.gameTimer}>{timer?.time}</p>
		</>
	);
}
