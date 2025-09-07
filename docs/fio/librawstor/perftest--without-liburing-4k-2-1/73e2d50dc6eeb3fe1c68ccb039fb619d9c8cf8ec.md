[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-09-03 09:32:43 UTC

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10768: Wed Sep  3 09:32:42 2025
  read: IOPS=10.1k, BW=39.4MiB/s (41.3MB/s)(394MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10110, avg=5107.08, stdev=2892.00
     lat (usec): min=29, max=24890, avg=92.03, stdev=230.74
    clat percentiles (msec):
     |  1.00th=[  220],  5.00th=[  617], 10.00th=[ 1116], 20.00th=[ 2089],
     | 30.00th=[ 3104], 40.00th=[ 4077], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38152, max=42688, per=100.00%, avg=40366.80, stdev=1066.11, samples=20
   iops        : min= 9538, max=10672, avg=10091.70, stdev=266.53, samples=20
  write: IOPS=10.1k, BW=39.3MiB/s (41.3MB/s)(394MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10110, avg=5115.83, stdev=2899.78
     lat (usec): min=49, max=25649, avg=103.95, stdev=234.29
    clat percentiles (msec):
     |  1.00th=[  213],  5.00th=[  609], 10.00th=[ 1116], 20.00th=[ 2089],
     | 30.00th=[ 3071], 40.00th=[ 4077], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8154], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38792, max=41864, per=100.00%, avg=40298.40, stdev=910.48, samples=20
   iops        : min= 9698, max=10466, avg=10074.60, stdev=227.62, samples=20
  lat (msec)   : 250=1.34%, 500=2.52%, 750=2.43%, 1000=2.56%, 2000=10.14%
  lat (msec)   : >=2000=81.02%
  cpu          : usr=10.24%, sys=37.82%, ctx=106004, majf=0, minf=279
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=100917,100746,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=39.4MiB/s (41.3MB/s), 39.4MiB/s-39.4MiB/s (41.3MB/s-41.3MB/s), io=394MiB (413MB), run=10001-10001msec
  WRITE: bw=39.3MiB/s (41.3MB/s), 39.3MiB/s-39.3MiB/s (41.3MB/s-41.3MB/s), io=394MiB (413MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/45, sectors=0/11760, merge=0/25, ticks=0/61, in_queue=61, util=0.04%
```
