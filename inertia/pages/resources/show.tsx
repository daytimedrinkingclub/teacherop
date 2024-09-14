import type CheckpointController from '#controllers/checkpoint_controller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InferPageProps } from '@adonisjs/inertia/types'
import { BookOpen, LayersIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AppLayout from '~/lib/components/layout/app_layout'
import { Layout } from '~/lib/components/layout/custom_layout'
import { Separator } from '~/lib/components/ui/separator'
import { UserNav } from '~/lib/components/user_nav'

export default function CheckpointShow({
  checkpoint,
  course,
  module,
}: InferPageProps<CheckpointController, 'show'>) {
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
        <div className="p-4 min-h-screen bg-background md:px-8">
          <Card className="mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center text-2xl font-bold">
                <BookOpen className="mr-2 w-6 h-6" />
                {course.title}
              </CardTitle>
              <p className="text-muted-foreground">{course.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h2 className="flex items-center mb-2 text-xl font-semibold">
                    <LayersIcon className="mr-2 w-6 h-6" />
                    {module.title}
                  </h2>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
                {/* <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{checkpoint.title}</h3>
                </div> */}
                <Separator />
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h4 className="mb-4 text-lg font-semibold">{checkpoint.title}</h4>
                    <p>{checkpoint.description}</p>
                    <div className="max-w-none prose">
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
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code {...props} className={className}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {checkpoint.content}
                      </ReactMarkdown>
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
