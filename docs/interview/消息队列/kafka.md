## kafka的消息传输流程

Kafka 中一条消息的传输过程可以分为生产者端、Broker 端和消费者端三个阶段
1. 生产者者端，调用send方法，生产者对消息进行序列化，转化为字节数组，通过分区优化，选择要将该消息推送到配置的topic下的哪一个partition
	1. 分区选择方式（key一般是消息id）
		1. 指定partition：直接选择
		2. 有 key → hash(key) % partitions
		3. 无 key → StickyPartitioner（批量友好），粘性分区，，在一个批次内尽量发送到同一个 partition，以提升批量发送效率，当批次发送完成后再重新选择分区。
2. 生产者端将消息存储到内存批次中，等到批次已满或者到达最大等待时间，将消息推送到指定partition的leader broker中
3. 指定partition的leader broker在获取到生产者发送的消息请求后，会校验请求合法性，并将消息顺序追加写入本地日志文件。（kafaka是顺序读写，不是随机读写）
	1. 校验数据格式
	2. 顺序追加到log segment
	3. 顺序追加写入 log segment 文件，该写操作首先进入操作系统的 page cache，并由操作系统异步刷盘。
	4. 更新leo（log end offset）
4. topic的leader broker日志文件追加完成之后，ISR 中的 follower 副本会按照副本同步机制主动从 leader 拉取数据。
	1. isr中的follower会拉取leader broker的数据
	2. 将相关数据更新到follower本地的log segment
	3. follower更新完成后发送ack给leader broker
5. 当isr中的follower broker都完成log segment后，leader broker 会根据 ISR 中副本的 leo 推进该 partition 的 High Watermark（HW），只有小于等于 HW 的消息才对消费者可见。
	1. isr是一个同步副本队列，是随着broker的状态动态变化的
	2. 每一个follower broker管理自己的leo（log end offset）
	3.leader broker 维护 High Watermark（HW），用于标识已提交消息的最大 offset，对消费者可见。
6. 消费者通过循环的poll操作，从leader broker中拉取数据
7. 消费者中执行我们自己的业务逻辑
8. 消费者端执行完成后，会向 GroupCoordinator 提交消费位点（offset），该位点会被写入 _consumer_offsets 主题中，用于记录消费进度费

> [!NOTE]
> 总结：

## kafka如何保证消息的幂等性
## kafka的isr机制
## kafka如何保证消息可靠性
## kafka的消息存储结构
