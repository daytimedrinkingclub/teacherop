import { useEffect, useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useFullScreen } from '~/lib/hooks/use_fullscreen'
import FullscreenBtn from '../fullscreenBtn'
import { Icons } from '../icons'

interface Question {
    id: number
    text: string
    type: 'mcq' | 'subjective'
    options?: string[]
}

interface AssessmentProps {
    courseTitle: string
    moduleTitle: string
    submoduleTitle: string
    questions: Question[]
    duration: number // Duration in seconds
}

export default function Assessment({ courseTitle, moduleTitle, submoduleTitle, questions, duration }: AssessmentProps) {
    const [timeRemaining, setTimeRemaining] = useState(duration)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<{ [key: number]: string }>({})
    const [showPalette, setShowPalette] = useState(true)
    const [showExitAlert, setShowExitAlert] = useState(false)

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

    const { isFullScreen, enterFullScreen } = useFullScreen()

    useEffect(() => {
        enterFullScreen()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!isFullScreen) {
                setShowExitAlert(true)
            }
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [isFullScreen])

    const handleAnswerChange = (answer: string) => {
        setAnswers((prev) => ({ ...prev, [questions[currentQuestionIndex].id]: answer }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1)
        }
    }

    const handleSubmit = () => {
        console.log('Submitted Answers:', answers)
        // Handle the submission logic here (e.g., send answers to the server)
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
            <div className="w-full max-w-6xl flex gap-4">
                <div className="w-full flex-grow flex flex-col">
                    <Card className="w-full shadow-xl flex-grow">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl font-bold">{courseTitle}</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPalette(!showPalette)}
                                        aria-label={showPalette ? "Hide question palette" : "Show question palette"}
                                    >
                                        {showPalette ? <Icons.panelRightClose className="h-4 w-4" /> : <Icons.panelRightOpen className="h-4 w-4" />}
                                    </Button>
                                    <FullscreenBtn />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{moduleTitle} - {submoduleTitle}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Icons.clock className="h-4 w-4" />
                                    <span className="font-medium">{formatTime(timeRemaining)}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </div>
                            </div>
                            <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="w-full" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
                            {currentQuestion.type === 'mcq' ? (
                                <RadioGroup
                                    onValueChange={handleAnswerChange}
                                    value={answers[currentQuestion.id] || ''}
                                >
                                    {currentQuestion.options?.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`option-${index}`} />
                                            <Label htmlFor={`option-${index}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <Textarea
                                    placeholder="Type your answer here..."
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    rows={4}
                                    className="w-full"
                                />
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                <Icons.chevronLeft className="h-4 w-4 mr-2" /> Previous
                            </Button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <Button onClick={handleSubmit} disabled={timeRemaining === 0}>
                                    Submit
                                </Button>
                            ) : (
                                <Button onClick={handleNext}>
                                    Next <Icons.chevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                <div className={`w-64 transition-all duration-300 ease-in-out ${showPalette ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}`}>
                    <Card className="shadow-xl h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Question Palette</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="text-sm font-medium">Progress</p>
                                <Progress value={(answeredCount / questions.length) * 100} className="w-full mt-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {answeredCount} of {questions.length} answered
                                </p>
                            </div>
                            <ScrollArea className="h-[calc(100vh-16rem)]">
                                <div className="grid grid-cols-4 gap-6">
                                    {questions.map((q, index) => (
                                        <Button
                                            key={q.id}
                                            variant={currentQuestionIndex === index ? "default" : "outline"}
                                            className={`w-10 h-10 ${answers[q.id] ? "bg-green-500 hover:bg-green-400 text-white" : ""}`}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Fullscreen Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            This assessment must be taken in fullscreen mode. Please return to fullscreen to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => {
                            enterFullScreen()
                            setShowExitAlert(false)
                        }}>
                            Return to Fullscreen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}