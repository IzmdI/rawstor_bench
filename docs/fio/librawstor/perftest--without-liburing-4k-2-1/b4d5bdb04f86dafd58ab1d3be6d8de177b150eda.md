[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-08-10 17:09:37 UTC

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10482: Sun Aug 10 17:09:36 2025
  read: IOPS=8941, BW=34.9MiB/s (36.6MB/s)(349MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10110, avg=5065.97, stdev=2881.83
     lat (usec): min=32, max=29386, avg=96.32, stdev=234.93
    clat percentiles (msec):
     |  1.00th=[  218],  5.00th=[  609], 10.00th=[ 1062], 20.00th=[ 2056],
     | 30.00th=[ 3071], 40.00th=[ 4077], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7013], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=32472, max=39752, per=100.00%, avg=35769.60, stdev=1613.42, samples=20
   iops        : min= 8118, max= 9938, avg=8942.40, stdev=403.36, samples=20
  write: IOPS=8914, BW=34.8MiB/s (36.5MB/s)(348MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5069.80, stdev=2890.05
     lat (usec): min=61, max=29403, avg=125.19, stdev=323.73
    clat percentiles (msec):
     |  1.00th=[  211],  5.00th=[  600], 10.00th=[ 1062], 20.00th=[ 2039],
     | 30.00th=[ 3071], 40.00th=[ 4077], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=33264, max=38896, per=100.00%, avg=35663.20, stdev=1463.17, samples=20
   iops        : min= 8316, max= 9724, avg=8915.80, stdev=365.79, samples=20
  lat (msec)   : 250=1.35%, 500=2.55%, 750=2.68%, 1000=2.74%, 2000=10.23%
  lat (msec)   : >=2000=80.44%
  cpu          : usr=9.56%, sys=22.42%, ctx=177181, majf=0, minf=284
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=89424,89158,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=34.9MiB/s (36.6MB/s), 34.9MiB/s-34.9MiB/s (36.6MB/s-36.6MB/s), io=349MiB (366MB), run=10001-10001msec
  WRITE: bw=34.8MiB/s (36.5MB/s), 34.8MiB/s-34.8MiB/s (36.5MB/s-36.5MB/s), io=348MiB (365MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/52, sectors=0/12224, merge=0/37, ticks=0/38, in_queue=39, util=0.01%
```
