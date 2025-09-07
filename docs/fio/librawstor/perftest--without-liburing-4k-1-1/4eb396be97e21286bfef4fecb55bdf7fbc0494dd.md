[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-01 19:25:57 UTC

refs/heads/feat/no_poll

[4eb396b](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10904: Mon Sep  1 19:25:56 2025
  read: IOPS=4030, BW=15.7MiB/s (16.5MB/s)(157MiB/10001msec)
    slat (nsec): min=30, max=19627, avg=198.62, stdev=302.80
    clat (usec): min=65, max=19748, avg=122.97, stdev=138.17
     lat (usec): min=65, max=19748, avg=123.17, stdev=138.17
    clat percentiles (usec):
     |  1.00th=[   90],  5.00th=[   98], 10.00th=[  104], 20.00th=[  111],
     | 30.00th=[  115], 40.00th=[  118], 50.00th=[  122], 60.00th=[  125],
     | 70.00th=[  129], 80.00th=[  135], 90.00th=[  141], 95.00th=[  147],
     | 99.00th=[  161], 99.50th=[  169], 99.90th=[  225], 99.95th=[  322],
     | 99.99th=[ 1205]
   bw (  KiB/s): min=14760, max=18528, per=100.00%, avg=16122.00, stdev=1016.31, samples=20
   iops        : min= 3690, max= 4632, avg=4030.50, stdev=254.08, samples=20
  write: IOPS=4020, BW=15.7MiB/s (16.5MB/s)(157MiB/10001msec); 0 zone resets
    slat (nsec): min=60, max=25848, avg=264.25, stdev=296.53
    clat (usec): min=74, max=23562, avg=121.47, stdev=203.37
     lat (usec): min=74, max=23563, avg=121.74, stdev=203.37
    clat percentiles (usec):
     |  1.00th=[   97],  5.00th=[  102], 10.00th=[  105], 20.00th=[  110],
     | 30.00th=[  113], 40.00th=[  116], 50.00th=[  119], 60.00th=[  122],
     | 70.00th=[  125], 80.00th=[  129], 90.00th=[  135], 95.00th=[  141],
     | 99.00th=[  157], 99.50th=[  169], 99.90th=[  227], 99.95th=[  310],
     | 99.99th=[ 6652]
   bw (  KiB/s): min=14976, max=18128, per=100.00%, avg=16082.40, stdev=975.02, samples=20
   iops        : min= 3744, max= 4532, avg=4020.60, stdev=243.76, samples=20
  lat (usec)   : 100=4.59%, 250=95.32%, 500=0.06%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=8.46%, sys=16.49%, ctx=202741, majf=0, minf=283
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=40305,40206,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=15.7MiB/s (16.5MB/s), 15.7MiB/s-15.7MiB/s (16.5MB/s-16.5MB/s), io=157MiB (165MB), run=10001-10001msec
  WRITE: bw=15.7MiB/s (16.5MB/s), 15.7MiB/s-15.7MiB/s (16.5MB/s-16.5MB/s), io=157MiB (165MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/50, sectors=0/11888, merge=0/40, ticks=0/47, in_queue=47, util=0.02%
```
