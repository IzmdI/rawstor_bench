[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-08-27 21:41:59

refs/heads/main

[ad80eec](https://github.com/rawstor/librawstor/commit/ad80eec81bb26cbbb01dde51a65dd7dfe19a8be1)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10776: Wed Aug 27 21:41:58 2025
  read: IOPS=9539, BW=37.3MiB/s (39.1MB/s)(373MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5056.42, stdev=2892.39
     lat (usec): min=27, max=31057, avg=96.50, stdev=255.44
    clat percentiles (msec):
     |  1.00th=[  213],  5.00th=[  584], 10.00th=[ 1036], 20.00th=[ 2039],
     | 30.00th=[ 3071], 40.00th=[ 4077], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7013], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=35712, max=41960, per=100.00%, avg=38162.00, stdev=1734.04, samples=20
   iops        : min= 8928, max=10490, avg=9540.50, stdev=433.51, samples=20
  write: IOPS=9518, BW=37.2MiB/s (39.0MB/s)(372MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5063.53, stdev=2901.12
     lat (usec): min=52, max=31080, avg=110.70, stdev=341.99
    clat percentiles (msec):
     |  1.00th=[  209],  5.00th=[  575], 10.00th=[ 1036], 20.00th=[ 2022],
     | 30.00th=[ 3037], 40.00th=[ 4077], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=35128, max=41240, per=100.00%, avg=38077.20, stdev=1601.24, samples=20
   iops        : min= 8782, max=10310, avg=9519.30, stdev=400.31, samples=20
  lat (msec)   : 250=1.44%, 500=2.70%, 750=2.88%, 1000=2.63%, 2000=10.06%
  lat (msec)   : >=2000=80.30%
  cpu          : usr=10.46%, sys=36.84%, ctx=100024, majf=0, minf=274
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=95405,95193,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=37.3MiB/s (39.1MB/s), 37.3MiB/s-37.3MiB/s (39.1MB/s-39.1MB/s), io=373MiB (391MB), run=10001-10001msec
  WRITE: bw=37.2MiB/s (39.0MB/s), 37.2MiB/s-37.2MiB/s (39.0MB/s-39.0MB/s), io=372MiB (390MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/172, sectors=0/17000, merge=0/550, ticks=0/147, in_queue=147, util=0.06%
```
