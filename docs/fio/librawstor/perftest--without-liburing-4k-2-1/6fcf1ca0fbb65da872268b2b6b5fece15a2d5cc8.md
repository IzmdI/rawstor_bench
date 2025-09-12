[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-09-12 22:46:48

refs/heads/feat/evqueue

[6fcf1ca](https://github.com/rawstor/librawstor/commit/6fcf1ca0fbb65da872268b2b6b5fece15a2d5cc8)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11366: Fri Sep 12 22:46:46 2025
  read: IOPS=10.2k, BW=39.9MiB/s (41.8MB/s)(399MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10105, avg=5056.22, stdev=2896.48
     lat (usec): min=28, max=28019, avg=90.13, stdev=219.67
    clat percentiles (msec):
     |  1.00th=[  220],  5.00th=[  592], 10.00th=[ 1028], 20.00th=[ 2072],
     | 30.00th=[ 3037], 40.00th=[ 4010], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7013], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38920, max=44704, per=100.00%, avg=40845.60, stdev=1643.04, samples=20
   iops        : min= 9730, max=11176, avg=10211.40, stdev=410.76, samples=20
  write: IOPS=10.2k, BW=39.8MiB/s (41.7MB/s)(398MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=106, max=10105, avg=5064.28, stdev=2903.39
     lat (usec): min=49, max=30606, avg=103.47, stdev=314.00
    clat percentiles (msec):
     |  1.00th=[  213],  5.00th=[  584], 10.00th=[ 1028], 20.00th=[ 2072],
     | 30.00th=[ 3037], 40.00th=[ 4010], 50.00th=[ 5067], 60.00th=[ 6074],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38872, max=45184, per=100.00%, avg=40770.40, stdev=1729.35, samples=20
   iops        : min= 9718, max=11296, avg=10192.60, stdev=432.34, samples=20
  lat (msec)   : 250=1.34%, 500=2.69%, 750=2.81%, 1000=2.84%, 2000=9.57%
  lat (msec)   : >=2000=80.75%
  cpu          : usr=10.97%, sys=37.34%, ctx=107394, majf=0, minf=285
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=102114,101926,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=39.9MiB/s (41.8MB/s), 39.9MiB/s-39.9MiB/s (41.8MB/s-41.8MB/s), io=399MiB (418MB), run=10001-10001msec
  WRITE: bw=39.8MiB/s (41.7MB/s), 39.8MiB/s-39.8MiB/s (41.7MB/s-41.7MB/s), io=398MiB (417MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/127, sectors=0/35400, merge=0/1001, ticks=0/215, in_queue=223, util=0.21%
```
