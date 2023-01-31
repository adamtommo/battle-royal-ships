import { useEffect, useState } from "react";

import GridSquare from "./GridSquare";
import { generateEmptyBoard } from "../../utils/BoardFunctions";
import Alert from "react-bootstrap/Alert";

import classes from "../css/Board.module.css";
import cx from "classnames";
import { BoardInterface } from "../interfaces/BoardInterface";

const Board = (props: BoardInterface) => {
    const [board, setBoard] = useState<string[]>(generateEmptyBoard());

    useEffect(() => {
        setBoard(props.board);
    }, [board, props.board]);

    const currentCoord = (i: number, click: boolean) => {
        if (
            click &&
            props.turn &&
            props.player === "Opponent" &&
            board[i] === "empty" &&
            props.fire
        ) {
            console.log(`FIRE`);
            props.fire(i);
        }
    };

    return (
        <>
            {props.tiny ? null : <Alert variant="dark">{props.player}</Alert>}
            <div
                className={
                    props.turn && props.player === "Opponent"
                        ? cx(classes.board, classes.turn)
                        : classes.board
                }
                style={props.tiny ? { width: "100px", height: "100px" } : {}}
            >
                {props.boardNo !== undefined
                    ? props.board.map((state: string, i: number) => {
                          return (
                              <GridSquare
                                  currentCoord={currentCoord}
                                  key={i}
                                  index={i}
                                  state={state}
                                  tiny={props.tiny}
                              />
                          );
                      })
                    : null}
            </div>
        </>
    );
};

export default Board;
