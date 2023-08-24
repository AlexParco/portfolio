import { HStack, Stack, Image, Box, Text } from "@chakra-ui/react"
import { useSortable } from "@dnd-kit/sortable"
import { FunctionComponent } from "react"
import { CSS } from "@dnd-kit/utilities";
import { ModalExp } from "./ModalExp";

interface Prop {
  title: string
  company: string
  date: string
  id: number
  src: string
}

const ExperienceItem: FunctionComponent<Prop> = ({
  title,
  company,
  date,
  id,
  src
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging
  } = useSortable({id: id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
      <Stack
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        bg='#FFF'
        maxW={"350px"}
        borderWidth='1px'
        rounded='md'
        my={'5'}
        p={'4'}
        _hover={{
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
        }}
      >
        <HStack align='flex-start' >
          <Image
            boxSize={'55px'}
            src={src}
            alt={title}
          />
          <Box>
            <Text fontWeight='semibold'>{title}</Text>
            <Text fontSize='15px'>{company}</Text>
            <Text fontSize='15px'>{date}</Text>
          </Box>
        </HStack>
      </Stack>
  )
}

export default ExperienceItem