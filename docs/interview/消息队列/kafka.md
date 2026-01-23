## kafka的消息传输流程

	首先kafka的消息消费分为三个阶段，生产者端、broker端、消费者端，三个端之间通过交互实现消息的顺利传输
	1. 生产者者端，调用send方法，生产者对消息进行序列化，转化为字节数组，通过分区优化，选择要将该消息推送到配置的topic下的哪一个topic
		1. 分区选择方式（key一般是消息id）
			1. 指定partition：直接选择
			2. 有 key → hash(key) % partitions
			3. 无 key → StickyPartitioner（批量友好），粘性分区，保证尽量将消息推送到同一个分区
	2. 生产者端将消息存储到内存批次中，等到批次已满或者到达最大等待时间，将消息推送到指定topic的leader broker中
	3. 

> [!NOTE]
> 总结：

## kafka如何保证消息的幂等性
## kafka的isr机制
## kafka如何保证消息可靠性
## kafka的消息存储结构