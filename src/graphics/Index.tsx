import React from 'react';
import { useReplicant } from '@nodecg/react-hooks';
import { Timer } from "../lib/schemas/timer";
import { RunDataActiveRun } from "../lib/schemas/runDataActiveRun";
import { RunDataArray } from "../lib/schemas/runDataArray";
import bg from "./test.png";
import img00 from "./目あけ口あけ.png";
import img01 from "./目あけ口とじ.png";
import img02 from "./目とじ口あけ.png";
import img03 from "./目とじ口とじ.png";

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

	// reactだからcssを使う場合はclassName="~"で指定する
	return (
		<>
			<img src={img00} />
			<img src={img01} />
			<img src={img02} />
			<img src={img03} />
		</>
	);
}
