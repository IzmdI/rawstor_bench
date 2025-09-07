[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-08-27 21:42:29 UTC

refs/heads/main

[ad80eec](https://github.com/rawstor/librawstor/commit/ad80eec81bb26cbbb01dde51a65dd7dfe19a8be1)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10767: Wed Aug 27 21:42:28 2025
  read: IOPS=5962, BW=23.3MiB/s (24.4MB/s)(233MiB/10001msec)
    slat (nsec): min=30, max=17813, avg=162.70, stdev=205.69
    clat (usec): min=40, max=27177, avg=71.21, stdev=248.11
     lat (usec): min=41, max=27178, avg=71.38, stdev=248.11
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   56], 10.00th=[   58], 20.00th=[   61],
     | 30.00th=[   63], 40.00th=[   65], 50.00th=[   68], 60.00th=[   70],
     | 70.00th=[   73], 80.00th=[   76], 90.00th=[   82], 95.00th=[   88],
     | 99.00th=[  101], 99.50th=[  109], 99.90th=[  128], 99.95th=[  155],
     | 99.99th=[20579]
   bw (  KiB/s): min=21672, max=25736, per=100.00%, avg=23854.00, stdev=1262.25, samples=20
   iops        : min= 5418, max= 6434, avg=5963.50, stdev=315.56, samples=20
  write: IOPS=5949, BW=23.2MiB/s (24.4MB/s)(232MiB/10001msec); 0 zone resets
    slat (nsec): min=70, max=17513, avg=216.40, stdev=226.25
    clat (usec): min=55, max=27493, avg=93.12, stdev=113.24
     lat (usec): min=55, max=27493, avg=93.33, stdev=113.25
    clat percentiles (usec):
     |  1.00th=[   75],  5.00th=[   79], 10.00th=[   82], 20.00th=[   84],
     | 30.00th=[   87], 40.00th=[   89], 50.00th=[   92], 60.00th=[   94],
     | 70.00th=[   97], 80.00th=[  100], 90.00th=[  106], 95.00th=[  113],
     | 99.00th=[  127], 99.50th=[  135], 99.90th=[  159], 99.95th=[  180],
     | 99.99th=[  371]
   bw (  KiB/s): min=22232, max=26160, per=100.00%, avg=23800.00, stdev=1032.54, samples=20
   iops        : min= 5558, max= 6540, avg=5950.00, stdev=258.14, samples=20
  lat (usec)   : 50=0.15%, 100=89.56%, 250=10.27%, 500=0.01%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 50=0.01%
  cpu          : usr=7.62%, sys=32.45%, ctx=119206, majf=0, minf=274
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=59635,59500,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.3MiB/s (24.4MB/s), 23.3MiB/s-23.3MiB/s (24.4MB/s-24.4MB/s), io=233MiB (244MB), run=10001-10001msec
  WRITE: bw=23.2MiB/s (24.4MB/s), 23.2MiB/s-23.2MiB/s (24.4MB/s-24.4MB/s), io=232MiB (244MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/53, sectors=0/11696, merge=0/34, ticks=0/41, in_queue=42, util=0.03%
```
