'use client'

import { InferPageProps } from "@adonisjs/inertia/types"
import type CheckpointController from '#controllers/checkpoint_controller'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LayersIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"

import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { UserNav } from "~/lib/components/user_nav"
import { Separator } from "~/lib/components/ui/separator"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CheckpointShow(props: InferPageProps<CheckpointController, 'show'>) {

    const course = {
        title: 'Node.js Fundamentals',
        description: 'Master the basics of Node.js and server-side JavaScript',
    }
    const module = {
        title: 'Intro to JavaScript',
        description: 'Learn the core concepts of JavaScript for Node.js development',
    }
    const submodules = {
        title: 'Variables and Data Types',
        content: `
# Variables and Data Types in JavaScript

JavaScript has several data types and ways to declare variables. Let's explore them:

## Variable Declarations

- \`var\`: Function-scoped or globally-scoped variable
- \`let\`: Block-scoped variable
- \`const\`: Block-scoped constant

## Data Types

1. **Number**: Represents both integer and floating-point numbers
   \`\`\`javascript
   let age = 25;
   let pi = 3.14159;
   \`\`\`

2. **String**: Represents textual data
   \`\`\`javascript
   let name = "John Doe";
   let greeting = \`Hello, \${name}!\`;
   \`\`\`

3. **Boolean**: Represents true or false
   \`\`\`javascript
   let isActive = true;
   let isLoggedIn = false;
   \`\`\`

4. **Undefined**: Represents a variable that has been declared but not assigned a value
   \`\`\`javascript
   let undefinedVar;
   \`\`\`

5. **Null**: Represents a deliberate non-value or absence of any object value
   \`\`\`javascript
   let emptyValue = null;
   \`\`\`

6. **Object**: Represents a collection of related data
   \`\`\`javascript
   let person = {
     name: "Jane Doe",
     age: 30,
     isStudent: false
   };
   \`\`\`

7. **Array**: Represents a list-like object
   \`\`\`javascript
   let fruits = ["apple", "banana", "orange"];
   \`\`\`

Understanding these data types and how to work with variables is crucial for JavaScript development in Node.js.
      `
    }

    return (
        <AppLayout>
            <Layout.Header>
                <div className="hidden justify-end items-end w-full md:flex">
                    {/* <Search /> */}
                    <div className="flex items-end space-x-4">
                        {/* <ThemeSwitch /> */}
                        <UserNav />
                    </div>
                </div>
            </Layout.Header>
            <Layout.Body>
                <div className="min-h-screen bg-background p-4 md:px-8">
                    <Card className="mx-auto shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <BookOpen className="mr-2 h-6 w-6" />
                                {course.title}
                            </CardTitle>
                            <p className="text-muted-foreground">{course.description}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold flex items-center mb-2">
                                        <LayersIcon className="mr-2 h-6 w-6" />
                                        {module.title}
                                    </h2>
                                    <p className="text-muted-foreground">{module.description}</p>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{submodules.title}</h3>
                                </div>
                                <Separator />
                                <Card className="mt-6">
                                    <CardContent className="p-6">
                                        <h4 className="text-lg font-semibold mb-4">{submodules.title}</h4>
                                        <div className="prose max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    //@ts-ignore
                                                    code({ node, inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || '')
                                                        return !inline && match ? (
                                                            //@ts-ignore
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                style={atomDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                            >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                                                        ) : (
                                                            <code {...props} className={className}>
                                                                {children}
                                                            </code>
                                                        )
                                                    }
                                                }}>{submodules.content}</ReactMarkdown>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
        </AppLayout>
    )
}