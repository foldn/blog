## kafka的消息传输流程

Kafka 中一条消息的传输过程可以分为 **生产者端、Broker 端、消费者端** 三个阶段。

---

### 一、生产者端（Producer）

1. 应用调用 `send()` 方法后，生产者对消息进行序列化，将 key 和 value 转换为字节数组，并通过分区器选择该消息要发送到 **topic 下的某个 partition**。
    
2. 分区选择策略如下（key 一般为业务唯一标识，如消息 ID）：
    
    - 指定 partition：直接发送到指定 partition
        
    - 有 key：通过 `hash(key) % partitions` 选择 partition
        
    - 无 key：使用 StickyPartitioner，在一个批次内尽量发送到同一个 partition，以提升批量发送效率，批次发送完成后再重新选择 partition
        
3. 消息随后被写入生产者端的内存缓冲区（RecordAccumulator），当批次已满、达到 `linger.ms`，或触发 flush 时，由 Sender 线程将消息发送到对应 partition 的 leader broker。
    

---

### 二、Broker 端（Kafka Server）

4. partition 的 leader broker 接收到 ProduceRequest 后，会进行请求合法性校验，并将消息**顺序追加写入本地日志文件（log segment）**。Kafka 采用顺序写磁盘而非随机写。
    
    具体过程包括：
    
    - 校验请求与消息格式
        
    - 将消息顺序追加写入 log segment 文件
        
    - 写操作首先进入操作系统的 page cache，由操作系统异步刷盘
        
    - 更新 leader 副本的 LEO（Log End Offset）
        
5. 日志写入完成后，ISR（In-Sync Replicas）中的 follower 副本会**主动从 leader 拉取数据**，并将消息追加写入各自本地的 log segment，完成同步后向 leader 返回 ACK。
    
6. 在生产者配置 `acks=all` 的情况下，leader broker 会根据 ISR 中各副本的 LEO 推进该 partition 的 **High Watermark（HW）**，标识消息已被提交。
    
    - ISR 是一个动态维护的同步副本集合
        
    - 每个副本各自维护自己的 LEO
        
    - leader 维护 HW，**只有 offset 小于等于 HW 的消息才对消费者可见**
        

---

### 三、消费者端（Consumer）

7. 消费者通过循环调用 `poll()` 方法，从 leader broker 拉取 **offset 小于等于 HW 的消息**。
    
8. 消费者对拉取到的消息执行业务处理逻辑。
    
9. 当业务处理完成后，消费者向 **GroupCoordinator** 提交消费位点（offset），该位点会被写入 `__consumer_offsets` 主题中，用于记录消费进度，保证后续不会重复消费。

> [!NOTE] 总结
>Kafka 中消息先在 Producer 端完成序列化与分区并进入内存批次，由 leader broker 顺序写入日志并同步到 ISR 副本，在推进 High Watermark 后对 Consumer 可见，消费者处理完成后通过提交 offset 标记消费进度。
>
## kafka如何保证消息的幂等性
## kafka的isr机制
## kafka如何保证消息可靠性
## kafka的消息存储结构
