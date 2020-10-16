import React from 'react';
import styled from 'styled-components';

const DeleteBlockContainer = styled.div`
  position: absolute;
  top: -0.1rem;
  right: 0.3rem;
  font-weight: bold;
`;

const DeleteBlock = ({ block, level, data, setData }) => {
  const deleteBlock = () => {
    // duplicate the data state
    const newData = { ...data };

    // remove the current block from the block
    delete newData.blocks[block.id];
    
    // duplicate the current level
    const currentLevelId = level.id;
    const currentLevel = { ...data.levels[currentLevelId]};

    // get the index of the the current block in the blockIds array and delete it
    const index = currentLevel.blockIds.indexOf(block.id);
    currentLevel.blockIds.splice(index, 1);

    // update the new state with the info
    newData.levels[currentLevelId] = currentLevel;
    setData(newData);
    return;
  };
  return(
    <DeleteBlockContainer onClick={deleteBlock}>
      x
    </DeleteBlockContainer>
  )
}

export default DeleteBlock;
