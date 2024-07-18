import { ComponentProps, forwardRef, useCallback, useEffect, useRef, useState } from 'react'

interface DynamicHeightInputProps extends ComponentProps<'div'>{
    passedLabel:string;
    passedPlaceHolder?:string;
};

function updateTextAreaHeight(textarea?:HTMLTextAreaElement){
    if (textarea){
        textarea.style.height = '0';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };
};

const DynamicHeightInput = forwardRef<HTMLDivElement, DynamicHeightInputProps>(({passedLabel, passedPlaceHolder, ...props}, ref) => {
    const [textInput, setTextInput] = useState<string>('');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const textAreaRefCallBack = useCallback((textarea:HTMLTextAreaElement) =>{
        updateTextAreaHeight(textarea);
        textAreaRef.current = textarea;
    },[]);

    useEffect(() => {
        if (textAreaRef.current){
            updateTextAreaHeight(textAreaRef.current);
        };
    },[textInput])

    return (
        <div ref={ref} style={{display:'flex', alignItems:'center'}} {...props}>
            <label htmlFor={`text-area-${passedLabel}`}>{passedLabel}</label>
            <textarea onChange={(e) => setTextInput(e.target.value)} name={`text-area-${passedLabel}`} id={`text-area-${passedLabel}`}
             ref={textAreaRefCallBack} placeholder={passedPlaceHolder}></textarea>
        </div>
    )
})

export default DynamicHeightInput