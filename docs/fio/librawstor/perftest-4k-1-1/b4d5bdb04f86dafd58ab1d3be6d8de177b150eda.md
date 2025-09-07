[&lt; back](..)

# perftest-4k-1-1

2025-08-10 17:09:56

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10499: Sun Aug 10 17:09:55 2025
  read: IOPS=6103, BW=23.8MiB/s (25.0MB/s)(238MiB/10001msec)
    slat (nsec): min=29, max=72546, avg=161.87, stdev=336.04
    clat (usec): min=40, max=27870, avg=67.78, stdev=185.80
     lat (usec): min=40, max=27871, avg=67.94, stdev=185.80
    clat percentiles (usec):
     |  1.00th=[   51],  5.00th=[   54], 10.00th=[   56], 20.00th=[   59],
     | 30.00th=[   61], 40.00th=[   63], 50.00th=[   65], 60.00th=[   68],
     | 70.00th=[   70], 80.00th=[   74], 90.00th=[   79], 95.00th=[   85],
     | 99.00th=[   99], 99.50th=[  108], 99.90th=[  127], 99.95th=[  159],
     | 99.99th=[ 1270]
   bw (  KiB/s): min=22448, max=26712, per=100.00%, avg=24418.40, stdev=1269.33, samples=20
   iops        : min= 5612, max= 6678, avg=6104.60, stdev=317.33, samples=20
  write: IOPS=6085, BW=23.8MiB/s (24.9MB/s)(238MiB/10001msec); 0 zone resets
    slat (nsec): min=60, max=17573, avg=238.18, stdev=246.02
    clat (usec): min=54, max=26347, avg=92.80, stdev=215.85
     lat (usec): min=54, max=26347, avg=93.04, stdev=215.85
    clat percentiles (usec):
     |  1.00th=[   74],  5.00th=[   78], 10.00th=[   80], 20.00th=[   83],
     | 30.00th=[   85], 40.00th=[   88], 50.00th=[   90], 60.00th=[   92],
     | 70.00th=[   94], 80.00th=[   98], 90.00th=[  104], 95.00th=[  110],
     | 99.00th=[  124], 99.50th=[  133], 99.90th=[  159], 99.95th=[  186],
     | 99.99th=[ 2311]
   bw (  KiB/s): min=22688, max=26904, per=100.00%, avg=24343.60, stdev=1134.19, samples=20
   iops        : min= 5672, max= 6726, avg=6085.90, stdev=283.55, samples=20
  lat (usec)   : 50=0.38%, 100=91.70%, 250=7.89%, 500=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=5.32%, sys=34.02%, ctx=121981, majf=0, minf=272
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=61046,60859,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.8MiB/s (25.0MB/s), 23.8MiB/s-23.8MiB/s (25.0MB/s-25.0MB/s), io=238MiB (250MB), run=10001-10001msec
  WRITE: bw=23.8MiB/s (24.9MB/s), 23.8MiB/s-23.8MiB/s (24.9MB/s-24.9MB/s), io=238MiB (249MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/64, sectors=0/12752, merge=0/31, ticks=0/40, in_queue=40, util=0.04%
```
