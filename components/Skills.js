import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer, popUp } from '@/lib/animation/FramerMotionVariants'
import skills from '@/data/skills'

const Skills = () => {
  const [activeSkill, setActiveSkill] = useState(null)

  const handleTooltip = (skillName) => {
    setActiveSkill(skillName)
  }

  const hideTooltip = () => {
    setActiveSkill(null)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.skill-element')) {
        hideTooltip()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      <span className="font-poppins title-font text-3xl font-bold">Skills</span>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={FadeContainer}
        viewport={{ once: true }}
        className="my-10 grid grid-cols-4 gap-4"
      >
        {skills.map((skill) => (
          <motion.div
            title={skill.name}
            variants={popUp}
            key={skill.name}
            onClick={() => handleTooltip(skill.name)}
            className="skill-element dark:bg-darkPrimary group relative flex origin-center transform items-center justify-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-neutral-700 hover:dark:bg-darkSecondary sm:justify-start md:origin-top"
          >
            <div className="pointer-events-none select-none transition group-hover:scale-110 sm:group-hover:scale-100">
              <skill.logo className="h-8 w-8" />
            </div>
            {activeSkill === skill.name && (
              <div className="tooltip absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-md bg-black px-2 py-1 text-xs text-white">
                {skill.name}
              </div>
            )}
            <p className="pointer-events-none hidden select-none text-sm font-semibold sm:inline-flex md:text-base">
              {skill.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </>
  )
}

export default Skills
