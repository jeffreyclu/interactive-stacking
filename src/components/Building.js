import React, { useEffect, useState } from 'react';
import Level from './Level';

const Building = React.forwardRef(({ data, setData }, ref) => {
  // state hook
  const [levels, setLevels] = useState([]);

  // hook to map data into components
  useEffect(() => {
    console.log('mapping components')
    if (!data) return;
    const initiallevels = data.levelOrder.map((levelId, i) => {
      const level = data.levels[levelId];
      const blocks = level.blockIds.map((blockId) => data.blocks[blockId]);
  
      return <Level key={level.id} level={level} blocks={blocks} data={data} setData={setData} />;
    })
    setLevels(initiallevels);
  }, [data, setData]);

  return (
    <div ref={ref}>
      {levels}
    </div>
  )
})

export default Building;
