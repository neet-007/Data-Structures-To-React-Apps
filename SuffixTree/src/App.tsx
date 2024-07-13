import { useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import Node from './Node';
import { useTreeContext } from './TreeContext'
import NodeTest from './NodeTest';

function App() {
  const {text, suffixTree, command, suffix, query, setText, setCommand, setQuery} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef<HTMLInputElement>(null);

  function handleClickInput(){
    if (!InputRef.current){
      return
    };
    setText(InputRef.current.value);
    setCommand(1);
  };

  function handleClickQuery(){
    if (!queryRef.current){
      return
    };
    setQuery(queryRef.current.value);
    setCommand(5);
  };

  console.log(suffixTree);

  return (
    <div style={{position:'relative'}}>
      {command > 0 &&
        <SuffixArray/>
      }
      {command > 1 &&
        <LcpArray/>
      }

        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div>
            <input type="text" ref={InputRef}/>
            <button disabled={command > 0} onClick={handleClickInput}>create</button>
          </div>
            <p>text: {text}</p>
            <p>current suffix: {text.slice(suffix, text.length)}</p>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div>
            <input type="text" ref={queryRef}/>
            <button disabled={command <= 3} onClick={handleClickQuery}>query</button>
          </div>
            <p>query: {query}</p>
            <p>results: {text.slice(suffix, text.length)}</p>
        </div>
      <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {command > 2 &&
          <NodeTest node={suffixTree[0]} adjustedHeight={0}/>
        }
      </div>
    </div>
  )
}

export default App
