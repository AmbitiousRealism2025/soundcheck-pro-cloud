import { InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { className, ...rest } = props
  return <input ref={ref} className={['input', className].filter(Boolean).join(' ')} {...rest} />
})
export default Input
