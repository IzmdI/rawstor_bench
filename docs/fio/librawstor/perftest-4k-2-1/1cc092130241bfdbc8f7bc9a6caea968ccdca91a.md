[&lt; back](..)

# perftest-4k-2-1

2025-09-03 21:21:54 UTC

refs/heads/feat/ci

[1cc0921](https://github.com/rawstor/librawstor/commit/1cc092130241bfdbc8f7bc9a6caea968ccdca91a)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10778: Wed Sep  3 21:21:53 2025
  read: IOPS=10.6k, BW=41.3MiB/s (43.3MB/s)(413MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=105, max=10104, avg=5078.50, stdev=2884.64
     lat (usec): min=27, max=31143, avg=80.67, stdev=223.28
    clat percentiles (msec):
     |  1.00th=[  215],  5.00th=[  600], 10.00th=[ 1053], 20.00th=[ 2056],
     | 30.00th=[ 3104], 40.00th=[ 4111], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=40184, max=46816, per=100.00%, avg=42392.84, stdev=1915.09, samples=19
   iops        : min=10046, max=11704, avg=10598.21, stdev=478.77, samples=19
  write: IOPS=10.5k, BW=41.2MiB/s (43.2MB/s)(412MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10104, avg=5087.03, stdev=2891.10
     lat (usec): min=47, max=31134, avg=106.04, stdev=308.20
    clat percentiles (msec):
     |  1.00th=[  209],  5.00th=[  600], 10.00th=[ 1053], 20.00th=[ 2056],
     | 30.00th=[ 3104], 40.00th=[ 4111], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7148], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=39656, max=46008, per=100.00%, avg=42333.89, stdev=1983.12, samples=19
   iops        : min= 9914, max=11502, avg=10583.47, stdev=495.78, samples=19
  lat (msec)   : 250=1.37%, 500=2.55%, 750=2.70%, 1000=2.81%, 2000=9.92%
  lat (msec)   : >=2000=80.65%
  cpu          : usr=8.53%, sys=50.44%, ctx=142640, majf=0, minf=280
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=105650,105485,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=41.3MiB/s (43.3MB/s), 41.3MiB/s-41.3MiB/s (43.3MB/s-43.3MB/s), io=413MiB (433MB), run=10001-10001msec
  WRITE: bw=41.2MiB/s (43.2MB/s), 41.2MiB/s-41.2MiB/s (43.2MB/s-43.2MB/s), io=412MiB (432MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=1/316, sectors=208/130216, merge=0/1445, ticks=1/490, in_queue=496, util=0.30%
```
