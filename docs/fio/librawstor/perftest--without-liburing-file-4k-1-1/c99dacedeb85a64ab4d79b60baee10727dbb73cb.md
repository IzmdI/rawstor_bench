[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-09 20:40:01

refs/heads/main

[c99dace](https://github.com/rawstor/librawstor/commit/c99dacedeb85a64ab4d79b60baee10727dbb73cb)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15577: Mon Nov  9 20:39:26 2026
  read: IOPS=371k, BW=1451MiB/s (1521MB/s)(14.2GiB/10001msec)
    slat (nsec): min=246, max=65109, avg=353.70, stdev=233.08
    clat (nsec): min=1074, max=97727, avg=2139.03, stdev=662.54
     lat (nsec): min=1365, max=98016, avg=2492.73, stdev=727.06
    clat percentiles (nsec):
     |  1.00th=[ 1400],  5.00th=[ 1496], 10.00th=[ 1560], 20.00th=[ 1688],
     | 30.00th=[ 2096], 40.00th=[ 2160], 50.00th=[ 2224], 60.00th=[ 2256],
     | 70.00th=[ 2288], 80.00th=[ 2352], 90.00th=[ 2416], 95.00th=[ 2512],
     | 99.00th=[ 2832], 99.50th=[ 3920], 99.90th=[11072], 99.95th=[13376],
     | 99.99th=[21120]
   bw (  MiB/s): min= 1316, max= 1478, per=100.00%, avg=1451.73, stdev=33.23, samples=20
   iops        : min=336931, max=378503, avg=371643.40, stdev=8508.06, samples=20
  lat (usec)   : 2=26.10%, 4=73.41%, 10=0.27%, 20=0.21%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=56.28%, sys=43.71%, ctx=64, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3714352,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15657: Mon Nov  9 20:39:26 2026
  write: IOPS=1891, BW=7565KiB/s (7747kB/s)(73.9MiB/10001msec); 0 zone resets
    slat (nsec): min=1115, max=30779, avg=2547.61, stdev=2958.86
    clat (usec): min=301, max=126713, avg=525.24, stdev=1672.91
     lat (usec): min=303, max=126730, avg=527.79, stdev=1673.09
    clat percentiles (usec):
     |  1.00th=[  338],  5.00th=[  359], 10.00th=[  375], 20.00th=[  400],
     | 30.00th=[  416], 40.00th=[  433], 50.00th=[  445], 60.00th=[  461],
     | 70.00th=[  478], 80.00th=[  498], 90.00th=[  529], 95.00th=[  570],
     | 99.00th=[ 1037], 99.50th=[ 1385], 99.90th=[22676], 99.95th=[23987],
     | 99.99th=[81265]
   bw (  KiB/s): min= 3376, max= 8456, per=100.00%, avg=7569.05, stdev=1217.41, samples=20
   iops        : min=  844, max= 2114, avg=1892.15, stdev=304.33, samples=20
  lat (usec)   : 500=80.42%, 750=17.86%, 1000=0.67%
  lat (msec)   : 2=0.77%, 4=0.04%, 10=0.02%, 20=0.01%, 50=0.20%
  lat (msec)   : 100=0.02%, 250=0.01%
  cpu          : usr=1.81%, sys=6.06%, ctx=37969, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,18915,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1451MiB/s (1521MB/s), 1451MiB/s-1451MiB/s (1521MB/s-1521MB/s), io=14.2GiB (15.2GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=7565KiB/s (7747kB/s), 7565KiB/s-7565KiB/s (7747kB/s-7747kB/s), io=73.9MiB (77.5MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=4/51046, sectors=32/2290584, merge=0/73906, ticks=5/203765, in_queue=203783, util=52.50%
```
