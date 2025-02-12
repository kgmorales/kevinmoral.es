import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsGithub } from 'react-icons/bs'
import { MdOutlineLink } from 'react-icons/md'
import YoutubeEmbed from './YoutubeEmbed'

const ProjectCard = ({ title, description, imgSrc, href, tools, deployed, embedId, logoSrc }) => (
  <div className="card">
    {embedId ? (
      <div className="medium relative hidden w-full shrink-0 overflow-hidden rounded-lg shadow-2xl before:inset-0 before:z-10  sm:-mt-0 sm:w-1/2 md:-ml-[35%] md:block md:w-8/12">
        <YoutubeEmbed embedId={embedId} />
      </div>
    ) : (
      imgSrc && (
        <div className="medium relative hidden w-full shrink-0 overflow-hidden rounded-lg shadow-2xl before:absolute before:inset-0 before:z-10 sm:-mt-[10%] sm:w-1/2 md:-ml-[35%] md:block md:w-8/12">
          <Image
            title={title}
            alt={title}
            src={imgSrc}
            width={1200}
            height={800}
            layout="responsive"
            objectFit="cover"
            quality={100}
            className="transition-all duration-300 lg:group-hover:scale-110"
          />
        </div>
      )
    )}

    <div className="flex flex-col justify-center gap-3">
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={title}
          width={100} // Adjust according to your needs
          height={100} // Adjust according to your needs
          objectFit="fit"
        />
      ) : (
        <h1 className="text-center text-xl font-bold capitalize text-neutral-200">{title}</h1>
      )}
      {embedId ? (
        <div className="relative w-full shrink-0 overflow-hidden rounded-lg shadow-2xl before:inset-0 before:z-10 sm:-mt-0 sm:block sm:w-1/2 md:-ml-[35%] md:hidden md:w-8/12">
          <YoutubeEmbed embedId={embedId} />
        </div>
      ) : (
        imgSrc && (
          <div className="relative w-full shrink-0 overflow-hidden rounded-lg shadow-2xl before:absolute before:inset-0 before:z-10 sm:-mt-[10%] sm:block sm:w-1/2 md:-ml-[35%] md:hidden md:w-8/12">
            <Image
              title={title}
              alt={title}
              src={imgSrc}
              width={1200}
              height={800}
              layout="responsive"
              objectFit="cover"
              quality={100}
              className="transition-all duration-300 lg:group-hover:scale-110"
            />
          </div>
        )
      )}

      <p className="truncate-2 text-md text-neutral-400">{description}</p>

      <div className="flex flex-wrap items-center gap-1">
        {tools.map((tool, index) => (
          <span key={`${tool}-${index}`} className="bg-gray-900 px-2 py-1 text-xs text-gray-500">
            {tool}
          </span>
        ))}
      </div>

      <div className="sm:flex-items-end m-auto flex w-fit gap-4 p-2 md:items-center">
        {href && (
          <Link href={href}>
            <a
              title="Source Code on GitHub"
              target="_blank"
              rel="noopener noreferrer"
              href={href}
              className="text-gray-500 hover:text-white"
            >
              <BsGithub className="h-12 w-12 transition-all hover:scale-110 active:scale-90" />
            </a>
          </Link>
        )}

        {deployed && (
          <Link href={deployed}>
            <a
              title="Live Preview"
              target="_blank"
              rel="noopener noreferrer"
              href={deployed}
              className="text-gray-500 hover:text-white"
            >
              <MdOutlineLink className="h-12 w-12 transition-all hover:scale-110 active:scale-90" />
            </a>
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default ProjectCard
