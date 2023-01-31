import classes from "../css/GridSquare.module.css";
import cx from "classnames";
import { GridSquareInterface } from "../interfaces/BoardInterface";

const GridSquare = (props: GridSquareInterface) => {
    return (
        <div
            onMouseEnter={() =>
                props.tiny
                    ? null
                    : props.currentCoord(props.index, false, false)
            }
            onMouseLeave={() =>
                props.tiny ? null : props.currentCoord(-1, false, false)
            }
            onContextMenu={(e) => {
                if (props.tiny) {
                    return;
                }
                e.preventDefault();
                props.currentCoord(props.index, false, true);
            }}
            onClick={() =>
                props.tiny ? null : props.currentCoord(props.index, true, false)
            }
            className={cx(
                classes.gridSquare,
                `${classes[props.state.toLowerCase()]}`
            )}
            style={props.tiny ? { width: "10px", height: "10px" } : {}}
        ></div>
    );
};

export default GridSquare;
