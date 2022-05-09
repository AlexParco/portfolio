import {Heading, Box, Stack} from '@chakra-ui/react'
import Image from 'next/image'
import jsIcon from '../public/javascript.svg'
import goIcon from '../public/golang.svg'
import hsIcon from '../public/haskell.svg'
import pyIcon from '../public/python.svg'
import gitIcon from '../public/git.svg'

const SkillIcon = ({_src, _alt}) => {
  return (
    <Box boxSize='50px'>
      <Image 
        src={_src}
        alt={_alt}
        width="100"
        height="100"
      />
    </Box>
  )
} 
const Skills = () => {
  return (
    <Box mb={16}>
      <Heading size="lg" mb={6}>
        Skills
      </Heading>
      <Stack 
        direction='row' 
        spacing='24px'
      >
        <SkillIcon
          _src={jsIcon}
          _alt='javascript'
          />
        <SkillIcon
          _src={goIcon}
          _alt='golang'
        />
        <SkillIcon
          _src={hsIcon}
          _alt='haskell'
        />
        <SkillIcon
          _src={pyIcon}
          _alt='python'
        />
        <SkillIcon
          _src={gitIcon}
          _alt='python'
        />
      </Stack>
    </Box>
  )
} 

export default Skills
