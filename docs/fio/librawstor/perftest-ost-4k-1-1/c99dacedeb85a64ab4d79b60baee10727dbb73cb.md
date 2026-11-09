[&lt; back](..)

# perftest-ost-4k-1-1

2026-11-09 20:40:01

refs/heads/main

[c99dace](https://github.com/rawstor/librawstor/commit/c99dacedeb85a64ab4d79b60baee10727dbb73cb)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15502: Mon Nov  9 20:39:14 2026
  read: IOPS=29.2k, BW=114MiB/s (120MB/s)(1142MiB/10001msec)
    slat (nsec): min=301, max=23305, avg=523.59, stdev=336.96
    clat (usec): min=26, max=367, avg=33.30, stdev= 5.37
     lat (usec): min=26, max=368, avg=33.82, stdev= 5.46
    clat percentiles (usec):
     |  1.00th=[   29],  5.00th=[   29], 10.00th=[   30], 20.00th=[   30],
     | 30.00th=[   30], 40.00th=[   31], 50.00th=[   34], 60.00th=[   34],
     | 70.00th=[   35], 80.00th=[   36], 90.00th=[   39], 95.00th=[   43],
     | 99.00th=[   52], 99.50th=[   55], 99.90th=[   65], 99.95th=[   73],
     | 99.99th=[  194]
   bw (  KiB/s): min=104360, max=127951, per=100.00%, avg=116997.60, stdev=5872.37, samples=20
   iops        : min=26090, max=31987, avg=29249.30, stdev=1468.01, samples=20
  lat (usec)   : 50=98.62%, 100=1.36%, 250=0.01%, 500=0.01%
  cpu          : usr=7.94%, sys=40.12%, ctx=292371, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=292360,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15504: Mon Nov  9 20:39:14 2026
  write: IOPS=2430, BW=9722KiB/s (9956kB/s)(95.0MiB/10003msec); 0 zone resets
    slat (nsec): min=761, max=17637, avg=1944.76, stdev=769.08
    clat (usec): min=223, max=223320, avg=408.49, stdev=2669.10
     lat (usec): min=225, max=223322, avg=410.43, stdev=2669.10
    clat percentiles (usec):
     |  1.00th=[   243],  5.00th=[   253], 10.00th=[   262], 20.00th=[   277],
     | 30.00th=[   293], 40.00th=[   310], 50.00th=[   318], 60.00th=[   330],
     | 70.00th=[   338], 80.00th=[   351], 90.00th=[   371], 95.00th=[   400],
     | 99.00th=[   816], 99.50th=[  1401], 99.90th=[ 20055], 99.95th=[ 49546],
     | 99.99th=[141558]
   bw (  KiB/s): min= 3656, max=12800, per=100.00%, avg=9728.80, stdev=2419.95, samples=20
   iops        : min=  914, max= 3200, avg=2432.15, stdev=604.98, samples=20
  lat (usec)   : 250=3.42%, 500=94.10%, 750=1.27%, 1000=0.43%
  lat (msec)   : 2=0.40%, 4=0.14%, 10=0.10%, 20=0.04%, 50=0.05%
  lat (msec)   : 100=0.03%, 250=0.02%
  cpu          : usr=1.67%, sys=4.06%, ctx=24315, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,24313,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=114MiB/s (120MB/s), 114MiB/s-114MiB/s (120MB/s-120MB/s), io=1142MiB (1198MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=9722KiB/s (9956kB/s), 9722KiB/s-9722KiB/s (9956kB/s-9956kB/s), io=95.0MiB (99.6MB), run=10003-10003msec

Disk stats (read/write):
  nvme0n1: ios=25/63686, sectors=200/1444408, merge=0/95855, ticks=15/16906, in_queue=16921, util=36.67%
```
