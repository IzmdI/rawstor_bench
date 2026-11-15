[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-15 12:50:15

refs/heads/add/tls

[5a5b8dd](https://github.com/rawstor/librawstor/commit/5a5b8ddc2b5a1dea70acd4a37ee6a9d4a8aae73d)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16219: Sun Nov 15 12:49:55 2026
  read: IOPS=21.0k, BW=82.1MiB/s (86.0MB/s)(821MiB/10001msec)
    slat (nsec): min=473, max=34985, avg=1133.38, stdev=728.56
    clat (usec): min=34, max=1004, avg=93.35, stdev=35.12
     lat (usec): min=35, max=1008, avg=94.48, stdev=35.18
    clat percentiles (usec):
     |  1.00th=[   46],  5.00th=[   52], 10.00th=[   57], 20.00th=[   65],
     | 30.00th=[   72], 40.00th=[   78], 50.00th=[   84], 60.00th=[   92],
     | 70.00th=[  104], 80.00th=[  124], 90.00th=[  147], 95.00th=[  161],
     | 99.00th=[  192], 99.50th=[  206], 99.90th=[  249], 99.95th=[  277],
     | 99.99th=[  388]
   bw (  KiB/s): min=68232, max=90272, per=100.00%, avg=84073.15, stdev=4412.21, samples=20
   iops        : min=17058, max=22568, avg=21018.25, stdev=1103.15, samples=20
  lat (usec)   : 50=3.59%, 100=63.93%, 250=32.38%, 500=0.09%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=22.19%, sys=23.29%, ctx=132996, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=210093,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=16221: Sun Nov 15 12:49:55 2026
  write: IOPS=4293, BW=16.8MiB/s (17.6MB/s)(168MiB/10001msec); 0 zone resets
    slat (nsec): min=876, max=30845, avg=3115.12, stdev=1624.70
    clat (usec): min=255, max=21202, avg=461.25, stdev=203.77
     lat (usec): min=258, max=21205, avg=464.37, stdev=203.70
    clat percentiles (usec):
     |  1.00th=[  297],  5.00th=[  322], 10.00th=[  338], 20.00th=[  359],
     | 30.00th=[  379], 40.00th=[  396], 50.00th=[  416], 60.00th=[  445],
     | 70.00th=[  498], 80.00th=[  578], 90.00th=[  652], 95.00th=[  701],
     | 99.00th=[  807], 99.50th=[  865], 99.90th=[ 1074], 99.95th=[ 1303],
     | 99.99th=[ 8094]
   bw (  KiB/s): min=15535, max=17872, per=100.00%, avg=17180.95, stdev=571.04, samples=20
   iops        : min= 3883, max= 4468, avg=4295.15, stdev=142.86, samples=20
  lat (usec)   : 500=70.39%, 750=27.32%, 1000=2.14%
  lat (msec)   : 2=0.12%, 4=0.02%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=7.79%, sys=8.11%, ctx=36806, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,42938,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=82.1MiB/s (86.0MB/s), 82.1MiB/s-82.1MiB/s (86.0MB/s-86.0MB/s), io=821MiB (861MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.8MiB/s (17.6MB/s), 16.8MiB/s-16.8MiB/s (17.6MB/s-17.6MB/s), io=168MiB (176MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/103346, sectors=224/2282408, merge=0/160165, ticks=4/11186, in_queue=11190, util=29.28%
```
