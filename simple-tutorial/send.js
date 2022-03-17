const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const queue = 'messages'
    const msg = 'hello'

    // Declaring a queue is idempotent - it will only be created if it doesn't exist already
    channel.assertQueue(queue, {
      durable: false
    })

    channel.sendToQueue(queue, Buffer.from(msg))
    console.log('[x] Sent %s', msg)
  })

  setTimeout(function () {
    connection.close()
    process.exit(0)
  }, 500)
})
