import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Icon,
  Stack,
  Link
} from "@chakra-ui/react"
import { Link as ReachLink, useLocation } from "react-router-dom"
import { FaAsterisk } from "react-icons/fa"

const NavBar = () => {
  const href = useLocation().pathname.slice(1)
  console.log(href)

  return (
    <Box
      w='100%'
      maxW='850px'
    >
      <HStack
        m={3}
        py={3}
        px={8}
        bg={"#242424"}
        color={"#F1F1F1"}
        borderRadius={12}
        justify='space-between'
        alignItems='center'
        boxShadow={'md'}
      >
        <HStack
          gap={3}
        >
          <Link to="/" as={ReachLink}
            _hover={{
              textDecoration: 'none'
            }}
          >
            Home
            {
              href === "" && <Box style={{ borderWidth: 1, borderColor: "#F1f1f1" }} />
            }
          </Link>
          <Link to="/works" as={ReachLink}
            _hover={{
              textDecoration: 'none'
            }}
          >
            Works
            {
              href === "works" && <Box style={{ borderWidth: 1, borderColor: "#F1f1f1" }} />
            }
          </Link>
          <Link to="/snippets" as={ReachLink}
            _hover={{
              textDecoration: 'none'
            }}
          >
            Snippets
            {
              href === "snippets" && <Box style={{ borderWidth: 1, borderColor: "#F1f1f1" }} />
            }
          </Link>
        </HStack>
        {/* <HStack justify='center' align='center'> */}
        <Icon
          mt={0.3}
          as={FaAsterisk}
        />
        {/* <Heading size='md'>Alex-Dev</Heading> */}
        {/* </HStack> */}
      </ HStack>
    </Box>
  )
}

export default NavBar