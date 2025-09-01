[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-01T19:25:37+00:00

refs/heads/feat/no_poll

[4eb396be97e21286bfef4fecb55bdf7fbc0494dd](https://github.com/rawstor/librawstor/commit/4eb396be97e21286bfef4fecb55bdf7fbc0494dd)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9967: Mon Sep  1 19:25:35 2025
  read: IOPS=33.0k, BW=129MiB/s (135MB/s)(1290MiB/10000msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10104, avg=5287.61, stdev=2867.07
     lat (usec): min=4, max=6632, avg=28.71, stdev=17.33
    clat percentiles (msec):
     |  1.00th=[  230],  5.00th=[  676], 10.00th=[ 1217], 20.00th=[ 2299],
     | 30.00th=[ 3373], 40.00th=[ 4396], 50.00th=[ 5403], 60.00th=[ 6342],
     | 70.00th=[ 7282], 80.00th=[ 8221], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=116288, max=142536, per=99.63%, avg=131608.84, stdev=9034.04, samples=19
   iops        : min=29072, max=35634, avg=32902.21, stdev=2258.51, samples=19
  write: IOPS=33.0k, BW=129MiB/s (135MB/s)(1288MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=117, max=10104, avg=5283.16, stdev=2861.62
     lat (usec): min=4, max=6430, avg=30.65, stdev=13.39
    clat percentiles (msec):
     |  1.00th=[  224],  5.00th=[  676], 10.00th=[ 1217], 20.00th=[ 2299],
     | 30.00th=[ 3373], 40.00th=[ 4396], 50.00th=[ 5403], 60.00th=[ 6342],
     | 70.00th=[ 7282], 80.00th=[ 8221], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=115800, max=141328, per=99.69%, avg=131495.16, stdev=8927.37, samples=19
   iops        : min=28950, max=35332, avg=32873.79, stdev=2231.84, samples=19
  lat (msec)   : 250=1.22%, 500=2.22%, 750=2.27%, 1000=2.34%, 2000=9.17%
  lat (msec)   : >=2000=82.77%
  cpu          : usr=14.58%, sys=37.83%, ctx=340042, majf=0, minf=576
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=330257,329801,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=129MiB/s (135MB/s), 129MiB/s-129MiB/s (135MB/s-135MB/s), io=1290MiB (1353MB), run=10000-10000msec
  WRITE: bw=129MiB/s (135MB/s), 129MiB/s-129MiB/s (135MB/s-135MB/s), io=1288MiB (1351MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/123, sectors=0/33704, merge=0/718, ticks=0/157, in_queue=175, util=0.28%
```
