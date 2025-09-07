[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-09-07 13:58:28

refs/heads/feat/cpp

[1d73224](https://github.com/rawstor/librawstor/commit/1d7322481ee4534dd5d2effcdc3efeaaef71e4f4)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11333: Sun Sep  7 13:58:27 2025
  read: IOPS=9968, BW=38.9MiB/s (40.8MB/s)(389MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5049.86, stdev=2896.86
     lat (usec): min=30, max=29648, avg=92.53, stdev=238.18
    clat percentiles (msec):
     |  1.00th=[  222],  5.00th=[  584], 10.00th=[ 1028], 20.00th=[ 2056],
     | 30.00th=[ 3004], 40.00th=[ 4010], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=36400, max=44504, per=100.00%, avg=39877.60, stdev=2049.75, samples=20
   iops        : min= 9100, max=11126, avg=9969.40, stdev=512.44, samples=20
  write: IOPS=9960, BW=38.9MiB/s (40.8MB/s)(389MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5063.68, stdev=2907.91
     lat (usec): min=51, max=29654, avg=105.59, stdev=305.65
    clat percentiles (msec):
     |  1.00th=[  215],  5.00th=[  575], 10.00th=[ 1028], 20.00th=[ 2056],
     | 30.00th=[ 3004], 40.00th=[ 4010], 50.00th=[ 5000], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=36352, max=43872, per=100.00%, avg=39846.80, stdev=2046.71, samples=20
   iops        : min= 9088, max=10968, avg=9961.70, stdev=511.68, samples=20
  lat (msec)   : 250=1.31%, 500=2.79%, 750=2.81%, 1000=2.82%, 2000=9.67%
  lat (msec)   : >=2000=80.60%
  cpu          : usr=10.99%, sys=37.07%, ctx=104206, majf=0, minf=283
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=99694,99617,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=38.9MiB/s (40.8MB/s), 38.9MiB/s-38.9MiB/s (40.8MB/s-40.8MB/s), io=389MiB (408MB), run=10001-10001msec
  WRITE: bw=38.9MiB/s (40.8MB/s), 38.9MiB/s-38.9MiB/s (40.8MB/s-40.8MB/s), io=389MiB (408MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/46, sectors=0/12144, merge=0/36, ticks=0/64, in_queue=64, util=0.04%
```
