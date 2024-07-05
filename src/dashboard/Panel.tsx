import React, { useState, useEffect } from 'react';
import { useReplicant } from "@nodecg/react-hooks";
import { GameInfoData } from '../types/schemas/gameInfoData';
import { platform } from 'os';

interface GAmePanelProps{}

export function GamePamel(){
	const gameInfoReplicant = nodecg.Replicant<GameInfoData>('gameInfo');
	const [gameInfo, setGameInfo] = useState<GameInfoData>({
		gameName:'',
		players: ['','','',''],
		categories:['','','',''],
		estimatedTime:''}
	);

	// changeイベントの発行
	useEffect(()=>{
		gameInfoReplicant.on('change', (newValue: GameInfoData | undefined) =>{
			if(newValue){
				setGameInfo(newValue);
			}
		});
	}, []);

	// プレイヤー名変更
	const handlePlayerChange = (index:number, value: string) => {
		const newPlayers = [...gameInfo.players];
		newPlayers[index] = value;
		setGameInfo({...gameInfo, players: newPlayers});
	}

	// カテゴリー名変更
	const handleCategoryChange = (index:number, value:string) => {
		const newCategories = [...gameInfo.categories];
		newCategories[index] = value;
		setGameInfo({...gameInfo, categories: newCategories});
	}

	// 確定
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
		e.preventDefault();

		const updateGameInfo: GameInfoData = {
			...gameInfo,
			players: gameInfo.players.filter(player => player != ''),
			categories: gameInfo.categories.filter(category => category != ''),
		};

		setGameInfo(updateGameInfo);
		console.log('gameInfoUpdate!:', updateGameInfo);
	};

	return (
		<div className="game-panel">
		  <h2>Game Information</h2>
		  <form onSubmit={handleSubmit}>
			<div className="form-group">
			  <label htmlFor="gameName">Game Name:</label>
			  <input
				type="text"
				id="gameName"
				value={gameInfo.gameName}
				onChange={(e) => setGameInfo({ ...gameInfo, gameName: e.target.value })}
			  />
			</div>
	
			<div className="form-group">
			  <label>Players:</label>
			  {gameInfo.players.map((player, index) => (
				<input
				  key={index}
				  type="text"
				  value={player}
				  onChange={(e) => handlePlayerChange(index, e.target.value)}
				  placeholder={`Player ${index + 1}`}
				/>
			  ))}
			</div>

			<div className="form-group">
          <label>Categories:</label>
          {gameInfo.categories.map((category, index) => (
            <input
              key={index}
              type="text"
              value={category}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
              placeholder={`Category ${index + 1}`}
            />
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="estimatedTime">Estimated Time:</label>
          <input
            type="text"
            id="estimatedTime"
            value={gameInfo.estimatedTime}
            onChange={(e) => setGameInfo({ ...gameInfo, estimatedTime: e.target.value })}
            placeholder="HH:MM:SS"
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export function Panel() {
	return(
		<>
		{GamePamel()}
		</>
	);
}
