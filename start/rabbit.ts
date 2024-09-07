import { Rabbit } from 'rabbitmq-adonis-v6'

import createCheckpoint from '#jobs/check_point'
import onboardCourseJob from '#jobs/onboard_course'

async function listen() {
  await Rabbit.assertQueue('onboard_course')
  await Rabbit.consumeFrom('onboard_course', (message) => {
    onboardCourseJob(message.content).then(() => message.ack())
  })

  await Rabbit.assertQueue('check_point')
  await Rabbit.consumeFrom('check_point', (message) => {
    createCheckpoint(message.content).then(() => message.ack())
  })
}

listen()
  .then(() => {
    console.log('Connected to Rabbitmq')
  })
  .catch((_e) => {
    console.log('Cannot connect to Rabbitmq')
  })
