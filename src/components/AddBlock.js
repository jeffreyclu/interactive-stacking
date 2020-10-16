import React, { useState } from 'react';
import styled from 'styled-components';

const AddBlockContainer = styled.div`
    display: flex;
`;

const AddBlockButton = styled.div`
  padding: 0.5rem;
`;

const AddBlock = ({ level, data, setData }) => {
  const [blockName, setBlockName] = useState('');
  const [blockArea, setBlockArea] = useState(0);
  const [blockColor, setBlockColor] = useState('#ffffff');
  const addBlock = () => {
    // validate the input
    if (!blockName.length) return;

    // get id from the last block
    const dataBlocks = Object.keys(data.blocks);
    const lastBlock = dataBlocks[dataBlocks.length - 1];
    const lastBlockIdArr = lastBlock ? lastBlock.split("-") : undefined;
    const lastBlockId = lastBlockIdArr ? lastBlockIdArr[lastBlockIdArr.length - 1] : 0;

    // create a new block
    const newBlockId = `block-${Number(lastBlockId) + 1}`;
    const newBlock = {
      id: newBlockId,
      blockName: blockName,
      area: blockArea,
      color: blockName.includes('mechanical') ? 'grey' : blockColor,
    };

    // duplicate the blocks store and add the new block
    const newBlocks = { ...data.blocks };
    newBlocks[newBlockId] = newBlock;

    // duplicate the blockIds array of the current level and push the new block id onto it
    const currentLevelId = level.id;
    const newBlockIds = Array.from(data.levels[currentLevelId].blockIds);
    newBlockIds.push(newBlockId);

    //duplicate the state and add the new info to it
    const newData = { 
      ...data,
      blocks: newBlocks,
      levels: {
        ...data.levels,
        [currentLevelId]: {
          ...data.levels[currentLevelId],
          blockIds: newBlockIds,
        }
      }
    };
    setData(newData);
    return;
  };

  return (
    <>
    <AddBlockContainer>
      <div>
        <input onChange={(e) => setBlockName(e.target.value)} type="text" />
        <input onChange={(e) => setBlockArea(Number(e.target.value))} type="number" />
        <input onChange={(e) => setBlockColor(e.target.value)} type="color" value="#ffffff"/>
      </div>
      <AddBlockButton onClick={addBlock}>
        +
      </AddBlockButton>
    </AddBlockContainer>
    </>
  )
}

export default AddBlock;
