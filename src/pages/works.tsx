import { Box, Heading } from "@chakra-ui/react"
import WorksGrid from "../components/WorksGrid/WorksGrid"
import { WorksData } from "../data/works"

const WorkPage = () => {

  return (
    <Box
      maxW='850px'
      minH='90vh'
      pt={4}
      px={10}
    >
      <Heading size='lg'>Proyectos</Heading>
      <WorksGrid max={WorksData.length} />
    </Box>
  )
}

export default WorkPage
