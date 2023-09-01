type DescriptionProps = {
  className?: string
  text: string
}

export const Description = ({ className, text }: DescriptionProps) => {
  return <p className={`text-sm leading-5 text-gray-400 ${className}`}>{text}</p>
}
