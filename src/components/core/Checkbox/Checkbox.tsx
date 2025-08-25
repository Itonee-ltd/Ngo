import "./Checkbox.css"

interface Props {
  label?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (checked: boolean) => void
  id: string
  className?: string
  checked: any
  disabled?: boolean
}

export const Checkbox = ({ label, onChange, id, className, checked, disabled }: Props) => {
  return (
    <div className={`${className} flex items-center cursor-pointer text-body`}>
      <input
        checked={checked}
        disabled={disabled}
        type="checkbox"
        data-testid={`checkbox-${id}`}
        id={id}
        className={`${disabled ? "cursor-default" : "cursor-pointer"} shrink-0`}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      {label && (
        <label htmlFor={id} className={`text-base font-normal ml-[12px] cursor-pointer w-full`}>
          {label}
        </label>
      )}
    </div>
  )
}
