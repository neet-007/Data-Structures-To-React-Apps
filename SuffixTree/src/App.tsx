import { useEffect, useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import Node from './Node';
import { useTreeContext } from './TreeContext'
import NodeTest from './NodeTest';
import Query from './Query';

function App() {
  const {text, suffixTree, command, suffix, ALPHABET, setText, setCommand, setSuffixArray, setLcpArray, setSuffixTree} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (command > -1){
      return
    };
    setCommand(1);
  },[command])

  function handleClickInput(){
    if (!InputRef.current){
      return
    };
    if (command === 4){
      setSuffixArray([]);
      setLcpArray([]);
      setSuffixTree([{parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, children:Array(ALPHABET.length).fill(-1), charClassName:{char:-1, className:''}, nodeClassName:''}]);
      setText(InputRef.current.value);
      setCommand(-1);
    }else{
      setText(InputRef.current.value);
      setCommand(1);
    }
  };

  function reDrawTree(){
    setCommand(30);
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
            <button disabled={command !== 0 && command !== 4} onClick={handleClickInput}>create</button>
          </div>
            <p>text: {text}</p>
            <p>current suffix: {text.slice(suffix, text.length)}</p>
        </div>

          <Query/>

      <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
        <h3>Suffix Tree</h3>
        <button style={{height:'max-content'}} disabled={command !== 4} onClick={reDrawTree}>re draw tree</button>
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
