import { 
  SimpleGrid,
  Box,
  Divider,
  List,
  ListItem,
} from '@chakra-ui/react'
import Link from 'next/link'

const Footer = () => {
  return (
    <Box as='footer' mt={10}>
      <Divider color='blackAlpha.k' orientation='horizontal' />
      <SimpleGrid columns={[2,3]} gap={6} mt={10}>
        <List w='100%' spacing={3}>
          <ListItem>
            <Link href="/" >Home</Link><br/>
          </ListItem>
          <ListItem>
            <Link href="/works" >Works</Link>
          </ListItem>
          <ListItem>
            <Link href="https://github.com/alexparco/portfolio" >Source</Link>
          </ListItem>
        </List>
        <List w='100%' spacing={3} >
          <ListItem>
          <Link href="https://twitter.com/alexparco8" >Twitter</Link>
          </ListItem>
          <ListItem>
          <Link href="https://www.linkedin.com/in/alexander-parco-flores-1b830b227/" >Linkedin</Link>
          </ListItem>
          <ListItem>
          <Link href="mailto:alexparco16@gmail.com" >Email</Link>
          </ListItem>
        </List>
        <List w='100%' spacing={3} >
          <ListItem>
            <Link href="https://github.com/alexparco/portfolio" >Contact me</Link>
          </ListItem>
        </List>
      </SimpleGrid>
    </Box>
  )
}
export default Footer
