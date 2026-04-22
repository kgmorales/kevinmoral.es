import { Tab } from '@headlessui/react'
import Image from 'next/image'
import LeaderBio from './leader-bio/leader-bio'

function LeaderTabsHorizontal({ leaders }) {
  if (!leaders || leaders.length === 0) {
    return <p className="text-white">No leaders available</p>
  }
  return (
    <Tab.Group>
      <div className="flex flex-col rounded-[10px]">
        <Tab.List className="flex border-b border-neutral-700">
          {leaders.map((leader, index) => (
            <Tab key={index} className="relative p-3 outline-none">
              {({ selected }) => (
                <>
                  <Image
                    alt={leader.athleteName}
                    src={leader.athleteImage}
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px] rounded-full object-cover"
                  />
                  {selected && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-neutral-700" />
                  )}
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {leaders.map((leader, index) => (
            <Tab.Panel key={index} className="p-4">
              <div className="text-center">
                <LeaderBio leader={leader} />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </div>
    </Tab.Group>
  )
}

export default function Leaders({ homeLeaderCards, awayLeaderCards }) {
  return (
    <>
      <h3 className="mb-4 text-center text-2xl font-semibold text-white">Game Leaders</h3>
      <div className="flex flex-wrap justify-around gap-4">
        <div className="min-w-[320px] flex-1 rounded-[10px] p-4">
          <LeaderTabsHorizontal leaders={homeLeaderCards} />
        </div>
        <div className="min-w-[320px] flex-1 rounded-[10px] p-4">
          <LeaderTabsHorizontal leaders={awayLeaderCards} />
        </div>
      </div>
    </>
  )
}
