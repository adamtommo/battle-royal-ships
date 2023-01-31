import Board from "./Board";
import { ActionInterface } from "../interfaces/BoardInterface";
import { Container } from "react-bootstrap";
import cx from "classnames";
import classes from "../css/Board.module.css";

const BoardSelect = (props: {
    boards: { player: string; board: string[] }[];
    setOppNo: React.Dispatch<ActionInterface>;
    oppNo: number;
}) => {
    console.log(props.boards);
    return (
        <Container>
            {props.boards.map((board, i: number) => {
                return (
                    <div className={classes.container}>
                        <div
                            key={i}
                            onClick={() =>
                                props.setOppNo({
                                    type: "SET_OPPONENT_NO",
                                    payload: i,
                                })
                            }
                            className={
                                props.oppNo === i
                                    ? cx(classes.selecting, classes.turn)
                                    : classes.selecting
                            }
                        >
                            <Board
                                board={board.board}
                                boardNo={i}
                                player="Opponent"
                                tiny={true}
                            />
                        </div>
                    </div>
                );
            })}
        </Container>
    );
};

export default BoardSelect;
