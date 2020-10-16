import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import { exportComponentAsPDF } from 'react-component-export-image';

import '@atlaskit/css-reset';
import './App.css';
import Building from './../Building';

// const initialData = {
//   blocks: {
//     'block-1': { id: 'block-1', blockName: 'block 1', area: 9000, color: 'red'},
//     'block-2': { id: 'block-2', blockName: 'block 2', area: 10000, color: 'blue'},
//     'block-3': { id: 'block-3', blockName: 'block 3', area: 7500, color: 'purple'},
//   },
//   levels: {
//     'level-1': {
//       id: 'level-1',
//       levelName: 'Level 1',
//       blockIds: ['block-1'],
//       maxArea: 23500,
//     },
//     'level-2': {
//       id: 'level-2',
//       levelName: 'Level 2',
//       blockIds: ['block-2', 'block-3'],
//       maxArea: 23500,
//     },
//   },
//   levelOrder: ['level-2', 'level-1'],
// }

const BuildingContainer = styled.div`
  margin-top: 4rem;
`;

const PrintButton = styled.button`
  margin-top: 2rem;
`;

function App() {
  /**
   * function to handle end of dragging
   */
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

    // if we're in the same level
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
    return;
  }

  // state hooks
  const [data, setData] = useState();
  
  // hook to fetch data
  useEffect(() => {
    console.log('fetching data');
    (async () => {
      const respLevels = await fetch(`${process.env.REACT_APP_LEVELS_LINK}`);
      const fetchedLevels = await respLevels.json();
      if (!fetchedLevels) return;
      const respBlocks = await fetch(`${process.env.REACT_APP_BLOCKS_LINK}`);
      const fetchedBlocks = await respBlocks.json();
      if (!fetchedBlocks) return;

      const fetchedLevelsArr = fetchedLevels.values;
      const levelsHeaders = fetchedLevelsArr.shift();
      const levels = {};
      const levelOrder = [];
      fetchedLevelsArr.forEach((val) => {
        const level = {};
        for (let i = 0; i < levelsHeaders.length; i += 1) {
          level[levelsHeaders[i]] = val[i];
        };
        level['blockIds'] = [];
        levels[val[0]] = level;
        levelOrder.push(val[0]);
      })

      const fetchedBlocksArr = fetchedBlocks.values;
      const blocksHeaders = fetchedBlocksArr.shift();
      const blocks = {};
      fetchedBlocksArr.forEach((val) => {
        const block = {};
        const blockLevel = val.pop();
        for (let i = 0; i < blocksHeaders.length - 1; i += 1) {
          if (blocksHeaders[i] === 'area') block[blocksHeaders[[i]]] = Number(val[i]);
          else block[blocksHeaders[i]] = val[i];
        };
        blocks[val[0]] = block;
        levels[blockLevel].blockIds.push(val[0]);
      })

      const state = {
        blocks,
        levels,
        levelOrder,
      }
      console.log(state)
      setData(state);
    })();
  }, [])

  
  const myRef = useRef();

  return (
    <div className="App">
      <h1>Stacking Diagram</h1>
      <BuildingContainer>
        <DragDropContext 
          // onDragStart={onDragStart}
          // onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}
        >
          <Building data={data} setData={setData} ref={myRef} />
          <PrintButton onClick={() => exportComponentAsPDF(myRef)}>
            Print to PDF
          </PrintButton>
        </DragDropContext>
      </BuildingContainer>
    </div>
  );
}

export default App;
