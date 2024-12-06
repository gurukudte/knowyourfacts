import GoogleSheetLayout from '@/components/googlesheets/layout'
import  { ReactNode } from 'react'

type Props = {
    children:ReactNode
}

const layout = ({children}: Props) => {
  return (
    <GoogleSheetLayout>
        {children}
    </GoogleSheetLayout>
  )
}
export default layout