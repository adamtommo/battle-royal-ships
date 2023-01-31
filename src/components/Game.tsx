import { useEffect, useReducer, useRef } from "react";
import SetBoard from "./board/SetBoard";
import Fleet from "./board/Fleet";
import Board from "./board/Board";
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import { WelcomeScreen } from "./WelcomeScreen";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../WS";
import { ActionInterface, StateInterface } from "./interfaces/BoardInterface";
import BoardSelect from "./board/BoardSelect";

const Game = () => {
    const initialState: StateInterface = {
        you: [],
        youNo: 0,
        oppNo: 0,
        opponents: [{ player: "DUMMY", board: [] }],
        rooms: [],
        selectedShip: "",
        gameState: "intro",
        fullError: false,
        disconnectError: false,
        waiting: false,
        yourTurn: false,
        winner: false,
        loser: false,
        readyTotal: undefined,
        playerTotal: undefined,
    };

    const gameReducer = (state: StateInterface, action: ActionInterface) => {
        switch (action.type) {
            case "SET_ROOMS":
                return { ...state, rooms: action.payload };
            case "SET_SELECTED_SHIP":
                return { ...state, selectedShip: action.payload };
            case "SET_GAME_STATE":
                return { ...state, gameState: action.payload };
            case "SET_FULL_ERROR":
                return { ...state, fullError: action.payload };
            case "SET_DISCONNECT_ERROR":
                return { ...state, disconnectError: action.payload };
            case "SET_WAITING":
                return { ...state, waiting: action.payload };
            case "SET_YOUR_TURN":
                return { ...state, yourTurn: action.payload };
            case "SET_WINNER":
                return { ...state, winner: action.payload };
            case "SET_LOSER":
                return { ...state, loser: action.payload };
            case "SET_YOU":
                return { ...state, you: action.payload };
            case "SET_OPPONENT":
                return { ...state, opponents: action.payload };
            case "SET_YOU_NO":
                return { ...state, youNo: action.payload };
            case "SET_OPPONENT_NO":
                return { ...state, oppNo: action.payload };
            case "SET_PLAYER_TOTAL":
                return { ...state, playerTotal: action.payload };
            case "SET_READY_TOTAL":
                return { ...state, readyTotal: action.payload };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL, {
        onOpen() {
            console.log("Connection Established");
        },
    });

    const setRoom = (room: string, multiplayer: boolean) => {
        sendJsonMessage({
            action: "room",
            room: room,
            multiplayer: multiplayer,
        });
    };

    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) {
            if (!lastMessage) {
                return;
            }
            const message = JSON.parse(lastMessage.data);
            const type = message.type;

            if (type === "room") {
                if (message.allowed) {
                    dispatch({ type: "SET_GAME_STATE", payload: "setup" });
                    dispatch({
                        type: "SET_PLAYER_TOTAL",
                        payload: undefined,
                    });
                } else {
                    dispatch({ type: "SET_FULL_ERROR", payload: true });
                }
            }
            if (type === "rooms") {
                dispatch({ type: "SET_ROOMS", payload: message.rooms });
            }
            if (type === "kick") {
                window.onload = () =>
                    dispatch({ type: "SET_DISCONNECT_ERROR", payload: true });
                window.location.reload();
            }
            if (type === "start") {
                dispatch({
                    type: "SET_OPPONENT",
                    payload: message.opponentBoards,
                });
                dispatch({ type: "SET_GAME_STATE", payload: "play" });
                dispatch({ type: "SET_WAITING", payload: false });
            }
            if (type === "turn") {
                dispatch({ type: "SET_YOUR_TURN", payload: !state.yourTurn });
            }
            if (type === "setYou") {
                dispatch({ type: "SET_YOU", payload: message.player });
            }
            if (type === "setOpponent") {
                dispatch({ type: "SET_OPPONENT", payload: message.player });
            }
            if (type === "win") {
                dispatch({ type: "SET_WINNER", payload: true });
            }
            if (type === "lose") {
                dispatch({ type: "SET_LOSER", payload: true });
            }
            if (type === "playerTotal") {
                dispatch({
                    type: "SET_PLAYER_TOTAL",
                    payload: message.playerTotal,
                });
            }
            if (type === "readyTotal") {
                dispatch({
                    type: "SET_READY_TOTAL",
                    payload: message.readyTotal,
                });
                console.log(message.readyTotal);
            }
            if (type === "endgame") {
                dispatch({
                    type: "SET_GAME_STATE",
                    payload: "endgame",
                });
            }
        } else {
            isMounted.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage]);

    const sendInitial = () => {
        dispatch({ type: "SET_WAITING", payload: true });
        dispatch({ type: "SET_GAME_STATE", payload: "waiting" });

        //Sometimes sends the last ship placed as forbidden, this is to prevent this.
        const boardCheck = state.you;
        console.log(boardCheck);
        boardCheck.board.forEach((square: string, i: number) => {
            if (square === "forbidden") {
                boardCheck.board[i] = "ship";
            }
        });
        dispatch({ type: "SET_YOU", payload: boardCheck });

        sendJsonMessage({
            action: "setBoard",
            player: JSON.stringify(state.you),
        });
    };

    const fire = (i: number | undefined) => {
        if (state.gameState !== "endgame") {
            sendJsonMessage({
                action: "fire",
                where: i,
                player: state.opponents[state.oppNo].player,
            });
        }
    };

    return (
        <>
            {state.gameState === "play" || state.gameState === "endgame" ? (
                <>
                    <Modal show={state.winner}>
                        <Modal.Body>
                            <Alert variant="success"> You WIN!</Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => {
                                    dispatch({
                                        type: "SET_WINNER",
                                        payload: false,
                                    });
                                }}
                            >
                                Return
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={state.loser}>
                        <Modal.Body>
                            <Alert variant="danger"> You LOSE!</Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => {
                                    dispatch({
                                        type: "SET_LOSER",
                                        payload: false,
                                    });
                                }}
                            >
                                Return
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : null}
            {state.waiting ? (
                <Alert variant="info"> Waiting to start</Alert>
            ) : null}
            {state.disconnectError ? (
                <Alert
                    variant="warning"
                    onClose={() =>
                        dispatch({
                            type: "SET_DISCONNECT_ERROR",
                            payload: false,
                        })
                    }
                    dismissible
                >
                    {" "}
                    Player Disconnected
                </Alert>
            ) : null}
            {state.fullError ? (
                <Alert
                    variant="danger"
                    onClose={() =>
                        dispatch({ type: "SET_FULL_ERROR", payload: false })
                    }
                    dismissible
                >
                    {" "}
                    Room has started!
                </Alert>
            ) : null}
            {state.gameState === "intro" ? (
                <WelcomeScreen
                    refreshRooms={() => sendJsonMessage({ action: "getRoom" })}
                    setRoomName={setRoom}
                    roomsList={state.rooms}
                />
            ) : null}
            <Container>
                <Row>
                    <Col xs={2}>
                        {state.gameState === "setup" ? (
                            <Fleet
                                onShipSelect={dispatch}
                                onStart={sendInitial}
                            />
                        ) : null}
                    </Col>
                    <Col md="auto">
                        {state.gameState === "setup" ? (
                            <SetBoard
                                selectedShip={state.selectedShip}
                                onShipSelect={dispatch}
                                setInitialBoard={dispatch}
                            />
                        ) : null}

                        {state.gameState === "play" ||
                        state.gameState === "endgame" ? (
                            <Board
                                board={state.you.board}
                                player="You"
                                turn={state.yourTurn}
                                fire={fire}
                                tiny={false}
                                boardNo={state.youNo}
                            />
                        ) : null}
                    </Col>
                    <Col md="auto">
                        {(state.gameState === "play" ||
                            state.gameState === "endgame") &&
                        state.oppNo !== undefined ? (
                            <Board
                                board={state.opponents[state.oppNo].board}
                                player="Opponent"
                                turn={state.yourTurn}
                                fire={fire}
                                tiny={false}
                                boardNo={state.oppNo}
                            />
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    {state.readyTotal !== undefined &&
                    state.gameState === "waiting" ? (
                        <>
                            <p>Ready: {state.readyTotal}</p>
                            <p>Players Joined:{state.playerTotal}</p>
                        </>
                    ) : null}
                    {state.readyTotal === state.playerTotal &&
                    state.playerTotal > 1 ? (
                        <Button
                            size="lg"
                            onClick={() => {
                                sendJsonMessage({ action: "start" });
                                dispatch({
                                    type: "SET_READY_TOTAL",
                                    payload: undefined,
                                });
                                dispatch({
                                    type: "SET_GAME_STATE",
                                    payload: "play",
                                });
                            }}
                        >
                            Start
                        </Button>
                    ) : null}
                    {state.gameState === "play" ||
                    state.gameState === "endgame" ? (
                        <BoardSelect
                            boards={state.opponents}
                            setOppNo={dispatch}
                            oppNo={state.oppNo}
                        />
                    ) : null}
                </Row>
            </Container>
        </>
    );
};

export default Game;
