import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'
import NavBar from '../components/navbar.js'
import Footer from '../components/footer.js'

const MainLayout = ({ children }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <title>Alexander Parco</title>
      </Head>

      <NavBar/>

      <Container pt={24} maxW='container.md'>
        {children}

        <Footer/>
      </Container>
    </Box>
  )
}

export default MainLayout
