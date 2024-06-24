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

	type runnerInfo = {
		name:string;
		category:string
	}

	// 走者情報
	const runnnerInfos:runnerInfo[] = 
	[
		{ name:"ばたけ。/batake_", category: "Any%"},
		{ name:"すりぴ/ThreePeaks", category: "100%" },
		{ name:"セレナーデ☆ゆうき/serenade_yuuki", category:"GlitchLess" },
		{ name:"ハリマ/harima_moko", category:"No Mager Glitchs" },
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
		<div data-name="player" className={`${nameStyle[length]} ${styles.nameDefault} ${styles.changeNameToCategory}`}> {runnnerInfos[length].name} </div>
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
				element.textContent = (i == 0) ? runnnerInfos[index].name : runnnerInfos[index].category;
			}, 1000);
		});
		i = (i + 1) % 2;
	}
	setInterval(showName, 8000);

	// 
	// reactだからcssを使う場合はclassName="~"で指定する
	return (
		<>
        <img src={bg} />
        {images}
		{names}
        <p className={styles.gameTitle}>RTALearning レイアウトテスト</p>
		<p className={styles.gameTimer}>{timer?.time}</p>
		</>
	);
}
