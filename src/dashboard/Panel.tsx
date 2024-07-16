import React,{ useCallback, useEffect, useMemo, useState } from 'react';
import { useReplicant } from "@nodecg/react-hooks";
import { GameInfo, GameInfoData } from '../types/schemas/gameInfoData';

interface GamePanelProps{}

// replicantの実態
//export const aaa = nodecg.Replicant<GameInfoData>('gameInfo');

export function GamePanel(){

	// 関数の実行した結果をキャッシュしてくれる(インスタンスをキャッシュ)
	// 空配列なら
	//const rep = useMemo(()=>{
	//	return nodecg.Replicant<GameInfoData>('gameInfo');
	//}, []);

	const playerCount = 4;

	const [gameName, setGameName] = useState<string>("");
	const [players, setPlayers] = useState<string[]>(["","","",""]);
	const [categories, setCategorys] = useState<string[]>(["","","",""]);
	const [estimatedTime, setEstimateTime] = useState<string>("");

	// 非同期で返ってくる
	const [gameInfo, setGameInfo] = useReplicant<GameInfoData>('gameInfo', {
		bundle: "nodecg-layout-practice",
	});

	// あんまり使いたくない
	// 外部のオブジェクトなどを参照している場合は自身でreturnで破棄しないといけない
	useEffect(()=>{
		setGameName(gameInfo?.gameName ?? "");
		setPlayers(gameInfo?.players ?? []);
		setCategorys(gameInfo?.categories ?? []);
		setEstimateTime(gameInfo?.estimatedTime ?? "");
	}, [gameInfo]);
	
	// プレイヤー名変更
	const handlePlayerChange = (index:number, value: string) => {
		if(players === undefined) return;

		// 直接渡すと参照私になってしまうので、新しい配列を作成する
		const newPlayers = [...players];
		newPlayers[index] = value;
		setPlayers(newPlayers);
	}

	// カテゴリー名変更
	const handleCategoryChange = (index:number, value:string) => {
		if(categories === undefined) return;

		const newCategories = [...categories];
		newCategories[index] = value;
		setCategorys(newCategories);
	}

	// 確定
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
		if(gameInfo === undefined) return;

		e.preventDefault();
		const updateGameInfo: GameInfoData = {
			...gameInfo,
			gameName:gameName ?? "",
			players: (players?.filter(player => player != '')) ?? ["","","",""],
			categories: (categories?.filter(category => category != '')) ?? ["","","",""],
			estimatedTime: estimatedTime ?? ""
		};

		setGameInfo(updateGameInfo);
		console.log('gameInfoUpdate!:', updateGameInfo);
	};

	const renderEditor = () => {
		if(gameInfo === undefined) return;

		return (
			<div className="game-panel">
			  <h2>Game Information</h2>
			  <hr/>
			  <form onSubmit={handleSubmit}>
				<div className="form-group">
				  <label htmlFor="gameName">Game Name:</label><br></br>
				  <input
					type="text"
					id="gameName"
					value={gameName}
					onChange={(e) => setGameName(e.target.value)}
				  />
				</div>
				<hr/>
				<div className="form-group">
				  <label>Players:</label><br></br>
				  {[...Array(playerCount).keys()].map(index => (
					<input
					  key={index}
					  type="text"
					  value={players[index] ?? ""}
					  onChange={(e) => handlePlayerChange(index, e.target.value)}
					  placeholder={`Player ${index + 1}`}
					/>
				  ))}
				</div>
				<hr/>
				<div className="form-group">
				<label>Categories:</label><br></br>
				{[...Array(playerCount).keys()].map(index => (
					<input
					key={index}
					type="text"
					value={categories[index] ?? ""}
					onChange={(e) => handleCategoryChange(index, e.target.value)}
					placeholder={`Category ${index + 1}`}
					/>
				))}
				</div>
				<hr/>
				<div className="form-group">
				<label htmlFor="estimatedTime">Estimated Time:</label><br></br>
				<input
					type="text"
					id="estimatedTime"
					value={estimatedTime}
					onChange={(e) => setEstimateTime(e.target.value)}
					placeholder="HH:MM:SS"
				/>
				</div>
				<br></br>
			<button type="submit">Update</button>
		  </form>
		</div>
	  );
	}

	return renderEditor();
};

export function Panel() {
	return(
		<>
		{GamePanel()}
		</>
	);
}
