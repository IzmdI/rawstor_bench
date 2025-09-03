[&lt; back](..)

# perftest-4k-2-1

2025-09-03T09:33:05+00:00

refs/heads/feat/opts

[73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10825: Wed Sep  3 09:33:03 2025
  read: IOPS=10.6k, BW=41.6MiB/s (43.6MB/s)(416MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5034.57, stdev=2912.38
     lat (usec): min=29, max=38959, avg=80.98, stdev=325.68
    clat percentiles (msec):
     |  1.00th=[  205],  5.00th=[  575], 10.00th=[ 1020], 20.00th=[ 1955],
     | 30.00th=[ 3004], 40.00th=[ 4010], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=39112, max=48144, per=100.00%, avg=42687.84, stdev=2584.94, samples=19
   iops        : min= 9778, max=12036, avg=10671.95, stdev=646.22, samples=19
  write: IOPS=10.6k, BW=41.5MiB/s (43.5MB/s)(415MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5040.72, stdev=2917.17
     lat (usec): min=43, max=36702, avg=104.52, stdev=319.69
    clat percentiles (msec):
     |  1.00th=[  201],  5.00th=[  567], 10.00th=[ 1020], 20.00th=[ 1938],
     | 30.00th=[ 3004], 40.00th=[ 4010], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=37936, max=48648, per=100.00%, avg=42612.42, stdev=2774.31, samples=19
   iops        : min= 9484, max=12162, avg=10653.11, stdev=693.58, samples=19
  lat (msec)   : 250=1.53%, 500=2.61%, 750=2.87%, 1000=2.81%, 2000=10.71%
  lat (msec)   : >=2000=79.48%
  cpu          : usr=8.11%, sys=50.32%, ctx=142251, majf=0, minf=280
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=106423,106204,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=41.6MiB/s (43.6MB/s), 41.6MiB/s-41.6MiB/s (43.6MB/s-43.6MB/s), io=416MiB (436MB), run=10001-10001msec
  WRITE: bw=41.5MiB/s (43.5MB/s), 41.5MiB/s-41.5MiB/s (43.5MB/s-43.5MB/s), io=415MiB (435MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/53, sectors=0/11696, merge=0/33, ticks=0/32, in_queue=33, util=0.05%
```
