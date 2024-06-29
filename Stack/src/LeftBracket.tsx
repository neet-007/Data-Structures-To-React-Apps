import React, {ComponentProps} from "react"

export interface BracketProprs extends ComponentProps<'svg'>{
    height?:string;
    width?:string;
}

const LeftBracket:React.FC<BracketProprs> = ({height='96', width='96'}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} viewBox="0 0 96 96"><rect x="0" y="0" width="96" height="96" fill="#FFFFFF"></rect><g transform="translate(39.048, 60)"><path d="M12.24 12L5.66 12 5.66-36 12.24-36 12.24-34.08 7.58-34.08 7.58 10.08 12.24 10.08 12.24 12Z" fill="#404040"></path></g></svg>
  )
}

export default LeftBracket