import { HStack, Tag, Image, Text, Box, Flex } from "@chakra-ui/react"
import { StackData } from "../../data/stack"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import StackItem from "./StackItem"


interface Stack {
  id: number;
  alt: string;
  src: string;
}

const Stack = () => {
  const [data, setData] = useState<Stack[]>(StackData)

  const handleDragEnd = (event: any) => {
    const {active, over} = event

    if(!active.id !== over.id) {

      const activeIndex = data.findIndex(e => e.id == active.id); 

      const overIndex = data.findIndex(e => e.id == over.id); 

      setData(arrayMove(data, activeIndex, overIndex))
    } 
  }

  return (
    <Flex mt='6' gap='4' wrap='wrap' >
      <DndContext 
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={data.map((e) => e.id)}
        >
        {data.map((stack, index) => (
          <StackItem 
            key={index}
            id={stack.id}
            src={stack.src}
            alt={stack.alt}
          />
        ))}
        </SortableContext>
      </DndContext>
    </Flex>
  )
}

export default Stack