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

    channel.assertQueue(queue, {
      durable: false
    })

    console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queue)

    // Provide a callback that will be executed when RabbitMQ pushes messages to our consumer. This is what Channel.consume does.
    channel.consume(queue, (msg) => {
      console.log('[x] Received %s', msg.content.toString())
    }, {
      noAck: true
    })
  })
})
