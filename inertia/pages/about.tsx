import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@inertiajs/react"
import { BookOpen, Users, Zap, Globe } from "lucide-react"
import { Icons } from "~/lib/components/icons"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background container mx-auto">
            <Header />
            <section className="container mx-auto px-6 py-4 my-[90px] relative">
                <header className="bg-primary rounded-md text-primary-foreground py-12">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold mb-4">About TeacherOP</h1>
                        <p className="text-xl">Empowering learners with AI-driven personalized education</p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12">
                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
                        <p className="text-lg mb-4">
                            At TeacherOP, we're on a mission to revolutionize education through the power of artificial intelligence.
                            We believe that everyone deserves access to high-quality, personalized learning experiences that adapt to
                            their unique needs, pace, and learning style.
                        </p>
                        <p className="text-lg">
                            Our AI-powered platform creates custom-tailored courses on any topic, in any language,
                            allowing learners to expand their knowledge and skills efficiently and effectively.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">What Sets Us Apart</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: <BookOpen className="w-8 h-8 mb-4 text-primary" />,
                                    title: "Personalized Learning Paths",
                                    description: "Our AI analyzes your learning style and goals to create a unique educational journey."
                                },
                                {
                                    icon: <Users className="w-8 h-8 mb-4 text-primary" />,
                                    title: "Global Community",
                                    description: "Connect with learners worldwide, sharing insights and experiences across cultures."
                                },
                                {
                                    icon: <Zap className="w-8 h-8 mb-4 text-primary" />,
                                    title: "Adaptive Pacing",
                                    description: "Learn at your own speed with content that adjusts to your progress and comprehension."
                                },
                                {
                                    icon: <Globe className="w-8 h-8 mb-4 text-primary" />,
                                    title: "Multilingual Support",
                                    description: "Access courses in multiple languages, breaking down barriers to global education."
                                }
                            ].map((feature, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        {feature.icon}
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">Our Values</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Innovation: Constantly pushing the boundaries of educational technology</li>
                            <li>Accessibility: Making quality education available to everyone, everywhere</li>
                            <li>Adaptability: Evolving our platform to meet the changing needs of learners</li>
                            <li>Community: Fostering a supportive environment for collaborative learning</li>
                            <li>Integrity: Maintaining high standards of educational quality and user privacy</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-semibold mb-6">Join the Learning Revolution</h2>
                        <p className="text-lg mb-6">
                            Experience the future of education with TeacherOP. Whether you're looking to acquire new skills,
                            explore a passion, or advance your career, our AI-powered platform is here to guide you every step of the way.
                        </p>
                    </section>
                </main>

                <footer className="bg-secondary text-secondary-foreground py-6">
                    <div className="container mx-auto px-4 text-center">
                        <p>&copy; 2024 TeacherOP. All rights reserved.</p>
                    </div>
                </footer>
            </section>
        </div>
    )
}


const Header = () => (
    <header className="container mx-auto fixed bg-background z-50 top-0 left-0 right-0 flex justify-between items-center">
        <div className="flex gap-10 font-semibold md:text-2xl text-xl">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
        </div>
        <div>
            {/* <img src="/public/images/logo.png" alt="Logo" className="h-20 w-20 md:h-24 md:w-24" width={80} height={80} /> */}
            {/* <img src="https://res.cloudinary.com/ajitpatil/image/upload/v1726496203/teacherop/vc171uq8cpcdqq8m2cka.png" alt="Logo" className="h-20 w-20 md:h-24 md:w-24" width={80} height={80} /> */}
            {Icons.logo && <Icons.logo className="h-20 w-20 md:h-24 md:w-24" />}
        </div>
    </header>
)
