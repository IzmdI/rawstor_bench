[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-06T21:09:42+00:00

refs/heads/feat/protocol

[cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885](https://github.com/rawstor/librawstor/commit/cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9858: Sat Sep  6 21:09:41 2025
  read: IOPS=176k, BW=689MiB/s (722MB/s)(6890MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5494.97, stdev=2742.13
     lat (nsec): min=1612, max=111058, avg=2247.65, stdev=1197.66
    clat percentiles (msec):
     |  1.00th=[  275],  5.00th=[  995], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3708], 40.00th=[ 4665], 50.00th=[ 5604], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=386704, max=793584, per=100.00%, avg=705494.00, stdev=122846.40, samples=20
   iops        : min=96676, max=198396, avg=176373.70, stdev=30711.64, samples=20
  write: IOPS=176k, BW=688MiB/s (722MB/s)(6882MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5495.09, stdev=2741.93
     lat (usec): min=4, max=138, avg= 8.57, stdev= 4.49
    clat percentiles (msec):
     |  1.00th=[  271],  5.00th=[ 1003], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3708], 40.00th=[ 4665], 50.00th=[ 5604], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=387464, max=793000, per=100.00%, avg=704760.00, stdev=122630.87, samples=20
   iops        : min=96866, max=198250, avg=176190.00, stdev=30657.72, samples=20
  lat (msec)   : 250=0.87%, 500=1.44%, 750=1.34%, 1000=1.36%, 2000=7.91%
  lat (msec)   : >=2000=87.08%
  cpu          : usr=27.93%, sys=72.05%, ctx=80, majf=0, minf=16
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1763737,1761900,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=689MiB/s (722MB/s), 689MiB/s-689MiB/s (722MB/s-722MB/s), io=6890MiB (7224MB), run=10001-10001msec
  WRITE: bw=688MiB/s (722MB/s), 688MiB/s-688MiB/s (722MB/s-722MB/s), io=6882MiB (7217MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/120, sectors=0/30992, merge=0/755, ticks=0/491, in_queue=492, util=0.10%
```
