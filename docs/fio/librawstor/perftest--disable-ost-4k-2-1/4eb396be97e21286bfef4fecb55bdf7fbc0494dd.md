[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-09-01 19:25:43

refs/heads/feat/no_poll

[4eb396b](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9801: Mon Sep  1 19:25:42 2025
  read: IOPS=70.3k, BW=274MiB/s (288MB/s)(2745MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5406.89, stdev=2809.78
     lat (nsec): min=1272, max=139101, avg=5059.62, stdev=3811.11
    clat percentiles (msec):
     |  1.00th=[  228],  5.00th=[  701], 10.00th=[ 1368], 20.00th=[ 2601],
     | 30.00th=[ 3641], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6409],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=215856, max=319928, per=99.67%, avg=280100.21, stdev=36104.73, samples=19
   iops        : min=53964, max=79982, avg=70025.05, stdev=9026.18, samples=19
  write: IOPS=70.1k, BW=274MiB/s (287MB/s)(2740MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5404.40, stdev=2808.71
     lat (usec): min=3, max=980, avg=22.47, stdev= 6.90
    clat percentiles (msec):
     |  1.00th=[  226],  5.00th=[  701], 10.00th=[ 1368], 20.00th=[ 2601],
     | 30.00th=[ 3608], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6409],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=214104, max=319296, per=99.73%, avg=279833.26, stdev=35951.61, samples=19
   iops        : min=53526, max=79824, avg=69958.32, stdev=8987.90, samples=19
  lat (msec)   : 250=1.20%, 500=2.08%, 750=2.07%, 1000=1.94%, 2000=7.67%
  lat (msec)   : >=2000=85.04%
  cpu          : usr=15.87%, sys=51.34%, ctx=290271, majf=0, minf=17
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=702636,701522,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=274MiB/s (288MB/s), 274MiB/s-274MiB/s (288MB/s-288MB/s), io=2745MiB (2878MB), run=10001-10001msec
  WRITE: bw=274MiB/s (287MB/s), 274MiB/s-274MiB/s (287MB/s-287MB/s), io=2740MiB (2873MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/118, sectors=0/33120, merge=0/733, ticks=0/197, in_queue=221, util=0.35%
```
