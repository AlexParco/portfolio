import { Box, Heading } from "@chakra-ui/react"
import WorksGrid from "../components/WorksGrid/WorksGrid"
import { WorksData } from "../data/works"

const WorkPage = () => {

  return (
    <Box
      mt='0px !important'
      maxW='850px'
      minH='100vh'
      pt={20}
      px={10}
    >
      <Heading size='lg'>Proyectos</Heading>
      <WorksGrid max={WorksData.length} />
    </Box>
  )
}

export default WorkPage
