[&lt; back](..)

# perftest--disable-ost-4k-2-1

2025-08-07 13:59:31

refs/heads/feat/matrix

[dffaf1a](https://github.com/rawstor/librawstor/commit/dffaf1a8f748fb5ee5b5820a8add1973d5bd69fb)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9066: Thu Aug  7 13:59:30 2025
  read: IOPS=69.7k, BW=272MiB/s (285MB/s)(2722MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=105, max=10105, avg=5396.34, stdev=2813.17
     lat (nsec): min=1292, max=148087, avg=5192.84, stdev=3857.00
    clat percentiles (msec):
     |  1.00th=[  222],  5.00th=[  726], 10.00th=[ 1385], 20.00th=[ 2601],
     | 30.00th=[ 3574], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=208408, max=322376, per=99.33%, avg=276888.00, stdev=34666.80, samples=19
   iops        : min=52102, max=80594, avg=69222.00, stdev=8666.70, samples=19
  write: IOPS=69.6k, BW=272MiB/s (285MB/s)(2718MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=105, max=10105, avg=5394.13, stdev=2812.18
     lat (usec): min=3, max=743, avg=22.56, stdev= 6.73
    clat percentiles (msec):
     |  1.00th=[  222],  5.00th=[  726], 10.00th=[ 1385], 20.00th=[ 2601],
     | 30.00th=[ 3574], 40.00th=[ 4530], 50.00th=[ 5470], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9731],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=205976, max=324864, per=99.38%, avg=276607.16, stdev=34741.81, samples=19
   iops        : min=51494, max=81216, avg=69151.79, stdev=8685.35, samples=19
  lat (msec)   : 250=1.27%, 500=1.94%, 750=1.95%, 1000=1.91%, 2000=7.75%
  lat (msec)   : >=2000=85.18%
  cpu          : usr=15.78%, sys=49.11%, ctx=294134, majf=0, minf=15
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=696949,695888,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=272MiB/s (285MB/s), 272MiB/s-272MiB/s (285MB/s-285MB/s), io=2722MiB (2855MB), run=10001-10001msec
  WRITE: bw=272MiB/s (285MB/s), 272MiB/s-272MiB/s (285MB/s-285MB/s), io=2718MiB (2850MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/106, sectors=0/29680, merge=0/968, ticks=0/222, in_queue=232, util=0.18%
```
