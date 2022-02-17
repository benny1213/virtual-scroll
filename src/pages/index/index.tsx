import React, { useEffect, useState, useRef, useCallback } from 'react';
import './index.less';
import { getListData } from './util';
import useVirtual from './useVirtual';
import { DataStruct } from './interface';
import ListItem from './ListItem';

function Index() {
  const [listData, setListData] = useState<DataStruct[]>([]);

  const parentRef = useRef(null);

  const loadListData = useCallback(async ()=>{
    const listDataRes = await getListData(10);
    setListData(listDataRes)
  }, [])

  useEffect(()=>{
    loadListData();
  }, [loadListData])
  
  const {
    virtualItems,
    totalSize
  } = useVirtual({parentRef, size: listData.length, estimateSize: ()=>50})

  return (
    <div className="list" ref={parentRef}>
      <div 
        className="list-wrap"
        style={{
          height: `${totalSize}px`,
          position: 'relative',
          width: '100%'  
        }}
      >
        {
          virtualItems.map((virtualItem)=>{
            const data = listData[virtualItem.index]
            return <div
              ref={virtualItem.measureRef}
              key={virtualItem.index}
              style={{
                position: 'absolute',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListItem data={data} />
            </div>
          })
        }
      </div>
    </div>
  );
}

export default Index;
