import {
  Box, 
  Stack, 
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import jsIcon from '../public/javascript.svg'
import goIcon from '../public/golang.svg'
import pyIcon from '../public/python.svg'
import gitIcon from '../public/git.svg'

const SkillIcon = ({_src, _alt}) => {
  return (
    <Box flex='1' align='center' h='100' >
      <Image 
        src={_src}
        alt={_alt}
        width="30"
        height="30"
      />
      <Text >
        {_alt}
      </Text>
    </Box>
  )
} 

const Skills = () => {
  return (
    <Box mb={8}>
      <Stack 
        direction='row' 
      >
        <SkillIcon
          _src={jsIcon}
          _alt='JavaScript'
          />
        <SkillIcon
          _src={goIcon}
          _alt='Golang'
        />
        <SkillIcon
          _src={pyIcon}
          _alt='Python'
        />
        <SkillIcon
          _src={gitIcon}
          _alt='Git'
        />
      </Stack>
    </Box>
  )
} 

export default Skills
