import { useState } from 'react'
import ToolsGrid from '@/components/molecules/ToolsGrid'
import { PageSEO } from '@/components/atoms/SEO'
import siteMetadata from '/data/siteMetadata'
import { AiFillApple, AiOutlineMacCommand, AiOutlineDesktop } from 'react-icons/ai'
import { Analytics } from '@vercel/analytics/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tools() {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <>
      <PageSEO title={`Tools - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="divide-y divide-gray-700">
        <div className="flex flex-col items-center ">
          <div className="space-y-2 pb-3 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Tools I Use
            </h1>
          </div>
          <div className="flex cursor-pointer flex-wrap content-center justify-around gap-12">
            <div
              onClick={() => setCurrentTab(0)}
              className={
                currentTab === 0
                  ? 'flex items-center rounded-lg border p-2'
                  : 'bg-grey-100 flex items-center rounded-lg p-2'
              }
            >
              <AiFillApple />
              <span>iOS</span>
            </div>
            <div
              onClick={() => setCurrentTab(1)}
              className={
                currentTab === 1
                  ? 'flex items-center rounded-md border p-2'
                  : 'bg-grey-100 flex items-center rounded-md p-2'
              }
            >
              <AiOutlineMacCommand />
              <span>macOS</span>
            </div>
            <div
              onClick={() => setCurrentTab(2)}
              className={
                currentTab === 2
                  ? 'flex items-center rounded-md border p-2'
                  : 'bg-grey-100 flex items-center rounded-md p-2'
              }
            >
              <AiOutlineDesktop />
              <span>Web</span>
            </div>
          </div>
          <AnimatePresence exitBeforeEnter>
            {currentTab === 0 && (
              <motion.div
                key="ios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="container py-12">
                  <div className="-m-4 flex flex-wrap justify-center">
                    <ToolsGrid filter="ios" />
                  </div>
                </div>
              </motion.div>
            )}
            {currentTab === 1 && (
              <motion.div
                key="mac"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="container py-12">
                  <div className="-m-4 flex flex-wrap justify-center">
                    <ToolsGrid filter="mac" />
                  </div>
                </div>
              </motion.div>
            )}
            {currentTab === 2 && (
              <motion.div
                key="web"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="container py-12">
                  <div className="-m-4 flex flex-wrap justify-center">
                    <ToolsGrid filter="web" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Analytics />
    </>
  )
}
