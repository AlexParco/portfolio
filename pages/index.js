import { 
  Box,
  Heading, 
  Text,
  Button,
  SimpleGrid,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'

import NextLink from 'next/link'
import { ChevronRightIcon } from '@chakra-ui/icons'

import MainLayout from '../layouts/main.js'
import Skills from '../components/skills.js'

export default function Home () {
  return (
    <MainLayout>
        <Box borderRadius='lg' mb={16}>
          <Heading as='h1' size="lg" mb={3} >
            Alexander Parco
          </Heading>
          <Text>
            Hello, I&apos;m developer from Lima, Peru who is mainly interest in Linux, Golang, Haskell, javaScript, Funcional programming, web deveploment  and others interesting things
          </Text>
          <Text mt={6}>
            My curiosity makes me able to quickly learn new tools and technologies when needed.
            I enjoy sharing my knowledge and helping others when possible.
          </Text>
        </Box>

        <Skills/>

        <Heading size="lg" mb={6}>
          Popular Works
        </Heading>
        <SimpleGrid 
          w='100%'
          columns={[1, 2]} 
          gap={6}
        >

          <Box w="100%" >
            <LinkBox as='article'>
              <Box width='100%' h='120px' bg='blackAlpha.200' ></Box>
              <Heading size='md' my='2'>
                <LinkOverlay href='#'>
                  New Year, New Beginnings: Smashing Workshops & Audits
                </LinkOverlay>
              </Heading>
              <Text mb={3}>
                Catch up on what’s been cookin’ at Smashing and explore some of the most
                popular community resources.
              </Text>
              <NextLink href='https://facebook.com/' >
                <Button width='100%' variant='outline' >Visit</Button>
              </NextLink>
            </LinkBox>
          </Box>
          <Box w="100%" >
            <LinkBox as='article'>
              <Box width='100%' h='120px' bg='blackAlpha.200' ></Box>
              <Heading size='md' my='2'>
                <LinkOverlay href='#'>
                  New Year, New Beginnings: Smashing Workshops & Audits
                </LinkOverlay>
              </Heading>
              <Text mb={3}>
                Catch up on what’s been cookin’ at Smashing and explore some of the most
                popular community resources.
              </Text>
              <NextLink href='https://facebook.com/' >
                <Button width='100%' variant='outline' >Visit</Button>
              </NextLink>
            </LinkBox>
          </Box>
        </SimpleGrid>

        <Box align="center" my={8}>
          <NextLink href="/works" scroll={false}>
            <Button rightIcon={<ChevronRightIcon/>} variant='outline'>
              Portfolio
            </Button>
          </NextLink>
        </Box>


    </MainLayout>
  )
}

