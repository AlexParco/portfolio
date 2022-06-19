import { 
  Link, 
  Box, 
  Container, 
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorMode,
} from '@chakra-ui/react'

import NextLink from 'next/link'

import { useRouter } from 'next/router'

import { HamburgerIcon } from '@chakra-ui/icons'

import ThemeButton from './themebutton.js'

const NavLink = ({children, _href, path, ...props }) => {
  const active = path == _href

  return (
    <NextLink
      href={_href}
      passHref 
      scroll={false} 
    >
        <Link
          fontWeight={active? 'bold' : undefined}
          {...props}
        >
          {children}
        </Link>
    </NextLink>
  )
}


const NavBar = () => {
  const router = useRouter()
  const { colorMode } = useColorMode()

  return (
    <Box 
      as="nav" 
      position="fixed" 
      w="100%"
      bg={colorMode === 'light' ? 'white' : '#141414'}
      zIndex={1}
    >
      <Container 
        display="flex"
        p={2}
        pt={4}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Stack
          mr={5} 
          ml={2} 
          direction={{base: 'column', sm:'row'}}
          spacing='24px'
          display={{ base: 'none', sm: 'flex' }}
          width={{ base: 'full', sm: 'auto' }}
          alignItems="center"
          flexGrow={1}
          mt={{sm: 0}}
        >
          <NavLink _href='/' path={router.asPath}>
            Home
          </NavLink>
          <NavLink _href='/works' path={router.asPath}>
            Works
          </NavLink>
          <NavLink _href='/blogs' path={router.asPath}>
            Blogs
          </NavLink>
          <NavLink 
            _href='https://github.com/alexparco/portfolio' 
            target='_blank' 
            path='source'
          >
            Source
          </NavLink>
        </Stack>

        <Box flex={1} align='right' mr={2}>
          <ThemeButton />
          <Box ml={2} display={{ base: 'inline-block', sm: 'none' }}>
            <Menu>
              <MenuButton 
                variant='outline'
                as={IconButton} 
                icon={<HamburgerIcon/>} 
                aria-label='Menu'
              >
              </MenuButton>

              <MenuList>
                <NextLink href='/' passHref>
                  <MenuItem as={Link}>Home</MenuItem>
                </NextLink>
                <NextLink href='/works' passHref>
                  <MenuItem as={Link}>Works</MenuItem>
                </NextLink>
                <NextLink href='/blogs' passHref>
                  <MenuItem as={Link}>Blogs</MenuItem>
                </NextLink>
                <NextLink href='https://github.com/alexparco/portfolio' passHref>
                  <MenuItem as={Link}>Source</MenuItem>
                </NextLink>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default NavBar 
