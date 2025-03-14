import tools from '/data/tools'
import ToolsCard from '@/components/atoms/ToolsCard'

const ToolGrid = ({ filter }) => {
  return (
    <div className="container mx-4">
      <div className="grid auto-rows-fr grid-cols-1 gap-3 md:grid-cols-3">
        {tools
          .filter((x) => x.category.includes(filter))
          .sort((a, b) => {
            if (a.name < b.name) {
              return -1
            }
            if (a.name > b.name) {
              return 1
            }
            return 0
          })
          .map((tool, index) => (
            <ToolsCard {...tool} key={index.toString()} />
          ))}
      </div>
    </div>
  )
}

export default ToolGrid
