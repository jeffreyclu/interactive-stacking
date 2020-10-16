import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

import Block from './Block';

const LevelContainer = styled.div`
  border-top: 1px solid lightgrey;
  box-sizing: border-box;
  padding: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-blockName: flex-start;
  align-items: center;
  width: 100vw;
`;

const LevelLabel = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 4rem;
`;

const LevelTitle = styled.h3`
  padding: 0.5rempx;
`;

const LevelMaxArea = styled.span`
    font-size: 0.5rem;
`;

const LevelCurrentArea = styled.span`
  font-size: 0.5rem;
  color: ${(props) => (props.blockAreas < props.maxArea
    ? 'blue'
    : (props.blockAreas === props.maxArea)
      ? 'green'
      : 'red'
  )};
`;

const RowContainer = styled.div`
  margin-left: 1rem;
  box-sizing: border-box;
  padding: 0.5rem;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : 'white')};
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  width: 80vw;
`;

const Level = ({ level, blocks, data, setData }) => {
  const { levelName, maxArea } = level;
  const blockList = blocks.map((block, i) => <Block key={block.id} block={block} index={i} maxArea={maxArea} level={level} data={data} setData={setData} />);
  const blockAreas = blocks.reduce((prev, curr) => (prev + curr.area), 0);
  return(
    <LevelContainer>
      <LevelLabel>
        <LevelTitle>{levelName}</LevelTitle>
        <LevelCurrentArea
          maxArea={maxArea}
          blockAreas={blockAreas}
        >
          Total area: {blockAreas}
        </LevelCurrentArea>
        <LevelMaxArea>
          Max area: {maxArea}
        </LevelMaxArea>
      </LevelLabel>
      <Droppable 
        droppableId={level.id}
        direction="horizontal"
      >
        {(provided, snapshot) => (
          <RowContainer
            ref={provided.innerRef}
            { ...provided.droppableProps }
            isDraggingOver={snapshot.isDraggingOver}
          >
            {blockList}
            {provided.placeholder}
          </RowContainer>)}
      </Droppable>
      {/* <AddBlock level={level} data={data} setData={setData} blocks={blocks}>
        Add a Block
      </AddBlock> */}
    </LevelContainer>
  )
}

export default Level;
