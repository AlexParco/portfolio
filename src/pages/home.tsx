import { Box, VStack , Heading, Flex } from '@chakra-ui/react'
import Experience from '../components/Experience/Experience'
import IntroSection from '../components/IntroSection/IntroSection'
import Profile from '../components/Profile/Profile'
import Stack from '../components/Stack/Stack'
import WorksGrid from '../components/WorksGrid/WorksGrid'
import SnippetsGrid from '../components/SnippetsGrid/snippetsgrid'

const Home = () => {
  return (
    <Box
      mt='0px !important'
      maxW='850px'
      minH='100vh'
      pt={20}
      px={10}
      pb={8}
      borderLeft={'1px'}
      borderRight={'1px'}
      shadow='xs'
      borderStyle='groove'
    >
      <IntroSection />
      <Profile />
      <Stack />
      <Experience />
      <Box mt={4} id='work'>
        <Heading size='lg'>Proyectos</Heading>
        <WorksGrid max={4} />
      </Box>
      <Box mt={8}>
        <Heading size='lg'>Fragmentos</Heading>
        <SnippetsGrid max={4}/>
      </Box>
    </Box>
  )
}

export default Home