import { useEffect, useState } from "react";
import { View, StyleSheet, Vibration, Text, Pressable, Image } from "react-native";
import { PlayersContext } from "./context/PlayersContext";
import { SetPlayersContext } from "./context/SetPlayersContext";
import { SelectedPlayerContext } from "./context/SelectedPlayerContext";
import { PlayerNumberContext } from "./context/PlayerNumberContext";
import { GameStateContext } from "./context/GameStateContext";
import { SetGameStateContext } from "./context/SetGameStateContext";
import { SetSelectedPlayerContext } from "./context/SetSelectedPlayerContext";
import { VotedPlayersContext } from "./context/VotedPlayersContext";
import { SetVotedPlayersContext } from "./context/SetVotedPlayersContext";
import { SetLeaveVotesContext } from "./context/SetLeaveVotesContext";
import { SelectedBreakingVoteStateContext } from "./context/SelectedBreakingVoteStateContext";
import { SetSelectedBreakingVoteStateContext } from "./context/SetSelectedBreakingVoteStateContext";
import { LeaveVotesContext } from "./context/LeaveVotesContext";
import { TimeContext } from "./context/TimeContext";
import { SetTimeContext } from "./context/SetTimeContext";
import { isVoitingDayContext } from "./context/isVoitingDayContext";
import { CheckIsGameEndingContext } from "./context/CheckIsGameEndingContext";
import Timer from "./components/Timer";
import RolePicker from "./components/RolePicker";
import Player from "./components/Player";
import GameState from "./components/GameState";
import GameNextButton from "./components/GameNextButton";
import CountPanel from "./components/CountPanel";
import Time from "./components/Time";
import ThirdFallModal from "./components/ThirdFallModal";
import { ShowThirdFallModalContext } from "./context/ShowThirdFallModalContext";
import { SetShowThirdFallModalContext } from "./context/SetShowThirdFallModalContext";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

/*
gameState:
0: Нулевая ночь
1: День
2: Ночь (не нулевая)
3: Результаты ночи
4: Голосование
5: Результаты голосования
6: Перестрелка между игроками
7: Переголосование
8: Результаты переголосования
9: Автокатастрофа
10: Результаты автокатастрофы
11: Мафия победила
12: Мирные победили

player[i].status:
0: Жив
1: Выставлен на голосование
2: Заголосован
3: Убит ночью
4: Мертв
5: Получил 4 фола
*/

class PlayerData {
  constructor() {
    this.role = "Мирный",
      this.falls = 0,
      this.status = 0,
      this.canSpeak = true,
      this.hadVoiceLimit = false,
      this.voteCount = 0
  }
}

