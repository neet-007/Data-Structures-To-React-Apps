import React, {ComponentProps} from 'react'

interface StackItemProps extends ComponentProps<'div'>{
    val:string | number
};

const StackItem:React.FC<StackItemProps> = ({val, ...props}) => {
  return (
    <div {...props}>
        {val}
    </div>
  )
}

export default StackItem