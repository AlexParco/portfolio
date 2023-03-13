import { Box } from "@chakra-ui/react"
import SnippetsGrid from "../components/SnippetsGrid/snippetsgrid"

const SnippetsPage = () => {
  return (
    <Box
      maxW='850px'
      minH='90vh'
      pt={4}
      px={10}
    >
      <SnippetsGrid />
    </Box>
  )
}
export default SnippetsPage 