[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-11-09 20:40:01

refs/heads/main

[c99dace](https://github.com/rawstor/librawstor/commit/c99dacedeb85a64ab4d79b60baee10727dbb73cb)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15689: Mon Nov  9 20:39:34 2026
  read: IOPS=383k, BW=1496MiB/s (1569MB/s)(14.6GiB/10001msec)
    slat (nsec): min=270, max=41117, avg=383.94, stdev=223.77
    clat (nsec): min=2715, max=91532, avg=4609.66, stdev=1351.96
     lat (nsec): min=3045, max=91892, avg=4993.60, stdev=1365.33
    clat percentiles (nsec):
     |  1.00th=[ 2992],  5.00th=[ 3152], 10.00th=[ 3376], 20.00th=[ 3824],
     | 30.00th=[ 4128], 40.00th=[ 4320], 50.00th=[ 4384], 60.00th=[ 4512],
     | 70.00th=[ 4640], 80.00th=[ 4832], 90.00th=[ 6304], 95.00th=[ 7392],
     | 99.00th=[ 7968], 99.50th=[11584], 99.90th=[16768], 99.95th=[19584],
     | 99.99th=[25216]
   bw (  MiB/s): min= 1450, max= 1530, per=100.00%, avg=1497.38, stdev=20.41, samples=20
   iops        : min=371312, max=391850, avg=383329.35, stdev=5225.86, samples=20
  lat (usec)   : 4=24.67%, 10=74.78%, 20=0.50%, 50=0.05%, 100=0.01%
  cpu          : usr=53.33%, sys=46.65%, ctx=50, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3831229,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15695: Mon Nov  9 20:39:34 2026
  write: IOPS=3193, BW=12.5MiB/s (13.1MB/s)(125MiB/10001msec); 0 zone resets
    slat (nsec): min=541, max=26850, avg=1855.21, stdev=1231.99
    clat (usec): min=223, max=14652, avg=623.47, stdev=262.06
     lat (usec): min=225, max=14652, avg=625.33, stdev=261.86
    clat percentiles (usec):
     |  1.00th=[  249],  5.00th=[  302], 10.00th=[  392], 20.00th=[  529],
     | 30.00th=[  553], 40.00th=[  578], 50.00th=[  603], 60.00th=[  627],
     | 70.00th=[  652], 80.00th=[  701], 90.00th=[  848], 95.00th=[  938],
     | 99.00th=[ 1172], 99.50th=[ 1483], 99.90th=[ 3720], 99.95th=[ 5211],
     | 99.99th=[ 6325]
   bw (  KiB/s): min=11544, max=13352, per=100.00%, avg=12775.80, stdev=518.70, samples=20
   iops        : min= 2886, max= 3338, avg=3193.90, stdev=129.63, samples=20
  lat (usec)   : 250=1.18%, 500=12.76%, 750=70.89%, 1000=12.34%
  lat (msec)   : 2=2.57%, 4=0.17%, 10=0.08%, 20=0.01%
  cpu          : usr=2.20%, sys=10.95%, ctx=64261, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,31934,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1496MiB/s (1569MB/s), 1496MiB/s-1496MiB/s (1569MB/s-1569MB/s), io=14.6GiB (15.7GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=12.5MiB/s (13.1MB/s), 12.5MiB/s-12.5MiB/s (13.1MB/s-13.1MB/s), io=125MiB (131MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=6/81557, sectors=48/2284456, merge=0/123530, ticks=32/13117, in_queue=13151, util=37.73%
```
