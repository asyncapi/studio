import { FunctionComponent } from "react"
import Tooltip from "../../Tooltip"
import { QuestionMarkCircleIcon } from "../../icons"
export type LabelProps = {
  className?: string
  label: string
  tooltip?: string
}

export const Label: FunctionComponent<LabelProps> = ({ label, className, tooltip }) => {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      <label className={`font-medium text-sm leading-6 ${className}`}>{label}</label>
      {tooltip && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom"> {tooltip} </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  )
}