const App = () => {
  const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#000000',
    },
    timersContainer: {
      width: '100%',
      height: '10%',
      position: 'absolute',
      left: 0,
      top: '90%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    rolePickerContainer: {
      width: '50%',
      position: 'absolute',
      left: '50%',
      top: '50%',
    },
    gameStateContainer: {
      width: '50%',
      height: `${8.5 * 9 - 0.85}%`,
      position: 'absolute',
      left: '50%',
      top: '5%',
    },
    nextButtonContainer: {
      width: '50%',
      height: '7.65%',
      position: 'absolute',
      left: '50%',
      bottom: `${10 + 0.85}%`,
    },
    countPanelContainer: {
      width: '50%',
      position: 'absolute',
      left: 0,
      top: '5%'
    },
    playersContainer: {
      width: '50%',
      height: '85%',
      position: 'absolute',
      left: 0,
      top: '5%',
    },
    timeContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '10%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    timer60: {
      position: 'absolute',
      right: '5%',
    },
    timer20: {
      position: 'absolute',
      left: '5%'
    }
  });

  const [players, setPlayers] = useState(
    [new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData()]
  );
  const [gameState, setGameState] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(-1);
  const [votedPlayers, setVotedPlayers] = useState([]);
  const [selectedBreakingVoteState, setSelectedBreakingVoteState] = useState(-1);
  const [leaveVotes, setLeaveVotes] = useState(0);
  const [dayNumber, setDayNumber] = useState(0);
  const [nightNumber, setNightNumber] = useState(0);
  const [isVotingDay, setIsVotingDay] = useState(true);
  const [firstSpeaker, setFirstSpeaker] = useState(-1);
  const [playersWithFourFalls, setPlayersWithFourFalls] = useState([]);
  const [showThirdFallModal, setShowThirdFallModal] = useState(false);
  const [key, setKey] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState(false);

  const generatePlayers = () => {
    const playersReturn = [];

    for (let i = 0; i < 10; i++) {
      playersReturn.push(
        <PlayerNumberContext.Provider value={i} key={i}>
          <Player firstSpeaker={firstSpeaker} />
        </PlayerNumberContext.Provider>
      );
    }

    return playersReturn;
  }

  const restartGame = () => {
    setPlayers([new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData(), new PlayerData(), new PlayerData(),
    new PlayerData()]);
    setGameState(0);
    setSelectedPlayer(-1);
    setVotedPlayers([]);
    setSelectedBreakingVoteState(-1);
    setPlayersWithFourFalls([]);
    setFirstSpeaker(-1);
    setLeaveVotes(0);
    setDayNumber(0);
    clearTimer();
    setNightNumber(0);
  }

  const moveAfterZeroNight = () => {
    let isGameEnding = checkIsGameEnding();

    if (!isGameEnding) {
      setSelectedPlayer(-1);
      const newPlayers = JSON.parse(JSON.stringify(players));
      prepareForDay(newPlayers);
      setGameState(1);
      clearTimer();
      setPlayers(newPlayers);
    }
  }

  const prepareForGameEnding = () => {
    const newPlayers = JSON.parse(JSON.stringify(players));

    for (let i = 0; i < 10; i++) {
      if (
        newPlayers[i].status === 1 ||
        newPlayers[i].status === 0
      ) {
        newPlayers[i].status = 0;
      } else {
        newPlayers[i].status = 4;
      }
    }

    setSelectedPlayer(-1);
    setPlayers(newPlayers);
  }

  const clearTimer = () => {
    setKey(0);
    setDuration(0);
    setIsTimerPlaying(false);
  }
  const checkIsGameEnding = () => {
    let red = 0;
    let black = 0;
    for (let i = 0; i < 10; i++) {
      if (
        players[i].status === 0 ||
        players[i].status === 1
      ) {
        if (
          players[i].role === "Дон" ||
          players[i].role === "Мафия"
        ) {
          black++;
        } else {
          red++;
        }
      }
    }

    if (black >= red) {
      prepareForGameEnding();
      setGameState(11);
      return true;
    } else if (black === 0) {
      prepareForGameEnding();
      setGameState(12);
      return true;
    }

    return false;
  }

  const prepareForDay = (players) => {
    setDayNumber(i => i + 1);

    setIsVotingDay(true);

    const newPlayersWithFourFalls = [...playersWithFourFalls];

    for (let i = 0; i < 10; i++) {
      if (players[i].status === 5) {
        if (isVotingDay) {
          setIsVotingDay(false);
        }

        newPlayersWithFourFalls.push(i);
      }
    }

    setPlayersWithFourFalls(newPlayersWithFourFalls);

    defineWhoCannotSpeak(players);
    defineFirstSpeaker(players);
  }

  const moveAfterDay = () => {
    const newPlayers = JSON.parse(JSON.stringify(players));

    for (let i = 0; i < playersWithFourFalls.length; i++) {
      newPlayers[playersWithFourFalls[i]].status = 4;
    }

    setPlayers(newPlayers);
    setPlayersWithFourFalls([]);
    setSelectedPlayer(-1);
    clearTimer();

    if (votedPlayers.length === 0) {
      prepareForNight();
      setGameState(2);
    } else {
      setGameState(4);
    }
  }

  const defineWhoCannotSpeak = (players) => {
    for (let i = 0; i < 10; i++) {
      if (players[i].falls === 3) {
        if (players[i].hadVoiceLimit) {
          players[i].canSpeak = true;
        } else {
          players[i].canSpeak = false;
          players[i].hadVoiceLimit = true;
        }
      }
    }
  }

  const defineFirstSpeaker = (players) => {
    for (let i = 1; i < 10; i++) {
      if (
        (
          players[(firstSpeaker + i) % 10].status === 0 ||
          players[(firstSpeaker + i) % 10].status === 1
        ) &&
        players[(firstSpeaker + i) % 10].canSpeak
      ) {
        setFirstSpeaker((firstSpeaker + i) % 10);
        return;
      }
    }
  }

  const prepareForNight = () => {
    setNightNumber(i => i + 1);
  }

  const moveAfterNight = () => {
    if (selectedPlayer !== -1) {
      const newPlayers = JSON.parse(JSON.stringify(players));

      newPlayers[selectedPlayer].status = 3;

      setPlayers(newPlayers);
    }

    setSelectedPlayer(-1);
    setGameState(3);
    clearTimer();
  }

  const moveAfterNightResult = () => {
    let isGameEnding = checkIsGameEnding();

    if (!isGameEnding) {
      const newPlayers = JSON.parse(JSON.stringify(players));

      for (let i = 0; i < 10; i++) {
        if (newPlayers[i].status === 3) {
          newPlayers[i].status = 4;
        }
      }

      clearTimer();
      prepareForDay(newPlayers);
      setGameState(1);
      setPlayers(newPlayers);
    }
  }

  const moveAfterPopil = () => {
    const availableVotes = getAvailableVotes(players);
    const newPlayers = JSON.parse(JSON.stringify(players));
    clearTimer();
    if (leaveVotes > availableVotes - leaveVotes) {
      for (let i = 0; i < 10; i++) {
        if (newPlayers[i].status === 1) {
          newPlayers[i].status = 2;
        }
      }
      setGameState(10);
    } else {
      for (let i = 0; i < 10; i++) {
        if (newPlayers[i].status === 1) {
          newPlayers[i].status = 0;
        }
      }
      setVotedPlayers([]);
      for (let i = 0; i < 10; i++) {
        newPlayers[i].voteCount = 0;
      }
      prepareForNight();
      setGameState(2);
    }

    setPlayers(newPlayers);
    setLeaveVotes(0);
  }

  const moveAfterVoiting = () => {
    const newPlayers = JSON.parse(JSON.stringify(players));
    newPlayers[votedPlayers[votedPlayers.length - 1] - 1].voteCount += getAvailableVotes(players);
    let playersWithMaxVotes = getPlayersWithMaxVotes(newPlayers);
    if (playersWithMaxVotes.length === 1) {
      newPlayers[playersWithMaxVotes[0] - 1].status = 2;

      for (let i = 0; i < 10; i++) {
        if (newPlayers[i].status === 1) {
          newPlayers[i].status = 0;
        }
      }

      setSelectedPlayer(-1);
      setVotedPlayers([]);

      if (gameState === 4) {
        setGameState(5);
      } else if (gameState === 7) {
        setGameState(8);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        if (
          newPlayers[i].status === 1 &&
          playersWithMaxVotes.indexOf(i + 1) === -1
        ) {
          newPlayers[i].status = 0;
        }
      }

      setSelectedPlayer(-1);
      setVotedPlayers(votedPlayers => votedPlayers.filter(player => playersWithMaxVotes.indexOf(player) !== -1));

      if (gameState === 4) {
        setGameState(6);
      } else if (gameState === 7) {
        setGameState(9);
      }
    }

    for (let i = 0; i < 10; i++) {
      newPlayers[i].voteCount = 0;
    }

    setPlayers(newPlayers);
  }

  const getPlayersWithMaxVotes = (players) => {
    if (votedPlayers.length === 0) return [];

    let availableVotes = getAvailableVotes(players);
    players[votedPlayers[votedPlayers.length - 1] - 1].voteCount += availableVotes;

    let max = 0;

    for (let i = 0; i < 10; i++) {
      if (
        players[i].status === 1 &&
        players[i].voteCount > max
      ) {
        max = players[i].voteCount;
      }
    }

    let res = [];

    for (let i = 0; i < 10; i++) {
      if (
        players[i].status === 1 &&
        players[i].voteCount === max
      ) {
        res.push(i + 1);
      }
    }

    return res;
  }

  const moveAfterVoitingResult = () => {
    const isGameEnding = checkIsGameEnding();

    if (!isGameEnding) {
      const newPlayers = JSON.parse(JSON.stringify(players));

      for (let i = 0; i < 10; i++) {
        if (newPlayers[i].status === 2) {
          newPlayers[i].status = 4;
          newPlayers[i].voteCount = 0;
        }
      }

      setPlayers(newPlayers);
      setVotedPlayers([]);
      prepareForNight();
      setGameState(2);
      clearTimer();
    }
  }

  const getAvailableVotes = (players) => {
    let availableVotes = 0;

    for (let i = 0; i < 10; i++) {
      if (
        players[i].status === 0 ||
        players[i].status === 1
      ) {
        availableVotes++;
        availableVotes -= players[i].voteCount;
      }
    }

    return availableVotes;
  }

  const functions = {
    checkIsGameEnding: checkIsGameEnding,
    moveAfterZeroNight: moveAfterZeroNight,
    restartGame: restartGame,
    prepareForDay: prepareForDay,
    moveAfterDay: moveAfterDay,
    prepareForNight: prepareForNight,
    moveAfterNight: moveAfterNight,
    moveAfterNightResult: moveAfterNightResult,
    moveAfterVoiting: moveAfterVoiting,
    moveAfterVoitingResult: moveAfterVoitingResult,
    moveAfterPopil: moveAfterPopil,
    getPlayersWithMaxVotes: getPlayersWithMaxVotes,
  }

  return (
    <PlayersContext.Provider value={players}>
      <SetPlayersContext.Provider value={setPlayers}>
        <GameStateContext.Provider value={gameState}>
          <SetGameStateContext.Provider value={setGameState}>
            <SelectedPlayerContext.Provider value={selectedPlayer} >
              <SetSelectedPlayerContext.Provider value={setSelectedPlayer} >
                <VotedPlayersContext.Provider value={votedPlayers}>
                  <SetVotedPlayersContext.Provider value={setVotedPlayers}>
                    <SetLeaveVotesContext.Provider value={setLeaveVotes}>
                      <SelectedBreakingVoteStateContext.Provider value={selectedBreakingVoteState}>
                        <SetSelectedBreakingVoteStateContext.Provider value={setSelectedBreakingVoteState}>
                          <LeaveVotesContext.Provider value={leaveVotes}>
                            <isVoitingDayContext.Provider value={isVotingDay}>
                              <CheckIsGameEndingContext.Provider value={checkIsGameEnding}>
                                <ShowThirdFallModalContext.Provider value={showThirdFallModal}>
                                  <SetShowThirdFallModalContext.Provider value={setShowThirdFallModal}>
                                    <View style={styles.mainContainer}>
                                      <View style={styles.playersContainer}>
                                        {generatePlayers()}
                                      </View>
                                      <View style={styles.gameStateContainer}>
                                        <GameState dayNumber={dayNumber}
                                          nightNumber={nightNumber} />
                                      </View>
                                      <View style={styles.rolePickerContainer}>
                                        {
                                          gameState === 0
                                            && selectedPlayer !== -1
                                            ? <RolePicker />
                                            : null
                                        }
                                      </View>
                                      {
                                        (
                                          (
                                            gameState === 4 ||
                                            gameState === 7
                                          ) &&
                                          selectedPlayer !== -1 ||
                                          gameState === 9 &&
                                          selectedBreakingVoteState !== -1
                                        )
                                          ?
                                          <View style={styles.countPanelContainer}>
                                            <CountPanel getAvailableVotes={getAvailableVotes} />
                                          </View>
                                          : null
                                      }
                                      <View style={styles.nextButtonContainer}>
                                        <GameNextButton functions={functions}
                                          getAvailableVotes={getAvailableVotes} />
                                      </View>
                                      <View style={styles.timeContainer}>
                                        {
                                          (
                                            gameState === 0 ||
                                            gameState === 1 ||
                                            gameState === 2 ||
                                            gameState === 3 ||
                                            gameState === 5 ||
                                            gameState === 6 ||
                                            gameState === 8 ||
                                            gameState === 10
                                          )
                                            ?
                                            <CountdownCircleTimer
                                              key={key}
                                              isPlaying={isTimerPlaying}
                                              duration={duration}
                                              colors={['#2d42e0', '#33e02d', '#f57e42', '#f55d42', '#A30000']}
                                              colorsTime={[20, 10, 5, 3, 0]}
                                              size={60}
                                              strokeWidth={3}
                                              isSmoothColorTransition={true}
                                              onUpdate={remainingTime => {
                                                if (remainingTime === 10) {
                                                  Vibration.vibrate();
                                                } else if (remainingTime === 1) {
                                                  Vibration.vibrate(1000);
                                                }
                                              }}
                                              onComplete={() => {
                                                Vibration.vibrate();
                                                setIsTimerPlaying(false);
                                              }}
                                            >
                                              {({ remainingTime }) => <Text style={{ color: '#fff', fontSize: 20 }}>{remainingTime}</Text>}
                                            </CountdownCircleTimer>
                                            : null
                                        }
                                      </View>
                                      {
                                        (
                                          gameState === 0 ||
                                          gameState === 1 ||
                                          gameState === 2 ||
                                          gameState === 3 ||
                                          gameState === 5 ||
                                          gameState === 6 ||
                                          gameState === 8 ||
                                          gameState === 10
                                        )
                                          ?
                                          <Pressable
                                            style={{
                                              position: 'absolute',
                                              bottom: 10,
                                              left: 100,
                                              width: 40,
                                              height: 40,
                                              borderWidth: 2,
                                              backgroundColor: '#fff',
                                              zIndex: 50,
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                            }}
                                            onPress={() => {
                                              setIsTimerPlaying(!isTimerPlaying);
                                            }}
                                          >
                                            {
                                              isTimerPlaying === true
                                                ? <Image source={require("./icons/pause.png")} style={{width: 20, height: 20}}/>
                                                : <Image source={require("./icons/play.png")} style={{width: 20, height: 20}}/>
                                            }
                                          </Pressable>
                                          : null
                                      }
                                      <View style={styles.timersContainer}>
                                        {
                                          (
                                            gameState === 0 ||
                                            gameState === 1 ||
                                            gameState === 5 ||
                                            gameState === 3 ||
                                            gameState === 8 ||
                                            gameState === 10
                                          )
                                            ? <Timer time={60} style={styles.timer60}
                                              setDuration={setDuration}
                                              setIsTimerPlaying={setIsTimerPlaying}
                                              setKey={setKey} />
                                            : null
                                        }
                                        {
                                          gameState === 6
                                            ? <Timer time={30} style={styles.timer60}
                                              setDuration={setDuration}
                                              setIsTimerPlaying={setIsTimerPlaying}
                                              setKey={setKey} />
                                            : null
                                        }
                                        {
                                          (
                                            gameState === 0 ||
                                            gameState === 2 ||
                                            gameState === 3
                                          )
                                            ? <Timer time={20} style={styles.timer20}
                                              setDuration={setDuration}
                                              setIsTimerPlaying={setIsTimerPlaying}
                                              setKey={setKey} />
                                            : null
                                        }
                                      </View>
                                      {
                                        showThirdFallModal
                                          ?
                                          <ThirdFallModal />
                                          : null
                                      }
                                    </View>
                                  </SetShowThirdFallModalContext.Provider>
                                </ShowThirdFallModalContext.Provider>
                              </CheckIsGameEndingContext.Provider>
                            </isVoitingDayContext.Provider>
                          </LeaveVotesContext.Provider>
                        </SetSelectedBreakingVoteStateContext.Provider>
                      </SelectedBreakingVoteStateContext.Provider>
                    </SetLeaveVotesContext.Provider>
                  </SetVotedPlayersContext.Provider>
                </VotedPlayersContext.Provider>
              </SetSelectedPlayerContext.Provider>
            </SelectedPlayerContext.Provider>
          </SetGameStateContext.Provider>
        </GameStateContext.Provider>
      </SetPlayersContext.Provider>
    </PlayersContext.Provider>
  );
}

export default App;