[&lt; back](..)

# perftest--without-liburing-4k-2-1

2025-08-22 22:27:02

refs/heads/main

[eb4dfa5](https://github.com/rawstor/librawstor/commit/eb4dfa59ddc20ea79afe39adacbbe2df88d2c840)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10916: Fri Aug 22 22:27:01 2025
  read: IOPS=9597, BW=37.5MiB/s (39.3MB/s)(375MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5020.70, stdev=2920.04
     lat (usec): min=31, max=35359, avg=96.48, stdev=298.84
    clat percentiles (msec):
     |  1.00th=[  209],  5.00th=[  567], 10.00th=[ 1003], 20.00th=[ 1921],
     | 30.00th=[ 2970], 40.00th=[ 3977], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=36056, max=43160, per=100.00%, avg=38393.60, stdev=2150.52, samples=20
   iops        : min= 9014, max=10790, avg=9598.40, stdev=537.63, samples=20
  write: IOPS=9576, BW=37.4MiB/s (39.2MB/s)(374MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5028.36, stdev=2928.82
     lat (usec): min=49, max=35368, avg=109.42, stdev=292.52
    clat percentiles (msec):
     |  1.00th=[  205],  5.00th=[  558], 10.00th=[ 1003], 20.00th=[ 1921],
     | 30.00th=[ 2970], 40.00th=[ 3977], 50.00th=[ 5000], 60.00th=[ 6007],
     | 70.00th=[ 7080], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=35992, max=43208, per=100.00%, avg=38311.60, stdev=2121.26, samples=20
   iops        : min= 8998, max=10802, avg=9577.90, stdev=530.32, samples=20
  lat (msec)   : 250=1.49%, 500=2.79%, 750=2.83%, 1000=2.81%, 2000=10.56%
  lat (msec)   : >=2000=79.51%
  cpu          : usr=10.55%, sys=35.87%, ctx=102168, majf=0, minf=272
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=95984,95779,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=37.5MiB/s (39.3MB/s), 37.5MiB/s-37.5MiB/s (39.3MB/s-39.3MB/s), io=375MiB (393MB), run=10001-10001msec
  WRITE: bw=37.4MiB/s (39.2MB/s), 37.4MiB/s-37.4MiB/s (39.2MB/s-39.2MB/s), io=374MiB (392MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/55, sectors=0/12424, merge=0/33, ticks=0/37, in_queue=37, util=0.05%
```
