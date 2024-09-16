import Anthropic from '@anthropic-ai/sdk'

export const onboardingPlanSummaryTools: Anthropic.Messages.Tool[] = [
  {
    name: 'get_onboarding_course_questions',
    description: `Get the user data from the user, this includes the topics they want to learn, the current skill level of the user and related questions. Today is ${new Date().toString()}. Please respect the user's input language and always use the language the user uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English. Make an estimation that How much time it can take to complete the course and ask about the course duration that the user can complete the course.`,
    input_schema: {
      type: 'object',
      properties: {
        question_format: {
          type: 'string',
          description:
            'The format of the question, and expected answer format, from only these options: text, radio, checkbox, scale, datepicker',
        },
        question_text: {
          type: 'string',
          description:
            'The actual question text string that the user will be asked, this should be a question that the user will be asked to answer, and the question should be in the format of a question that the user will be asked to answer',
        },
        question_meta: {
          type: 'object',
          description: 'Additional metadata based on the question_format',
          oneOf: [
            {
              properties: {
                options: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'An array of options for radio and checkbox question_format',
                },
              },
              required: ['options'],
            },
            {
              properties: {
                min: {
                  type: 'number',
                  description: 'The minimum value for the scale question_format',
                },
                max: {
                  type: 'number',
                  description: 'The maximum value for the scale question_format',
                },
              },
              required: ['min', 'max'],
            },
            {
              properties: {},
            },
          ],
        },
        answer_type: {
          type: 'string',
          description: 'The expected answer type, text, radio, checkbox, scale, datepicker',
        },
        answer_values: {
          type: 'string',
          description:
            'The expected answer values, for radio and checkbox answer type, comma separated options will work, additionally some questions might not and answer like if we ask the users age, only answer type scale is enough for such questions the key NULL can be passed',
        },
      },
      required: [
        'question_format',
        'question_text',
        'question_meta',
        'answer_type',
        'answer_values',
      ],
    },
  },
  {
    name: 'generate_plan_summary',
    description:
      "Generate a plan summary for the user to understand what they are learning and what they are aiming to achieve, with the things you think are important the topic names etc. Please respect the user's input language and always use the language the user uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English.",
    input_schema: {
      type: 'object',
      properties: {
        plan_overview: {
          type: 'string',
          description:
            'The overview of the plan, a general description of what the user wants to learn',
        },
        learning_goal: {
          type: 'string',
          description:
            'Details on why the user wants to learn a particular topic, as this impacts the course plan - python for school kids and python for a senior developer interview are different for example',
        },
        module_names: {
          type: 'array',
          items: {
            type: 'string',
            description:
              'All the modules that the user will be learning, this is a list of all the modules that the user will be learning for example module/chapter/title 1, module/chapter/title 2, module/chapter/title 3 etc.',
          },
        },
        submodule_name: {
          type: 'array',
          items: {
            type: 'string',
            description:
              'one or more submodules that the user will be learning under a module.This is a list of all the submodules of modules for example 1.1 - title, 1.2 - title, ....',
          },
        },
      },
      required: ['plan_overview', 'learning_goal', 'module_name', 'submodule_name'],
    },
  },
]

export const createModuleTool: Anthropic.Messages.Tool[] = [
  {
    name: 'generate_course_module',
    description:
      "Generate a module for the user to complete. Respect the user's input language (English, Hindi, Spanish, etc.) or mixed languages like Hinglish.",
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the module',
        },
        description: {
          type: 'string',
          description: 'A brief description of the module',
        },
        content: {
          type: 'string',
          description: 'The detailed content of the module',
        },
        order: {
          type: 'integer',
          description: 'The order of the module',
        },
        // estimated_duration: {
        //   type: 'integer',
        //   description: 'Estimated time to complete the module',
        //   properties: {
        //     duration: {
        //       type: 'number',
        //       description: 'Estimated duration in minutes/hours/days',
        //     },
        //     unit: {
        //       type: 'string',
        //       enum: ['minutes', 'hours', 'days'],
        //       description: 'Unit of time for the duration',
        //     },
        //   },
        //   required: ['duration', 'unit'],
        // },
      },
      required: ['title', 'description', 'content', 'order'],
    },
  },
]
export const createSubmoduleTool: Anthropic.Messages.Tool[] = [
  {
    name: 'generate_course_submodule',
    description:
      "Generate submodules for an existing module in the course. Respect the user's input language (English, Hindi, Spanish, etc.) or mixed languages like Hinglish.",
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The title of the submodule',
        },
        description: {
          type: 'string',
          description: 'A brief description of the submodule',
        },
        content: {
          type: 'string',
          description:
            'The detailed content of the submodule using content and resources from tavily API in MD format.',
        },
        order: {
          type: 'integer',
          description: 'The order of the submodule',
        },
        estimated_duration: {
          type: 'number',
          description: 'Estimated time to complete the submodule in minutes',
        },
      },
      required: ['title', 'description', 'content', 'estimated_duration', 'order'],
    },
  },
  {
    name: 'search_content_and_resources',
    description: 'Searches tavily API to generate content and resources.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query to search in tavily API',
        },
      },
      required: ['query'],
    },
  },
]
