[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-08-10 17:09:57 UTC

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10511: Sun Aug 10 17:09:55 2025
  read: IOPS=5807, BW=22.7MiB/s (23.8MB/s)(227MiB/10001msec)
    slat (nsec): min=40, max=16861, avg=182.75, stdev=169.61
    clat (usec): min=42, max=30188, avg=72.32, stdev=181.41
     lat (usec): min=42, max=30188, avg=72.50, stdev=181.41
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   57], 10.00th=[   60], 20.00th=[   64],
     | 30.00th=[   67], 40.00th=[   68], 50.00th=[   71], 60.00th=[   73],
     | 70.00th=[   75], 80.00th=[   78], 90.00th=[   84], 95.00th=[   90],
     | 99.00th=[  104], 99.50th=[  112], 99.90th=[  135], 99.95th=[  174],
     | 99.99th=[ 1696]
   bw (  KiB/s): min=21672, max=26664, per=100.00%, avg=23230.40, stdev=1214.91, samples=20
   iops        : min= 5418, max= 6666, avg=5807.60, stdev=303.73, samples=20
  write: IOPS=5785, BW=22.6MiB/s (23.7MB/s)(226MiB/10001msec); 0 zone resets
    slat (nsec): min=80, max=29185, avg=260.62, stdev=267.17
    clat (usec): min=56, max=28196, avg=96.27, stdev=209.47
     lat (usec): min=56, max=28196, avg=96.53, stdev=209.47
    clat percentiles (usec):
     |  1.00th=[   74],  5.00th=[   79], 10.00th=[   82], 20.00th=[   87],
     | 30.00th=[   90], 40.00th=[   92], 50.00th=[   93], 60.00th=[   95],
     | 70.00th=[   98], 80.00th=[  101], 90.00th=[  108], 95.00th=[  114],
     | 99.00th=[  128], 99.50th=[  137], 99.90th=[  176], 99.95th=[  273],
     | 99.99th=[ 4047]
   bw (  KiB/s): min=21264, max=26096, per=100.00%, avg=23143.60, stdev=1247.29, samples=20
   iops        : min= 5316, max= 6524, avg=5785.90, stdev=311.82, samples=20
  lat (usec)   : 50=0.19%, 100=87.64%, 250=12.13%, 500=0.02%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=9.63%, sys=30.64%, ctx=116036, majf=0, minf=282
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=58076,57859,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=22.7MiB/s (23.8MB/s), 22.7MiB/s-22.7MiB/s (23.8MB/s-23.8MB/s), io=227MiB (238MB), run=10001-10001msec
  WRITE: bw=22.6MiB/s (23.7MB/s), 22.6MiB/s-22.6MiB/s (23.7MB/s-23.7MB/s), io=226MiB (237MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/63, sectors=0/12736, merge=0/32, ticks=0/38, in_queue=39, util=0.05%
```
