export interface BoardInterface {
    player: string;
    turn?: boolean;
    board: string[];
    boardNo: number | undefined;
    fire?: (index: number | undefined) => void;
    tiny: boolean;
}

export interface FleetInterface {
    onShipSelect: React.Dispatch<ActionInterface>;
    onStart: () => void;
}

export interface ShipFleetInterface {
    name: string;
    length: number;
    placed: boolean;
}

export interface GridSquareInterface {
    state: string;
    index: number;
    currentCoord: (i: number, click: boolean, rotate: boolean) => void;
    tiny: boolean;
}

export interface CalculateOverhangInterface {
    position: number;
    length: number;
    orientation: string;
}

export interface SetBoardInterface {
    selectedShip: string;
    onShipSelect: React.Dispatch<ActionInterface>;
    setInitialBoard: React.Dispatch<ActionInterface>;
}

export interface GameBoardInterface {
    board: string[];
}

export interface SetBoardShipInterface {
    name: string;
    location: number[];
}

export interface ActionInterface {
    type:
        | "SET_GAME_STATE"
        | "SET_FULL_ERROR"
        | "SET_DISCONNECT_ERROR"
        | "SET_WAITING"
        | "SET_YOUR_TURN"
        | "SET_WINNER"
        | "SET_LOSER"
        | "SET_ROOMS"
        | "SET_YOU"
        | "SET_OPPONENT"
        | "SET_SELECTED_SHIP"
        | "SET_YOU_NO"
        | "SET_OPPONENT_NO"
        | "SET_PLAYER_TOTAL"
        | "SET_READY_TOTAL";
    payload: any;
}

export interface StateInterface {
    you: string[];
    youNo: number;
    oppNo: number | undefined;
    opponents: { player: string; board: string[] }[];
    gameState: "intro" | "setup" | "play";
    fullError: boolean;
    disconnectError: boolean;
    waiting: boolean;
    yourTurn: boolean;
    winner: boolean;
    loser: boolean;
    rooms: string[];
    selectedShip: string;
    playerTotal: undefined | number;
    readyTotal: undefined | number;
}
