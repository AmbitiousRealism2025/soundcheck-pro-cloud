import { clsx } from 'clsx'
import { ButtonHTMLAttributes } from 'react'

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const { className, variant='primary', ...rest } = props
  return <button className={clsx('button', className)} {...rest} />
}
