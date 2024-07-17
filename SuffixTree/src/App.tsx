import { useEffect, useRef, useState } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import Node from './Node';
import { useTreeContext } from './TreeContext'
import Query from './Query';
import Modal from './modal/Modal';
import { modalOverlayClick } from './utils/functions';

const SKIP_COMMANDS = ['SA', 'LCP', 'ST'] as const

function App() {
  const {text, suffixTree, command, suffix, ALPHABET, skipCommands:skipCommands_, setText, setCommand, setSuffixArray, setLcpArray, setSuffixTree, setSkipCommands, setALPHABET} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);
  const alphabetRef = useRef<HTMLInputElement>(null);
  const alphabetSortRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (command > -1){
      return
    };
    setCommand(skipCommands_[0] ? 1000 : 1);
  },[command])

  function handleAlphabetSet(){
    if (!alphabetRef.current || !alphabetSortRef.current){
      return
    };
    const arr = alphabetRef.current.value.split(',').filter(x => x !== '');
    if (arr.length !== Math.floor(alphabetRef.current.value.length / 2) + 1){
      alert('there are more commas that there should be');
      return
    };

    if (alphabetSortRef.current.checked){
      arr.sort();
    };

    setALPHABET(arr);
  };

  function handleClickInput(){
    if (!InputRef.current || !formRef.current){
      return
    };
    setText(InputRef.current.value.endsWith('$') ? InputRef.current.value : InputRef.current.value + '$');

    const skipCommands = Array(SKIP_COMMANDS.length).fill(false);
    for (let i = 0; i < formRef.current!.children.length; i++){
      const inputElem = formRef.current!.children[i].children[1] as HTMLInputElement
      skipCommands[i] = inputElem.checked
    };
    setSkipCommands(skipCommands);

    if (command === 4){
      setSuffixArray([]);
      setLcpArray([]);
      setSuffixTree([{parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, children:Array(ALPHABET.length).fill({index:-1, currChar:-1, clasName:''}), nodeClassName:''}]);
      setCommand(-1);
    }else{
      setCommand(skipCommands[0] ? 1000 : 1);
    };
  };

  function reDrawTree(){
    setCommand(30);
  };

  return (
    <div onClick={(e) => modalOverlayClick(e, setIsOpen)} style={{position:'relative'}}>
        <SuffixArray/>
        <LcpArray/>

        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div>
            <label htmlFor="">text</label>
            <input type="text" ref={InputRef}/>
            <button disabled={command !== 0 && command !== 4} onClick={handleClickInput}>create</button>
            <button>options</button>
            <div>
              <div>
                <label htmlFor="">set alphabet</label>
                <input type="text" placeholder='type each charecter separeted by a coma ,' ref={alphabetRef}/>
                <button onClick={handleAlphabetSet}>set</button>
                <button onClick={() => setALPHABET(['$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm','n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])}>
                  reset default
                </button>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <label htmlFor={'alphbet-sort'}>sort</label>
                    <input ref={alphabetSortRef} type="checkbox" id={'alphbet-sort'} name={'alphbet-sort'}/>
                  </div>
              </div>
            </div>
          </div>
          <form ref={formRef} style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            {SKIP_COMMANDS.map((v, i) => (
              <div key={`skip-commands-${v}-${i}`} style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                <label htmlFor={`skip-${v}`}>skip {v}</label>
                <input type="checkbox" id={`skip-${v}`} name={`skip-${v}`}/>
              </div>
            ))}
          </form>
          <p>text: {text}</p>
          <p>current suffix: {text.slice(suffix, text.length)}</p>
        </div>

          <Query/>

      <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
        <h3>Suffix Tree</h3>
        <button style={{height:'max-content'}} disabled={command !== 4} onClick={reDrawTree}>redraw tree</button>
        <button onClick={() => setIsOpen(true)}>I</button>
      </div>

      <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Node node={suffixTree[0]} adjustedHeight={0}/>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='suffix tree'/>
    </div>
  )
}

export default App
