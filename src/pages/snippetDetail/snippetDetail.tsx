import { Box } from "@chakra-ui/react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { SnippetsData } from "../../data/snippets"
import EasBuild from "./details/EasBuild"

const SnippetDetail = () => {
  const { title } = useParams<{ title: string }>()
  const [doc, setDoc] = useState(SnippetsData.filter(e => e.title === title))
  console.log(title, SnippetsData)
  console.log(doc)

  return (
    <Box
      maxW='850px'
      minH='90vh'
      pt={4}
      px={10}
    >
      <EasBuild />

    </Box>
  )
}
export default SnippetDetail