import { FunctionComponent } from 'react'

type IconButtonProps = {
  className?: string
  icon: FunctionComponent<any>
  onClick?: () => void
  text?: string
}

export const IconButton = (props: IconButtonProps) => {
  return (
    <button className={`flex items-center gap-2 text-gray-500  ${props.className}`} onClick={props.onClick}>
      <props.icon className="w-10 h-10" />
      {props.text && <span className="leading-4 text-sm font-normal">{props.text}</span>}
    </button>
  )
}
