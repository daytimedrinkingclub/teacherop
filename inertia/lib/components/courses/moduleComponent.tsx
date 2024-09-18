import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icons } from '~/lib/components/icons'
import { Card, CardContent } from '~/lib/components/ui/card'
import { Progress } from '~/lib/components/ui/progress'
import { calculatePercentage } from '~/lib/lib/utils'
import SubModuleComponent from './submoduleComponent'

interface ModuleComponentProps {
  module: any
  index: number
}

const ModuleComponent: React.FC<ModuleComponentProps> = ({ module, index }) => {
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  const toggleModule = () => {
    setExpandedModule(expandedModule === index ? null : index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden rounded-lg border-l-4 shadow-md bg-background">
        <motion.div
          className="p-4 cursor-pointer"
          onClick={toggleModule}
          initial={false}
          animate={{
            backgroundColor: expandedModule === index ? '#f3f4f6' : '#ffffff',
          }}
        >
          <div className="flex flex-col gap-2 justify-between md:flex-row md:items-center">
            <div className="flex items-center space-x-3">
              <Icons.zap className="w-6 h-6" />
              <h2 className="text-lg font-semibold">{module.title}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <Progress
                value={calculatePercentage(module.totalSubmodule, module.completedSubmodule || 0)}
                className="w-24"
              />
              <span className="flex gap-2 text-sm text-gray-600">
                {calculatePercentage(module.totalSubmodule, module.completedSubmodule || 0)}%
              </span>
              <motion.div
                animate={{ rotate: expandedModule === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icons.chevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{module.description}</p>
        </motion.div>
        <AnimatePresence>
          {expandedModule === index && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-0 py-4 md:px-4 pb-4 space-y-2">
                {module.submodules.map((submodule: any, subIndex: number) => (
                  <SubModuleComponent key={subIndex} submodule={submodule} subIndex={subIndex} />
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default ModuleComponent
