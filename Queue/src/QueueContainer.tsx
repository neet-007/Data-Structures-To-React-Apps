import React, {ComponentProps, useMemo, useRef, useState} from 'react'
import LeftBracket from './LeftBracket'
import RightBracket from './RightBracket'
import StackItem from './QueueItem'

type QueueItemType = {val:string | number, className:string}

interface StackContainerProps extends ComponentProps<'div'>{

}

const StackContainer:React.FC<StackContainerProps> = ({children, ...props}) => {
  const [queue, setQueue] = useState<(QueueItemType)[]>(Array.from({length:3}).map(() => ({val:-1, className:''})))
  const [lastPoppedItem, setLastPoppedItem] = useState<QueueItemType | undefined>(undefined)
  const [start, setStart] = useState(-1)
  const [end, setEnd] = useState(-1)
  const [peakState, setPeakState] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const StackContainerRef = useRef<HTMLDivElement>(null)

  let renderQueue = useMemo(() => {
    const temp = []
    let i = start;
    while (true){
      if (i === end){
        temp.push(queue[i]);
        break
      };
      temp.push(queue[i]);
      i = (i + 1) % queue.length;
    };

    return temp
  },[start, end, queue.length])

  function push(item:string | number){
      if(isFull()){
          resize(item);
          return;
      };
      setQueue(prev => {
        let className = 'last-queue-item ';
        if(isEmpty()){
          setStart(prev => prev + 1);
          className += 'first-queue-item';
        }
        else{
          if (prev[end].className === 'last-queue-item first-queue-item'.replace('/\s/g', '')){
            prev[end].className = 'first-queue-item';
          }
          else{
            prev[end].className = '';
          };
        }
        let end_ = (end + 1) % queue.length;
        setEnd(end_);
        prev[end_] = {val:item, className};
        return [...prev]
      });
  };

  function pop(){
      if (isEmpty()){
          throw Error('queue is empty');
      };
      setQueue(prev => {
        const temp = prev[start];
        if (start === end){
            setStart(-1);
            setEnd(-1);
        }
        else{
            prev[(start + 1) % queue.length].className = 'first-queue-item';
            setStart(prev_ => (prev_ + 1) % prev.length);
        };
        setLastPoppedItem(temp);
        setPeakState(true);
        return [...prev];
      });
  };

  function peak(){
      if (isEmpty()){
          throw Error('queue is empty');
      };
      if (peakState && StackContainerRef.current){
        StackContainerRef.current.children[StackContainerRef.current.children.length - 2].innerHTML = renderQueue[renderQueue.length - 1].val.toString();
      }
      else if(StackContainerRef.current){
        StackContainerRef.current.children[StackContainerRef.current.children.length - 2].innerHTML = `item ${renderQueue.length}`
      };
      setPeakState(prev => !prev);
  };

  function isEmpty(){
      return start === -1;
  };

  function isFull(){
      return (end + 1) % queue.length === start;
  };

  function resize(item:string | number){
     setQueue(prev => {
      const temp = Array.from({length:queue.length * 2}).map(() => ({val:'', className:''} as QueueItemType));
      let i = 0;
      let j = start;

      do {
          temp[i] = prev[j];
          i ++;
          j = (j + 1) % prev.length;
      } while (j !== end);

      temp[i] = prev[end];
      temp[i].className = '';
      temp[i + 1] = {val:item, className:'last-queue-item'};
      setStart(0);
      setEnd(i + 1);
      return [...temp];
     });
  };

  return (
    <section {...props}>
        <div ref={StackContainerRef} style={{display:'flex', gap:'1rem', alignItems:'center', justifyContent:'flex-start'}}>
            <LeftBracket/>
                {!isEmpty() &&
                renderQueue.map((item, index) => {
                    return <StackItem className={item.className} onClick={index === 0 ? pop:() => {}}
                    style={{cursor:'pointer'}} key={`${index}-${item}-stack-item`} val={`item ${index + 1}`}/>
                })}

            <RightBracket/>
        </div>
        <div style={{display:'flex', alignItems:'start', justifyContent:'space-between'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                <button onClick={() => push(inputRef.current?.value!)}>push</button>
                <input type="text" ref={inputRef}/>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
              <button onClick={() => peak()}>{peakState ? 'peak': 'unpeak'}</button>
              <p>{start === end ? 'queue is empty':`stack has ${queue.length} items`}</p>
            </div>
            <div>
              <p>last popped item</p>
              <p>{lastPoppedItem?.val}</p>
            </div>
        </div>
    </section>
  )
}

export default StackContainer