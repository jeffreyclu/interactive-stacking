import React, { useState } from 'react';
import styled from 'styled-components';
import '@atlaskit/css-reset';

const AddBlockContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-left: 1px solid lightgrey;
`;

const AddBlockForm = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const AddBlockButton = styled.div`
  border-radius: 50%;
  background-color: lightgrey;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  font-weight: bold;
  padding: 0.5rem;
  opacity: 0;
  &:hover {
    opacity: 100;
  }
  transition: opacity 0.5s ease;
`;

const AddBlockFormRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AddBlockFormLabel = styled.label`
  font-size: 1rem;
  padding: 0 0.5rem;
`;

const AddBlockFormInput = styled.input`
  border: 1px solid lightgrey;
`;

const SubmitBlockButton = styled.div`
  font-weight: bold;
  background-color: lightgrey;
  border-radius: 0.2rem;
`;

const AddBlock = ({ level, data, setData }) => {
  const [blockName, setBlockName] = useState('');
  const [blockArea, setBlockArea] = useState(0);
  const [blockColor, setBlockColor] = useState('#ffffff');
  const [showForm, setShowForm] = useState(false);
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
      {showForm && <AddBlockForm>
        <AddBlockFormRow>
          <AddBlockFormLabel>
           Name:
          </AddBlockFormLabel>
          <AddBlockFormInput onChange={(e) => setBlockName(e.target.value)} type="text" />
        </AddBlockFormRow>
        <AddBlockFormRow>
          <AddBlockFormLabel>
            Area:
          </AddBlockFormLabel>
          <AddBlockFormInput onChange={(e) => setBlockArea(Number(e.target.value))} type="number" />
        </AddBlockFormRow>
        <AddBlockFormRow>
          <AddBlockFormLabel>
            Color:
          </AddBlockFormLabel>
          <AddBlockFormInput onChange={(e) => setBlockColor(e.target.value)} type="color" value="#ffffff"/>
        </AddBlockFormRow>
      </AddBlockForm>}
      {
        showForm
          ? (<><SubmitBlockButton onClick={addBlock}>
              Add Block
            </SubmitBlockButton>
            <AddBlockButton onClick={() => setShowForm(false)}>
              -
            </AddBlockButton></>)
          : (<AddBlockButton onClick={() => setShowForm(true)}>
              +
            </AddBlockButton>)
      }
      
    </AddBlockContainer>
    </>
  )
}

export default AddBlock;
