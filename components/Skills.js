import { useState } from 'react'
import { motion } from 'framer-motion'
import { FadeContainer, popUp } from '../lib/FramerMotionVariants'
import skills from '@/data/skills'

const Skills = () => {
  // State to handle which skill's tooltip is active
  const [activeSkill, setActiveSkill] = useState(null)

  // Function to show tooltip
  const handleTooltip = (skillName) => {
    setActiveSkill(skillName)
  }

  // Function to hide tooltip
  const hideTooltip = () => {
    setActiveSkill(null)
  }

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
        {skills.map((skill, index) => (
          <motion.div
            title={skill.name}
            variants={popUp}
            key={skill.name}
            onMouseEnter={() => handleTooltip(skill.name)}
            onMouseLeave={hideTooltip}
            onTouchStart={() => handleTooltip(skill.name)}
            onTouchEnd={hideTooltip}
            className="dark:bg-darkPrimary group relative flex origin-center transform items-center justify-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-neutral-700 hover:dark:bg-darkSecondary sm:justify-start md:origin-top"
          >
            <div className="pointer-events-none relative select-none transition group-hover:scale-110 sm:group-hover:scale-100">
              <skill.logo className="h-8 w-8" />
              {activeSkill === skill.name && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded-md bg-black px-2 py-1 text-xs text-white">
                  {skill.name}
                </div>
              )}
            </div>
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
