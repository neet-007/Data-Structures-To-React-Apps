import { useEffect, useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import { useTreeContext } from './TreeContext'
import Query from './Query';
import SuffixTree from './SuffixTree';
import DynamicHeightInput from './DynamicHeightInput';

const SKIP_COMMANDS = ['SA', 'LCP', 'ST'] as const

function App() {
  const {text, command, suffix, ALPHABET, skipCommands:skipCommands_, setText, setCommand, setSuffixArray, setLcpArray, setSuffixTree, setSkipCommands, setALPHABET} = useTreeContext();
  const InputRef = useRef<HTMLDivElement>(null);
  const alphabetRef = useRef<HTMLDivElement>(null);
  const alphabetSortRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
    const inputElem = alphabetRef.current.children[1] as HTMLInputElement;
    const arr = inputElem.value.split(',').filter(x => x !== '');
    if (arr.length !== Math.floor(inputElem.value.length / 2) + 1){
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
    const inputElem = InputRef.current.children[1] as HTMLInputElement
    setText(inputElem.value.endsWith('$') ? inputElem.value : inputElem.value + '$');

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

  return (
    <div className='position-relative p-2-rem'>
        <div className='flex justify-content-between'>
          <div>
            <SuffixArray/>
            <LcpArray/>
          </div>
          <div className='b-1-black b-3-radius p-1-rem'>
            <div className='flex flex-direction-column gap-2-rem'>
              <h1 className='capitalize'>suffix tree visualizer</h1>
              <div>
                <div className='flex align-items-center gap-2-rem'>
                  <DynamicHeightInput passedLabel='text' ref={InputRef}/>
                  <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={handleClickInput}>create</button>
                </div>
                <form ref={formRef} className='flex align-items-center gap-1-rem'>
                {SKIP_COMMANDS.map((v, i) => (
                  <div key={`skip-commands-${v}-${i}`} className='flex align-items-center gap-1-rem'>
                    <label htmlFor={`skip-${v}`}>skip {v}</label>
                    <input type="checkbox" id={`skip-${v}`} name={`skip-${v}`}/>
                  </div>
                ))}
                </form>
                <div>text: {text}</div>
                <div>current suffix: {text.slice(suffix, text.length)}</div>
              </div>
              <div>
                  <div className='flex align-items-center gap-2-rem'>
                    <DynamicHeightInput passedLabel='set alphabet' passedPlaceHolder='enter the chars separetd by comma ,' ref={alphabetRef}/>
                    <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={handleAlphabetSet}>set</button>
                    <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={() => setALPHABET(['$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm','n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])}>
                      reset default
                    </button>
                  </div>
                    <div className='flex align-items-center gap-2-rem'>
                      <label htmlFor={'alphbet-sort'}>sort</label>
                      <input ref={alphabetSortRef} type="checkbox" id={'alphbet-sort'} name={'alphbet-sort'}/>
                    </div>
              </div>
              <Query/>
            </div>
          </div>
        </div>

        <SuffixTree/>
    </div>
  )
}

export default App
