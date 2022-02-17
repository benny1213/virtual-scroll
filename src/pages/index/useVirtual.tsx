import { useEffect, useMemo, useState } from "react";
import useRect from './useRect';

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
  const { size, estimateSize, parentRef } = props;

  const [measuredCache, setMeasuredCache] = useState<number[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);

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

  const { height: outerSize } = useRect(parentRef)

  const range = calculateRange({measurements, scrollOffset, outerSize });
  console.log(`start: ${range.start}, end: ${range.end}`)
  const indexes = useMemo(()=>{
    const indexes = []
    const overScan = 1
    const start = Math.max(range.start - overScan, 0)
    const end = Math.min(range.end + overScan, size - 1)

    for(let i = start; i <= end; i ++ ){
      indexes.push(i);
    }
    return indexes
  },[range, size])

  useEffect(()=>{
    const element = parentRef.current;
    if(!element){
      setScrollOffset(0);
      return
    }

    const onScroll = (event: any) =>{
      setScrollOffset(element.scrollTop)
    }

    element.addEventListener('scroll', onScroll, {
      capture: false,
      passive: true,
    })
    return () => {
      element.removeEventListener('scroll', onScroll)
    }
  },[parentRef])

  const virtualItems = useMemo(()=>{
    const virtualItems: VirtualItem[] = []
    for(let k = 0; k<indexes.length; k++){
      const i = indexes[k]
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
  },[indexes, measurements])

  const totalSize = useMemo(()=>{
    const lastIndex = virtualItems.length - 1;
    return virtualItems[lastIndex]?.end;
  },[virtualItems])

  return {
    virtualItems,
    totalSize
  }
}

const findNearestBinarySearch = (
  low: number, 
  high: number, 
  getCurrentValue: (i:number)=>number, 
  value: number
) => {
  while (low <= high) {
    let middle = ((low + high) / 2) | 0
    let currentValue = getCurrentValue(middle)

    if (currentValue < value) {
      low = middle + 1
    } else if (currentValue > value) {
      high = middle - 1
    } else {
      return middle
    }
  }

  if (low > 0) {
    return low - 1
  } else {
    return 0
  }
}

function calculateRange(
  { 
    measurements, 
    outerSize, 
    scrollOffset 
  }: {
    measurements: any[],
    outerSize: number,
    scrollOffset: number,
  }
) {
  const size = measurements.length - 1
  const getOffset = (index: number) => measurements[index].start

  let start = findNearestBinarySearch(0, size, getOffset, scrollOffset)
  let end = start

  while (end < size && measurements[end].end < scrollOffset + outerSize) {
    end++
  }

  return { start, end }
}


export default useVirtual;