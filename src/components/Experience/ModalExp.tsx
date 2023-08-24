import { FunctionComponent } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Text,
  Button
} from '@chakra-ui/react'

interface Props {
  title: string
  body: string
  children: React.ReactNode;
}

export const ModalExp: FunctionComponent<Props> = ({title, body, children}) => {

  return(
    <Popover isLazy>
      <PopoverTrigger>
        <>
        {children}
        </>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{title}</PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
