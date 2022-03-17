const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const queue = 'task_queue'
    const msg = process.argv.slice(2).join(' ') || 'hello'

    channel.assertQueue(queue, {
      durable: true
    })

    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true })
    console.log('[x] Sent %s', msg)
  })

  setTimeout(function () {
    connection.close()
    process.exit(0)
  }, 500)
})
