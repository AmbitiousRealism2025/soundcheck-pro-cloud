import Input from './Input'
export default function DateTimeField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input placeholder="YYYY-MM-DDTHH:mm:ss.sssZ" {...props} />
}
