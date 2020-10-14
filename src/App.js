import React, { useEffect, useState } from 'react';
import '@atlaskit/css-reset';
import './App.css';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialData = {
  blocks: {
    'block-1': { id: 'block-1', blockName: 'block 1', area: 9000, color: 'red'},
    'block-2': { id: 'block-2', blockName: 'block 2', area: 10000, color: 'blue'},
    'block-3': { id: 'block-3', blockName: 'block 3', area: 7500, color: 'purple'},
    'block-4': { id: 'block-4', blockName: 'block 4', area: 4000, color: 'green'},
    'block-5': { id: 'block-5', blockName: 'block 5', area: 5000, color: 'pink'},
    'block-6': { id: 'block-6', blockName: 'block 6', area: 6000, color: 'yellow'},
    'block-7': { id: 'block-7', blockName: 'block 7', area: 1000, color: 'grey'},
    'block-8': { id: 'block-8', blockName: 'block 8', area: 2000, color: 'teal'},
    'block-9': { id: 'block-9', blockName: 'block 9', area: 5000, color: 'pink'},
    'block-10': { id: 'block-10', blockName: 'block 10', area: 4000, color: 'green'},
  },
  levels: {
    'level-1': {
      id: 'level-1',
      title: 'Level 1',
      blockIds: ['block-1', 'block-2', 'block-3', 'block-4'],
      maxArea: 23500,
    },
    'level-2': {
      id: 'level-2',
      title: 'Level 2',
      blockIds: ['block-5', 'block-6'],
      maxArea: 23500,
    },
    'level-3': {
      id: 'level-3',
      title: 'Level 3',
      blockIds: ['block-7', 'block-8'],
      maxArea: 23500,
    },
    'level-4': {
      id: 'level-4',
      title: 'Level 4',
      blockIds: ['block-9', 'block-10'],
      maxArea: 23500,
    },
  },
  levelOrder: ['level-4', 'level-3', 'level-2', 'level-1'],
}

const BuildingContainer = styled.div`
  margin-top: 4rem;
`;

const LevelContainer = styled.div`
  border-top: 1px solid lightgrey;
  padding: 0.5rem;
  display: flex;
  flex-flow: row nowrap;
  justify-blockName: flex-start;
  align-items: center;
`;

const RowContainer = styled.div`
  margin-left: 1rem;
  padding: 0.5rem;
  background-color: ${(props) => (props.isDraggingOver ? 'lightgrey' : 'white')};
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  width: 100vw;
`;

const BlockContainer = styled.div`
  border-radius: 0.3rem;
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
  width: ${(props) => (props.area >= 3000 
    ? `${props.area / 600}rem` 
    : "5rem"
  )};
  min-height: 3rem;
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

const Bold = styled.span`
  font-weight: bold;
`;

const BlockArea = styled.span`
  font-size: 0.5rem;
  padding: 0.5rem;
`;

/**
 * component representing a level (vertical)
 */
const Level = ({ level, blocks }) => {
  const { title, maxArea } = level;
  const blockList = blocks.map((block, i) => <Block key={block.id} block={block} index={i} maxArea={maxArea} />);
  const blockAreas = blocks.reduce((prev, curr) => (prev + curr.area), 0);
  return(
      <LevelContainer>
        <LevelLabel>
          <LevelTitle>{title}</LevelTitle>
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
        
      </LevelContainer>
  )
}

/**
 * component representing a block (horizontal)
 */
const Block = ({ block, index }) => {
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
        >
          <Bold>
            {blockName}
          </Bold>
          <BlockArea>
            Area: {area}
          </BlockArea>
        </BlockContainer>)}
    </Draggable>
  );
}

function App() {
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // if the user doesn't actually drag it, exit out
    if (!destination) return;

    // if the user drops it back in the same place, exit out
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    // locate the current level, duplicate the blockIds array, and then swap the dragged component (source) index with the destination index
    const start = data.levels[source.droppableId];
    const finish = data.levels[destination.droppableId];

    if (start === finish) {
      const newBlockIds = Array.from(start.blockIds);
      newBlockIds.splice(source.index, 1);
      newBlockIds.splice(destination.index, 0, draggableId);

      // establish a new level with the new blockIds array
      const newLevel = {
        ...start,
        blockIds: newBlockIds,
      };

      // establish a new data state and use the setData hook to set the data
      const newData = {
        ...data,
        levels: {
          ...data.levels,
          [newLevel.id]: newLevel,
        },
      };

      setData(newData);
      return;
    }

    // moving from one level to another
    const startBlockIds = Array.from(start.blockIds);
    startBlockIds.splice(source.index, 1);
    const newStart = {
      ...start,
      blockIds: startBlockIds,
    };

    const finishBlockIds = Array.from(finish.blockIds);
    finishBlockIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      blockIds: finishBlockIds,
    }
    
    const newData = {
      ...data,
      levels: {
        ...data.levels,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    }

    setData(newData);
  }

  const [data, setData] = useState();
  const [levels, setlevels] = useState([]);

  // hook to fetch data
  useEffect(() => {
    setTimeout(() => console.log('fetching data'), 1000);
    const fetchedData = initialData;
    if (!fetchedData) return;
    setData(fetchedData);
  }, [])

  // hook to map data into components
  useEffect(() => {
    if (!data) return;
    const initiallevels = data.levelOrder.map((levelId, i) => {
      const level = data.levels[levelId];
      const blocks = level.blockIds.map((blockId) => data.blocks[blockId]);
  
      return <Level key={level.id} level={level} blocks={blocks} />;
    })
    setlevels(initiallevels);
  }, [data]);

  return (
    <div className="App">
      <h1>Stacking Diagram</h1>
      <BuildingContainer>
        <DragDropContext 
          // onDragStart={onDragStart}
          // onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}
        >
          {levels}
        </DragDropContext>
      </BuildingContainer>
    </div>
  );
}

export default App;