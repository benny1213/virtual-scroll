import { useMemo, useState } from "react";

interface useVirtualProps {
  parentRef: React.MutableRefObject<any>,
  size: number,
  estimateSize: (index: number)=>number,
}

interface VirtualItem {
  start: number,
  size: number,
  end: number,
  index: number,
  measureRef: (el: any) => void
}

const useVirtual = (props: useVirtualProps)=>{
  const { size, estimateSize } = props;

  const [measuredCache, setMeasuredCache] = useState<number[]>([])

  const measurements = useMemo(()=>{
    const measurements = []
    for(let i = 0; i < size; i++ ){
      const measuredSize = measuredCache[i]
      const start:number = measurements[i - 1] ? measurements[i - 1].end : 0
      const size = measuredSize ? measuredSize : estimateSize(i)
      const end = start + size
      measurements[i] = {start, size, end}
    }
    return measurements
  },[estimateSize, measuredCache, size])

  const virtualItems = useMemo(()=>{
    const virtualItems: VirtualItem[] = []
    for(let i = 0; i<size; i++){
      const measurement = measurements[i];
      virtualItems[i] = {
        index: i,
        ...measurement,
        measureRef: (el)=>{
          if(el){
            const masuredSize:number = el.offsetHeight
            if(masuredSize !== virtualItems[i].size){
              setMeasuredCache((old: any)=>[
                ...old,
                masuredSize
              ])
            }
          }
        }
      }
    }
    return virtualItems
  },[measurements, size])

  const totalSize = useMemo(()=>{
    const lastIndex = virtualItems.length - 1;
    return virtualItems[lastIndex]?.end;
  },[virtualItems])

  return {
    virtualItems,
    totalSize
  }
}

export default useVirtual;