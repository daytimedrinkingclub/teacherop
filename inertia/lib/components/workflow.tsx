import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Book, User, Zap, Target, Rocket, Globe } from "lucide-react"

const workflowSteps = [
    {
        title: "AI Course Creation",
        description: "Our AI analyzes your topic and generates a comprehensive course structure.",
        icon: Brain,
        color: "text-purple-500",
        bgColor: "bg-purple-100",
    },
    {
        title: "Universal Learning",
        description: "Master any subject: computer languages, Sanskrit, neuroscience, sports, and beyond.",
        icon: Globe,
        color: "text-teal-500",
        bgColor: "bg-teal-100",
    },
    {
        title: "Custom Modules",
        description: "Tailored modules and content to match your learning objectives.",
        icon: Book,
        color: "text-blue-500",
        bgColor: "bg-blue-100",
    },
    {
        title: "Personalized Learning",
        description: "Adaptive questions and assessments to reinforce your understanding.",
        icon: User,
        color: "text-green-500",
        bgColor: "bg-green-100",
    },
    {
        title: "Quick Progress",
        description: "Accelerated learning through AI-optimized content delivery.",
        icon: Zap,
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
    },
    {
        title: "Goal Tracking",
        description: "Set and monitor your learning objectives with smart progress tracking.",
        icon: Target,
        color: "text-red-500",
        bgColor: "bg-red-100",
    },
    {
        title: "Skill Mastery",
        description: "Achieve expertise with comprehensive assessments and practical applications.",
        icon: Rocket,
        color: "text-indigo-500",
        bgColor: "bg-indigo-100",
    },
]

const WorkflowComponent = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)

    return (
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 rounded-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                How TeacherOP Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflowSteps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onHoverStart={() => setHoveredCard(index)}
                        onHoverEnd={() => setHoveredCard(null)}
                    >
                        <Card className="h-full border-l-4 transition-all duration-300 ease-in-out hover:shadow-lg"
                            style={{ borderLeftColor: step.color }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <motion.div
                                        className={`p-2 rounded-full ${step.bgColor}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <step.icon className={`h-6 w-6 ${step.color}`} />
                                    </motion.div>
                                    {step.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {step.title === "Universal Learning" ? (
                                    <p className="text-sm text-gray-600">
                                        Master any subject:
                                        <span className="font-semibold text-teal-600"> computer languages</span>,
                                        <span className="font-semibold text-teal-600"> Sanskrit</span>,
                                        <span className="font-semibold text-teal-600"> neuroscience</span>,
                                        <span className="font-semibold text-teal-600"> sports</span>,
                                        and beyond.
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