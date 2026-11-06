[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-06 23:18:25

refs/heads/docs-index-diagram

[e9ed680](https://github.com/rawstor/librawstor/commit/e9ed68032be1aedaae4c3b0d4545ebbef6c164ae)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15333: Fri Nov  6 23:16:56 2026
  read: IOPS=30.1k, BW=118MiB/s (123MB/s)(1178MiB/10001msec)
    slat (nsec): min=511, max=23044, avg=721.45, stdev=316.19
    clat (usec): min=26, max=243, avg=32.15, stdev= 4.21
     lat (usec): min=27, max=244, avg=32.87, stdev= 4.31
    clat percentiles (nsec):
     |  1.00th=[28544],  5.00th=[28800], 10.00th=[29056], 20.00th=[29312],
     | 30.00th=[29568], 40.00th=[29824], 50.00th=[30336], 60.00th=[31360],
     | 70.00th=[33536], 80.00th=[34560], 90.00th=[36608], 95.00th=[39680],
     | 99.00th=[48896], 99.50th=[51968], 99.90th=[59648], 99.95th=[64256],
     | 99.99th=[77312]
   bw (  KiB/s): min=107080, max=129592, per=100.00%, avg=120635.85, stdev=5990.47, samples=20
   iops        : min=26770, max=32398, avg=30158.90, stdev=1497.58, samples=20
  lat (usec)   : 50=99.22%, 100=0.78%, 250=0.01%
  cpu          : usr=8.49%, sys=39.76%, ctx=301455, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=301449,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15335: Fri Nov  6 23:16:56 2026
  write: IOPS=3084, BW=12.0MiB/s (12.6MB/s)(120MiB/10001msec); 0 zone resets
    slat (nsec): min=1161, max=27120, avg=2374.52, stdev=787.69
    clat (usec): min=222, max=20070, avg=320.89, stdev=332.74
     lat (usec): min=224, max=20072, avg=323.26, stdev=332.74
    clat percentiles (usec):
     |  1.00th=[  237],  5.00th=[  245], 10.00th=[  251], 20.00th=[  265],
     | 30.00th=[  281], 40.00th=[  297], 50.00th=[  306], 60.00th=[  318],
     | 70.00th=[  326], 80.00th=[  334], 90.00th=[  351], 95.00th=[  371],
     | 99.00th=[  603], 99.50th=[  783], 99.90th=[ 5080], 99.95th=[ 7439],
     | 99.99th=[14746]
   bw (  KiB/s): min=11527, max=13016, per=100.00%, avg=12342.80, stdev=417.91, samples=20
   iops        : min= 2881, max= 3254, avg=3085.60, stdev=104.56, samples=20
  lat (usec)   : 250=8.41%, 500=90.03%, 750=1.00%, 1000=0.20%
  lat (msec)   : 2=0.15%, 4=0.07%, 10=0.10%, 20=0.03%, 50=0.01%
  cpu          : usr=2.21%, sys=5.43%, ctx=30849, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,30846,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=118MiB/s (123MB/s), 118MiB/s-118MiB/s (123MB/s-123MB/s), io=1178MiB (1235MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=12.0MiB/s (12.6MB/s), 12.0MiB/s-12.0MiB/s (12.6MB/s-12.6MB/s), io=120MiB (126MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/78540, sectors=16/1737840, merge=0/118227, ticks=13/14886, in_queue=14899, util=33.65%
```
