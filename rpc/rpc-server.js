const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const queue = 'rpc_queue'

    channel.assertQueue(queue, {
      durable: false
    })

    channel.prefetch(1)

    console.log('[x] Awaiting RPC requests')

    channel.consume(queue, (msg) => {
      const num = parseInt(msg.content.toString())

      console.log('[.] fib(%d)', num)

      const r = fibonacci(num)

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
        correlationId: msg.properties.correlationId
      })

      channel.ack(msg)
    })
  })
})

const fibonacci = (n) => {
  if (n == 0 || n == 1)
    return n
  else
    return fibonacci(n - 1) + fibonacci(n - 2)
}
