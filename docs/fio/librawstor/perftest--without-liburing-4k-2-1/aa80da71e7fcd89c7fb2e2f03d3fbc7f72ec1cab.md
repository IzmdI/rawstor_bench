[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-09-09 20:04:05

refs/heads/main

[aa80da7](https://github.com/rawstor/librawstor/commit/aa80da71e7fcd89c7fb2e2f03d3fbc7f72ec1cab)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11327: Tue Sep  9 20:04:03 2025
  read: IOPS=10.1k, BW=39.3MiB/s (41.2MB/s)(393MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=113, max=10111, avg=5082.01, stdev=2901.17
     lat (usec): min=32, max=27523, avg=91.84, stdev=225.15
    clat percentiles (msec):
     |  1.00th=[  207],  5.00th=[  575], 10.00th=[ 1062], 20.00th=[ 2072],
     | 30.00th=[ 3071], 40.00th=[ 4044], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38432, max=44400, per=100.00%, avg=40212.80, stdev=1523.77, samples=20
   iops        : min= 9608, max=11100, avg=10053.20, stdev=380.94, samples=20
  write: IOPS=10.0k, BW=39.2MiB/s (41.1MB/s)(392MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=113, max=10111, avg=5093.30, stdev=2910.46
     lat (usec): min=43, max=27506, avg=104.78, stdev=277.00
    clat percentiles (msec):
     |  1.00th=[  203],  5.00th=[  567], 10.00th=[ 1062], 20.00th=[ 2072],
     | 30.00th=[ 3071], 40.00th=[ 4044], 50.00th=[ 5134], 60.00th=[ 6074],
     | 70.00th=[ 7148], 80.00th=[ 8154], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=37344, max=44656, per=100.00%, avg=40164.00, stdev=1652.42, samples=20
   iops        : min= 9336, max=11164, avg=10041.00, stdev=413.11, samples=20
  lat (msec)   : 250=1.51%, 500=2.72%, 750=2.59%, 1000=2.53%, 2000=9.95%
  lat (msec)   : >=2000=80.70%
  cpu          : usr=10.24%, sys=38.11%, ctx=104910, majf=0, minf=282
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=100532,100410,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=39.3MiB/s (41.2MB/s), 39.3MiB/s-39.3MiB/s (41.2MB/s-41.2MB/s), io=393MiB (412MB), run=10001-10001msec
  WRITE: bw=39.2MiB/s (41.1MB/s), 39.2MiB/s-39.2MiB/s (41.1MB/s-41.1MB/s), io=392MiB (411MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/117, sectors=0/35584, merge=0/1026, ticks=0/306, in_queue=318, util=0.25%
```
