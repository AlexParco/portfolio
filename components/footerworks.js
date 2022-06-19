import { 
  SimpleGrid,
  LinkBox,
  Text,
  Box,
  LinkOverlay,
  Heading,
  Button,
} from '@chakra-ui/react'

import NextLink from 'next/link'

const FooterWorks = () => {
  return (
    <>
      <Heading size="lg" mb={6}>
        Popular Works
      </Heading>
      <SimpleGrid 
        w='100%'
        columns={[1, 2]} 
        gap={6}
      >
        <GridBox/>
        <GridBox/>
      </SimpleGrid>
    </>
  )
}
export default FooterWorks

const GridBox = () => {
  return (
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
  )
}
