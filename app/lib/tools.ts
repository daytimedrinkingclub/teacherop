import Anthropic from '@anthropic-ai/sdk'

export const onboardingPlanSummaryTools: Anthropic.Messages.Tool[] = [
  {
    name: 'get_onboarding_course_questions',
    description: `Get the user data from the user, this includes the topics they want to learn, the current skill level of the user and related questions. Today is ${new Date().toString()}. Please respect the user's input language and always use the language the user uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English. Make an estimation that How much time it can take to complete the course and ask about the course duration that the user can complete the course. Always use this tools whenever you feel like you need to get info from the user.`,
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
    // cache_control: { type: 'ephemeral' },
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
        course_title: {
          type: 'string',
          description: 'Title for the course.',
        },
        course_description: {
          type: 'string',
          description: 'Short description for the course',
        },
      },
      required: [
        'plan_overview',
        'learning_goal',
        'module_name',
        'course_title',
        'course_description',
      ],
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
        order: {
          type: 'integer',
          description: 'The order of the module',
        },
        sub_modules: {
          type: 'array',
          items: {
            type: 'string',
            description: 'Titles of the submodules',
          },
        },
      },
      required: ['title', 'description', 'order', 'sub_modules'],
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

        order: {
          type: 'integer',
          description: 'The order of the submodule',
        },
        estimated_duration: {
          type: 'number',
          description: 'Estimated time to complete the submodule in minutes',
        },
      },
      required: ['title', 'description', 'order'],
    },
  },
]

export const createContentTool: Anthropic.Messages.Tool[] = [
  {
    name: 'generate_content',
    description:
      "Generates detailed content for a submodule in the course. Respect the user's input language (English, Hindi, Spanish, etc.) or mixed languages like Hinglish.",
    input_schema: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          description:
            'The detailed value/content of the content of the submodule for the course in MD format.',
        },
        estimated_duration: {
          type: 'number',
          description:
            'The estimated duration of the content that can take to understand the content in minutes.',
        },
      },
      required: ['value', 'estimated_duration'],
    },
  },
]

export const searchTavilyTool: Anthropic.Messages.Tool[] = [
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
