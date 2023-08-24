import { Tag, Image, Text } from "@chakra-ui/react"
import { useSortable } from "@dnd-kit/sortable"
import { FunctionComponent } from "react"
import { CSS } from "@dnd-kit/utilities";

const StackItem: FunctionComponent<Props> = ({id, src, alt}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isDragging ? '2px solid #fff' : '',
  }

  return (
    <div ref={setNodeRef} >
       
      <Tag  
        style={style}
        {...attributes}
        {...listeners}
        margin={0} 
        w={'130px'}
        p={2} 
        cursor='grab' gap='2' className='stack' bg='#242424' color="#F3F3E9"
      >
        <Image alt={alt} boxSize='20px' src={src} />
        <Text as='b' >{alt}</Text>
      </Tag>
    </div>
  )

}

export default StackItem

interface Props {
  id: number;
  alt: string;
  src: string;
}