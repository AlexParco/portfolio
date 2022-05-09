import { 
  Box,
  Heading, 
  Text,
  Button
} from '@chakra-ui/react'

import NextLink from 'next/link'

import { ChevronRightIcon } from '@chakra-ui/icons'

import MainLayout from '../layouts/main.js'
import Skills from '../components/skills.js'
import FooterWorks from '../components/footerworks.js'

export default function Home () {
  return (
    <MainLayout>
        <Box borderRadius='lg' mb={16}>
          <Heading as='h1' size="lg" mb={3} >
            Alexander Parco
          </Heading>
          <Text>
            Hi there, I&apos;m Alexander Parco. I&apos;m developer. My interest are; Linux, Golang, Haskell, javaScript, Funcional programming, and others interesting things
          </Text>
        </Box>

        <Skills/>

        <FooterWorks/>

        <Box align="center" my={4}>
          <NextLink href="/works" scroll={false}>
            <Button rightIcon={<ChevronRightIcon/>} variant='outline'>
              Portfolio
            </Button>
          </NextLink>
        </Box>

    </MainLayout>
  )
}

