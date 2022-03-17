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
    const msg = process.argv.slice(2).join(' ') || 'hello'

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    })

    channel.publish(exchange, '', Buffer.from(msg))
    console.log('[x] Sent %s', msg)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
