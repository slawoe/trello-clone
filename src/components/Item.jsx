import {useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Window from "./Window";
import {ItemTypes} from "../data/types";

const Item = ({ item, index, moveItem, status }) => {
    const ref = useRef(null);
    const [, drop] = useDrop({
        type: ItemTypes.TASK,
        accept: ItemTypes.TASK,
        hover(item, monitor) {
            const dragIndex = item.index;
            const hoverIndex = index;
            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;
            
            if (!ref.current) {
                return
            }

            if (dragIndex === hoverIndex) {
                return
            }


            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TASK,
        item: { type: ItemTypes.TASK, ...item, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    const [show, setShow] = useState(false);
    const onOpen = () => setShow(true);
    const onClose = () => setShow(false);

    drag(drop(ref));

    return (
        <>
            <div
                ref={ref}
                style={{ opacity: isDragging ? 0 : 1 }}
                className={"item"}
                onClick={onOpen}
            >
                <div className={"color-bar"} style={{ backgroundColor: status.color }}/>
                <p className={"item-title"}>{item.content}</p>
                <p className={"item-status"}>{item.icon}</p>
            </div>
            <Window
                item={item}
                onClose={onClose}
                show={show}
            />
        </>
    );
};

export default Item;