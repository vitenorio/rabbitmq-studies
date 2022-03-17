const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }
    const exchange = 'logs'

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.assertQueue('', {
      exclusive: true
    }, (error2, q) => {
      if (error2) {
        throw error2
      }

      console.log('[*] Waiting for messages in %s. To exit press CTRL+C', q.queue)
      channel.bindQueue(q.queue, exchange, '')

      channel.consume(q.queue, (msg) => {
        if(msg.content) {
            console.log('[x] %s', msg.content.toString())
          }
      }, {
        noAck: true
      })
    })
  })
})
