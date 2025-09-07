[&lt; back](..)

# perftest-4k-2-1

2025-08-22 22:27:21

refs/heads/main

[eb4dfa5](https://github.com/rawstor/librawstor/commit/eb4dfa59ddc20ea79afe39adacbbe2df88d2c840)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10740: Fri Aug 22 22:27:19 2025
  read: IOPS=10.0k, BW=39.2MiB/s (41.1MB/s)(392MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5022.48, stdev=2926.13
     lat (usec): min=30, max=36992, avg=85.47, stdev=289.59
    clat percentiles (msec):
     |  1.00th=[  205],  5.00th=[  567], 10.00th=[ 1003], 20.00th=[ 1938],
     | 30.00th=[ 2937], 40.00th=[ 3977], 50.00th=[ 5000], 60.00th=[ 6074],
     | 70.00th=[ 7013], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=36352, max=45808, per=100.00%, avg=40133.20, stdev=2652.70, samples=20
   iops        : min= 9088, max=11452, avg=10033.30, stdev=663.18, samples=20
  write: IOPS=10.0k, BW=39.1MiB/s (41.0MB/s)(391MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5033.03, stdev=2934.97
     lat (usec): min=48, max=40971, avg=111.11, stdev=387.40
    clat percentiles (msec):
     |  1.00th=[  201],  5.00th=[  558], 10.00th=[ 1003], 20.00th=[ 1921],
     | 30.00th=[ 2937], 40.00th=[ 3977], 50.00th=[ 5000], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8154], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=35608, max=45504, per=100.00%, avg=40076.40, stdev=2619.25, samples=20
   iops        : min= 8902, max=11376, avg=10019.10, stdev=654.81, samples=20
  lat (msec)   : 250=1.52%, 500=2.75%, 750=2.86%, 1000=2.90%, 2000=10.70%
  lat (msec)   : >=2000=79.29%
  cpu          : usr=7.92%, sys=48.96%, ctx=137360, majf=0, minf=272
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=100333,100191,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=39.2MiB/s (41.1MB/s), 39.2MiB/s-39.2MiB/s (41.1MB/s-41.1MB/s), io=392MiB (411MB), run=10001-10001msec
  WRITE: bw=39.1MiB/s (41.0MB/s), 39.1MiB/s-39.1MiB/s (41.0MB/s-41.0MB/s), io=391MiB (410MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/52, sectors=0/12128, merge=0/34, ticks=0/36, in_queue=35, util=0.02%
```
