import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import DeleteBlock from './DeleteBlock';

const BlockContainer = styled.div`
  flex: 0 1 auto;
  border-radius: 0.3rem;
  border: 1px solid grey;
  padding: 0.5rem;
  margin: 0 0.1rem;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : `${props.color}`)};
  color: ${(props) => {
    let color = 'black';
    switch (props.color) {
      case 'purple':
        color = 'white';
        break;
      case 'blue':
        color = 'white';
        break;
      default:
        break;
    }
    return `${color}`;
  }};
  transition: background-color 0.1s ease;
  display: flex;
  flex-flow: column nowrap;
  width: ${(props) => {
    if (props.blockName.includes('mechanical')) return '100vw';
    if (props.area >= 4000) return `${props.area / 1000}rem`;
    return '5rem'
  }};
  min-width: 5rem;
  height: 3rem;
  position: relative;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const BlockArea = styled.span`
  font-size: 0.5rem;
  padding: 0.5rem;
`;

const Block = ({ block, index, level, data, setData }) => {
  const { blockName, id, area, color } = block;
  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided, snapshot) => (
        <BlockContainer
          ref={provided.innerRef}
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
          isDragging={snapshot.isDragging}
          area={area}
          color={color}
          blockName={blockName}
        >
          <Bold>
            {blockName}
          </Bold>
         {area && <BlockArea>
            Area: {area}
          </BlockArea>}
          <DeleteBlock 
            block={block}
            level={level}
            data={data}
            setData={setData}
          />
        </BlockContainer>)}
    </Draggable>
  );
}

export default Block;
