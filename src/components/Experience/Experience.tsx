import {
  Box,
  Collapse,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from "react";
import { ExperienceData } from "../../data/experience";
import ExperienceItem from "./ExperienceItem";

const Experience = () => {
  const { isOpen, onToggle } = useDisclosure()
  const [exp, setExp] = useState(ExperienceData)

  const handleDragEnd = (event: any) => {
    const {active, over} = event

    if(!active.id !== over.id) {
      const activeIndex = exp.findIndex(e => e.id == active.id); 

      const overIndex = exp.findIndex(e => e.id == over.id); 

      setExp(arrayMove(exp, activeIndex, overIndex))
    } 
  }

  return (
    <Box mt={10}>
      <Heading size='lg'>Experiencia</Heading>
      <HStack>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={exp.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {exp.map((exp, index) => (
              <ExperienceItem
                src={exp.src}
                key={index}
                title={exp.title}
                company={exp.company}
                date={exp.date}
                id={exp.id}
               />
            ))}
          </SortableContext>
        </DndContext>
      </HStack>
    </Box>
  )
}

export default Experience