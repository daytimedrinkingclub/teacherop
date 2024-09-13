import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Book, User, Zap, Target, Rocket, Globe } from 'lucide-react'

const workflowSteps = [
  {
    title: 'AI Course Creation',
    description: 'Our AI analyzes your topic and generates a comprehensive course structure.',
    icon: Brain,
  },
  {
    title: 'Universal Learning',
    description:
      'Master any subject: computer languages, Sanskrit, neuroscience, sports, and beyond.',
    icon: Globe,
  },
  {
    title: 'Custom Modules',
    description: 'Tailored modules and content to match your learning objectives.',
    icon: Book,
  },
  {
    title: 'Personalized Learning',
    description: 'Adaptive questions and assessments to reinforce your understanding.',
    icon: User,
  },
  {
    title: 'Quick Progress',
    description: 'Accelerated learning through AI-optimized content delivery.',
    icon: Zap,
  },
  {
    title: 'Goal Tracking',
    description: 'Set and monitor your learning objectives with smart progress tracking.',
    icon: Target,
  },
  {
    title: 'Skill Mastery',
    description: 'Achieve expertise with comprehensive assessments and practical applications.',
    icon: Rocket,
  },
]

const WorkflowComponent = () => {

  return (
    <div className="mt-12  p-4 md:p-8 rounded-lg">
      <h3 className="text-3xl font-bold mb-6 text-center">How TeacherOP Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="h-full border-l-4 transition-all duration-300 ease-in-out hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <motion.div
                    className={`p-2 rounded-full`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <step.icon className={`h-6 w-6`} />
                  </motion.div>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step.title === 'Universal Learning' ? (
                  <p className="text-sm text-gray-600">
                    Master any subject:
                    <span className="font-semibold"> computer languages</span>,
                    <span className="font-semibold"> Sanskrit</span>,
                    <span className="font-semibold"> neuroscience</span>,
                    <span className="font-semibold"> sports</span>, and beyond.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">{step.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WorkflowComponent
