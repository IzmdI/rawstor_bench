[&lt; back](..)

# perftest-4k-2-1

2025-08-10 17:10:02

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10509: Sun Aug 10 17:10:01 2025
  read: IOPS=9222, BW=36.0MiB/s (37.8MB/s)(360MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10105, avg=5078.87, stdev=2881.07
     lat (usec): min=33, max=28743, avg=94.38, stdev=264.22
    clat percentiles (msec):
     |  1.00th=[  218],  5.00th=[  625], 10.00th=[ 1083], 20.00th=[ 2089],
     | 30.00th=[ 3071], 40.00th=[ 4077], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=34808, max=40720, per=100.00%, avg=36894.00, stdev=1550.45, samples=20
   iops        : min= 8702, max=10180, avg=9223.50, stdev=387.61, samples=20
  write: IOPS=9193, BW=35.9MiB/s (37.7MB/s)(359MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5081.78, stdev=2887.94
     lat (usec): min=56, max=29607, avg=120.23, stdev=297.13
    clat percentiles (msec):
     |  1.00th=[  211],  5.00th=[  617], 10.00th=[ 1083], 20.00th=[ 2072],
     | 30.00th=[ 3037], 40.00th=[ 4044], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=34664, max=39960, per=100.00%, avg=36778.80, stdev=1424.20, samples=20
   iops        : min= 8666, max= 9990, avg=9194.70, stdev=356.05, samples=20
  lat (msec)   : 250=1.34%, 500=2.31%, 750=2.77%, 1000=2.75%, 2000=9.94%
  lat (msec)   : >=2000=80.89%
  cpu          : usr=7.98%, sys=24.65%, ctx=182315, majf=0, minf=272
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=92235,91947,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=36.0MiB/s (37.8MB/s), 36.0MiB/s-36.0MiB/s (37.8MB/s-37.8MB/s), io=360MiB (378MB), run=10001-10001msec
  WRITE: bw=35.9MiB/s (37.7MB/s), 35.9MiB/s-35.9MiB/s (37.7MB/s-37.7MB/s), io=359MiB (377MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/57, sectors=0/12536, merge=0/38, ticks=0/45, in_queue=45, util=0.04%
```
