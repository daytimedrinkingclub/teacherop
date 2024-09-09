import Anthropic from '@anthropic-ai/sdk'

export const onboardingPlanSummaryTools: Anthropic.Messages.Tool[] = [
  {
    name: 'get_onboarding_course_questions',
    description: `Get the user data from the user, this includes the topics they want to learn, the duration they have, and the current skill level of the user. Today is ${new Date().toString()}. Please respect the user's input language and always use the language the use uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English.`,
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
    name: "generate_plan_summary. Please respect the user's input language and always use the language the use uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English.",
    description:
      'Generate a plan summary for the user to understand what they are learning and what they are aiming to achieve, with the things you think are important the topic names etc',
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
            'Details on why the user wants to learn a particular topic, as this impacts the course plan python for school kids and python for a senior developer interview are different for example',
        },
        module_name: {
          type: 'string',
          description:
            'All the modules that the user will be learning, this is a list of all the modules that the user will be learning for example module/chapter 1, module/chapter 2, module/chapter 3 etc and they can/may have sub modules',
        },
        sub_module_name: {
          type: 'string',
          description:
            'The sub modules that the user will be learning, this is a list of all the sub modules that the user will be learning for example sub module 1, sub module 2, sub module 3 etc',
        },
      },
      required: ['plan_overview', 'learning_goal', 'module_name', 'sub_module_name'],
    },
  },
]

export const checkpointTools: Anthropic.Messages.Tool[] = [
  {
    name: 'generate_course_checkpoint',
    description:
      "Generate a checkpoint for the user to complete. Please respect the user's input language and always use the language the use uses it can be English, Hindi, Spanish etc. or a mix of languages link Hinglish which is a mix of Hindi and English.",
    input_schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'The type of the checkpoint, possible values are: [module, submodule]',
        },
        title: {
          type: 'string',
          description: 'The title of the checkpoint',
        },
        description: {
          type: 'string',
          description: 'The description of the checkpoint',
        },
        content: {
          type: 'string',
          description: 'The content of the checkpoint',
        },
        parent_id: {
          type: 'string',
          description:
            'The parent id of the checkpoint, this is the id of the checkpoint that the current checkpoint is a child of, only pass this if the type is submodule',
        },
      },
      required: ['type', 'title', 'description', 'content'],
    },
  },
]
