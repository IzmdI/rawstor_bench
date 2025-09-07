[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-08-27 21:42:05 UTC

refs/heads/main

[ad80eec](https://github.com/rawstor/librawstor/commit/ad80eec81bb26cbbb01dde51a65dd7dfe19a8be1)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9790: Wed Aug 27 21:42:03 2025
  read: IOPS=167k, BW=651MiB/s (683MB/s)(6511MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5548.16, stdev=2716.45
     lat (nsec): min=1593, max=146212, avg=2384.41, stdev=1349.71
    clat percentiles (msec):
     |  1.00th=[  275],  5.00th=[ 1020], 10.00th=[ 1754], 20.00th=[ 2836],
     | 30.00th=[ 3809], 40.00th=[ 4732], 50.00th=[ 5671], 60.00th=[ 6544],
     | 70.00th=[ 7416], 80.00th=[ 8356], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=344920, max=757752, per=99.48%, avg=663215.00, stdev=132588.06, samples=19
   iops        : min=86230, max=189438, avg=165803.74, stdev=33147.04, samples=19
  write: IOPS=167k, BW=651MiB/s (682MB/s)(6506MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=105, max=10104, avg=5549.45, stdev=2716.95
     lat (usec): min=4, max=163, avg= 9.10, stdev= 4.94
    clat percentiles (msec):
     |  1.00th=[  275],  5.00th=[ 1020], 10.00th=[ 1754], 20.00th=[ 2836],
     | 30.00th=[ 3809], 40.00th=[ 4732], 50.00th=[ 5671], 60.00th=[ 6544],
     | 70.00th=[ 7416], 80.00th=[ 8356], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=345008, max=758672, per=99.45%, avg=662518.00, stdev=132275.71, samples=19
   iops        : min=86252, max=189668, avg=165629.47, stdev=33068.99, samples=19
  lat (msec)   : 250=0.86%, 500=1.43%, 750=1.33%, 1000=1.27%, 2000=7.28%
  lat (msec)   : >=2000=87.83%
  cpu          : usr=25.92%, sys=74.06%, ctx=73, majf=0, minf=15
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1666891,1665554,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=651MiB/s (683MB/s), 651MiB/s-651MiB/s (683MB/s-683MB/s), io=6511MiB (6828MB), run=10001-10001msec
  WRITE: bw=651MiB/s (682MB/s), 651MiB/s-651MiB/s (682MB/s-682MB/s), io=6506MiB (6822MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/93, sectors=0/28960, merge=0/695, ticks=0/408, in_queue=408, util=0.08%
```
