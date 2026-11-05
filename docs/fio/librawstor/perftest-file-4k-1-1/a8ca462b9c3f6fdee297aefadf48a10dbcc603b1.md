[&lt; back](..)

# perftest-file-4k-1-1

2026-11-05 21:00:41

refs/heads/main

[a8ca462](https://github.com/rawstor/librawstor/commit/a8ca462b9c3f6fdee297aefadf48a10dbcc603b1)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15300: Thu Nov  5 20:59:34 2026
  read: IOPS=400k, BW=1564MiB/s (1640MB/s)(15.3GiB/10001msec)
    slat (nsec): min=320, max=217657, avg=389.08, stdev=397.08
    clat (nsec): min=1422, max=332328, avg=1954.22, stdev=1357.40
     lat (nsec): min=1782, max=332719, avg=2343.30, stdev=1429.34
    clat percentiles (nsec):
     |  1.00th=[ 1608],  5.00th=[ 1672], 10.00th=[ 1720], 20.00th=[ 1784],
     | 30.00th=[ 1816], 40.00th=[ 1848], 50.00th=[ 1880], 60.00th=[ 1928],
     | 70.00th=[ 1960], 80.00th=[ 2008], 90.00th=[ 2096], 95.00th=[ 2192],
     | 99.00th=[ 2448], 99.50th=[ 2832], 99.90th=[14400], 99.95th=[25472],
     | 99.99th=[59648]
   bw (  MiB/s): min= 1413, max= 1684, per=100.00%, avg=1565.00, stdev=63.95, samples=20
   iops        : min=361905, max=431268, avg=400640.70, stdev=16371.55, samples=20
  lat (usec)   : 2=77.27%, 4=22.35%, 10=0.22%, 20=0.10%, 50=0.05%
  lat (usec)   : 100=0.01%, 250=0.01%, 500=0.01%
  cpu          : usr=38.53%, sys=61.46%, ctx=68, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4003982,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15305: Thu Nov  5 20:59:34 2026
  write: IOPS=2918, BW=11.4MiB/s (12.0MB/s)(114MiB/10001msec); 0 zone resets
    slat (nsec): min=661, max=94632, avg=975.10, stdev=928.76
    clat (usec): min=218, max=119809, avg=341.38, stdev=920.11
     lat (usec): min=219, max=119820, avg=342.35, stdev=920.22
    clat percentiles (usec):
     |  1.00th=[  237],  5.00th=[  251], 10.00th=[  262], 20.00th=[  277],
     | 30.00th=[  289], 40.00th=[  302], 50.00th=[  310], 60.00th=[  318],
     | 70.00th=[  330], 80.00th=[  343], 90.00th=[  367], 95.00th=[  424],
     | 99.00th=[  832], 99.50th=[ 1106], 99.90th=[ 2671], 99.95th=[ 9765],
     | 99.99th=[47973]
   bw (  KiB/s): min= 4344, max=12977, per=100.00%, avg=11678.70, stdev=1895.73, samples=20
   iops        : min= 1086, max= 3244, avg=2919.60, stdev=473.93, samples=20
  lat (usec)   : 250=4.65%, 500=92.19%, 750=1.89%, 1000=0.62%
  lat (msec)   : 2=0.52%, 4=0.04%, 10=0.04%, 20=0.03%, 50=0.01%
  lat (msec)   : 100=0.01%, 250=0.01%
  cpu          : usr=0.70%, sys=1.69%, ctx=29186, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,29186,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1564MiB/s (1640MB/s), 1564MiB/s-1564MiB/s (1640MB/s-1640MB/s), io=15.3GiB (16.4GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.4MiB/s (12.0MB/s), 11.4MiB/s-11.4MiB/s (12.0MB/s-12.0MB/s), io=114MiB (120MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=16/77001, sectors=128/2261056, merge=0/114752, ticks=36/76523, in_queue=76558, util=44.12%
```
