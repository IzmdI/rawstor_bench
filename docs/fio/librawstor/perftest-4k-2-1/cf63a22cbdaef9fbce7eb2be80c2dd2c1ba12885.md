[&lt; back](..)

# perftest-4k-2-1

2025-09-06 21:10:02 UTC

refs/heads/feat/protocol

[cf63a22](https://github.com/rawstor/librawstor/commit/cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10850: Sat Sep  6 21:10:00 2025
  read: IOPS=10.7k, BW=41.7MiB/s (43.8MB/s)(417MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5100.14, stdev=2899.85
     lat (usec): min=27, max=34143, avg=79.80, stdev=272.06
    clat percentiles (msec):
     |  1.00th=[  215],  5.00th=[  584], 10.00th=[ 1020], 20.00th=[ 2072],
     | 30.00th=[ 3104], 40.00th=[ 4077], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10134], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=39136, max=47200, per=100.00%, avg=42832.00, stdev=2333.24, samples=19
   iops        : min= 9784, max=11800, avg=10708.00, stdev=583.31, samples=19
  write: IOPS=10.7k, BW=41.6MiB/s (43.7MB/s)(416MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5104.04, stdev=2903.34
     lat (usec): min=40, max=34691, avg=105.05, stdev=378.66
    clat percentiles (msec):
     |  1.00th=[  211],  5.00th=[  575], 10.00th=[ 1020], 20.00th=[ 2072],
     | 30.00th=[ 3104], 40.00th=[ 4111], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8154], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=39832, max=46944, per=100.00%, avg=42758.74, stdev=2075.22, samples=19
   iops        : min= 9958, max=11736, avg=10689.68, stdev=518.80, samples=19
  lat (msec)   : 250=1.40%, 500=2.69%, 750=2.88%, 1000=2.81%, 2000=9.54%
  lat (msec)   : >=2000=80.67%
  cpu          : usr=8.45%, sys=49.94%, ctx=144924, majf=0, minf=277
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=106876,106613,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=41.7MiB/s (43.8MB/s), 41.7MiB/s-41.7MiB/s (43.8MB/s-43.8MB/s), io=417MiB (438MB), run=10001-10001msec
  WRITE: bw=41.6MiB/s (43.7MB/s), 41.6MiB/s-41.6MiB/s (43.7MB/s-43.7MB/s), io=416MiB (437MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/52, sectors=0/12080, merge=0/38, ticks=0/33, in_queue=34, util=0.02%
```
