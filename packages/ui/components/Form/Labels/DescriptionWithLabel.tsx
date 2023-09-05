import { Description } from './Description'
import { Label } from './Label'

type DescriptionWithLabelProps = {
  className?: string
  label: string
  description: string
}

export const DescriptionWithLabel = ({ className, label, description }: DescriptionWithLabelProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label label={label} />
      <Description text={description} />
    </div>
  )
}
