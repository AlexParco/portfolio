import { Box, Flex, Stack, HStack } from "@chakra-ui/react"
import { SnippetsData } from "../../data/snippets"
import Snippet from "../snippet/snippet"
import { FunctionComponent } from "react"

interface Props  {
  max?: number;
}

const SnippetsGrid: FunctionComponent<Props> = ({ max = SnippetsData.length }) => {
  return (
    <HStack
      pt={2}
      gap={10}
      justify='space-between'
      my='5'>
      {
        SnippetsData.slice(0, max).map((snpt, index) => (
          <Snippet key={index}
            title={snpt.title}
            date={snpt.date} />
        ))
      }
    </HStack>
  )
}
export default SnippetsGrid