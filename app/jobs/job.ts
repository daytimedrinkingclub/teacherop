import { Rabbit } from 'rabbitmq-adonis-v6'
import createCheckpoint from './check_point.js'
import onboardCourseJob from './onboard_course.js'

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

listen().catch((_e) => {
  console.log('Cannot connect to Rabbitmq')
})
