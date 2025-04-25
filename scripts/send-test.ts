// scripts/send-test.ts
import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';
dotenv.config();

async function sendTestMessage() {
  const url   = process.env.RABBITMQ_URL!;    // amqp://user:password@localhost:5672
  const queue = process.env.RABBITMQ_QUEUE!;  // chat_queue

  const conn = await amqp.connect(url);
  const ch   = await conn.createChannel();

  // Pastikan queue ada:
  await ch.assertQueue(queue, { durable: false });

  const msg = {
    senderId:   'user1',
    receiverId: 'user2',
    content:    'Hello from send-test!',
    timestamp:  new Date(),
  };

  // Kirim langsung ke queue dengan header pattern
  ch.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(msg)),
    { headers: { pattern: 'chat_message' } },
  );

  console.log(`→ published to queue '${queue}' with pattern 'chat_message':`, msg);

  setTimeout(async () => {
    await ch.close();
    await conn.close();
    process.exit(0);
  }, 500);
}

sendTestMessage().catch(console.error);
