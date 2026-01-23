## kafka的消息传输流程

	首先kafka的消息消费分为三个阶段，生产者端、broker端、消费者端，三个端之间通过交互实现消息的顺利传输
	1. 生产者者端，调用send方法，生产者对消息进行序列化，转化为字节数组，通过分区优化，选择要将该消息推送到配置的topic下的哪一个partition
		1. 分区选择方式（key一般是消息id）
			1. 指定partition：直接选择
			2. 有 key → hash(key) % partitions
			3. 无 key → StickyPartitioner（批量友好），粘性分区，，在一个批次内尽量发送到同一个 partition，以提升批量发送效率，当批次发送完成后再重新选择分区。
	2. 生产者端将消息存储到内存批次中，等到批次已满或者到达最大等待时间，将消息推送到指定topic的leader broker中
	3. 指定topic的leader broker在获取到生产者发送的消息请求后，会校验请求合法性，并将消息顺序追加写入本地日志文件。（kafaka是顺序读写，不是随机读写）
		1. 校验数据格式
		2. 顺序追加到log segment
		3. 通过操作系统先存储到page cache，然后异步刷盘，实际写入log segment
		4. 更新leo（log end offset）
	4. topic的leader broker日志文件追加完成之后，会启动isr，也就是副本同步机制（这个过程是follower自己进行的，不是leader主动发起的）
		1. follower会拉取leader broker的数据
		2. 将相关数据更新到follower本地的log segment
		3. follower更新完成后发送ack给leader broker
	5. 当isr中的follower broker都完成log segment后，leader 会执行log end offset（这个操作可以理解为更新最新的消息游标，此后的数据可以被消费者拉取到）
		1. isr是一个同步副本队列，是随着broker的状态动态变化的
		2. 每一个follower broker管理自己的leo（log end offset）
		3. leaser broker维护一个最大log end offset
	6. 消费者通过循环的poll操作，从leader broker中拉取数据
	7. 消费者中执行我们自己的业务逻辑
	8. 消费者端执行完成后，会向leader broker提交消费者端的offset，保证消费者端后续不会重新消费

> [!NOTE]
> 总结：

## kafka如何保证消息的幂等性
## kafka的isr机制
## kafka如何保证消息可靠性
## kafka的消息存储结构

[^1]: 
