[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-09-01 19:26:01 UTC

refs/heads/feat/no_poll

[4eb396b](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10904: Mon Sep  1 19:25:59 2025
  read: IOPS=6618, BW=25.9MiB/s (27.1MB/s)(259MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5049.57, stdev=2903.43
     lat (usec): min=66, max=35229, avg=153.43, stdev=338.01
    clat percentiles (msec):
     |  1.00th=[  213],  5.00th=[  600], 10.00th=[ 1053], 20.00th=[ 2022],
     | 30.00th=[ 3004], 40.00th=[ 4010], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=24696, max=29032, per=100.00%, avg=26575.16, stdev=1211.72, samples=19
   iops        : min= 6174, max= 7258, avg=6643.79, stdev=302.93, samples=19
  write: IOPS=6582, BW=25.7MiB/s (27.0MB/s)(257MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5036.57, stdev=2904.55
     lat (usec): min=64, max=35196, avg=146.40, stdev=302.46
    clat percentiles (msec):
     |  1.00th=[  207],  5.00th=[  575], 10.00th=[ 1045], 20.00th=[ 2005],
     | 30.00th=[ 3004], 40.00th=[ 3977], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=24512, max=28440, per=100.00%, avg=26450.95, stdev=1063.37, samples=19
   iops        : min= 6128, max= 7110, avg=6612.74, stdev=265.84, samples=19
  lat (msec)   : 250=1.43%, 500=2.65%, 750=2.66%, 1000=2.72%, 2000=10.35%
  lat (msec)   : >=2000=80.20%
  cpu          : usr=9.99%, sys=23.99%, ctx=296714, majf=0, minf=283
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=66193,65833,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=25.9MiB/s (27.1MB/s), 25.9MiB/s-25.9MiB/s (27.1MB/s-27.1MB/s), io=259MiB (271MB), run=10001-10001msec
  WRITE: bw=25.7MiB/s (27.0MB/s), 25.7MiB/s-25.7MiB/s (27.0MB/s-27.0MB/s), io=257MiB (270MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/50, sectors=0/11792, merge=0/25, ticks=0/36, in_queue=36, util=0.03%
```
