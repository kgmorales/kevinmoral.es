import Link from '@/components/atoms/Link'
import Tag from '@/components/atoms/Tag'
import siteMetadata from '@/data/siteMetadata'
import { useState } from 'react'
import Pagination from '@/components/atoms/Pagination'
import formatDate from '@/lib/utils/formatDate'
import { motion } from 'framer-motion'

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((frontMatter) => {
    const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="flex w-full flex-col items-center divide-y divide-gray-700">
        <div className="flex flex-col items-center  space-y-2 pb-8 md:space-y-5">
          <h1 className="tracking-tighttext-gray-100 text-3xl font-extrabold leading-9 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative flex w-full flex-col items-center justify-center">
            <input
              aria-label="Search articles"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles"
              className="block w-[full] w-full rounded-lg border border-gray-900 bg-gray-800 px-4 py-2 text-gray-100 focus:border-primary-500 focus:ring-primary-500"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <motion.li key={slug} className="py-3 " whileHover={{ scale: 1.02 }}>
                <article className="space-y-2  p-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`/blog/${slug}`} className="text-gray-100">
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-400">{summary}</div>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </ul>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
