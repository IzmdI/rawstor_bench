[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-07 13:57:58

refs/heads/feat/cpp

[1d73224](https://github.com/rawstor/librawstor/commit/1d7322481ee4534dd5d2effcdc3efeaaef71e4f4)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10262: Sun Sep  7 13:57:56 2025
  read: IOPS=176k, BW=688MiB/s (722MB/s)(6882MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5495.76, stdev=2737.79
     lat (nsec): min=1633, max=119373, avg=2247.43, stdev=1201.13
    clat percentiles (msec):
     |  1.00th=[  271],  5.00th=[ 1003], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3742], 40.00th=[ 4665], 50.00th=[ 5604], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=380896, max=786632, per=99.47%, avg=700913.68, stdev=125642.02, samples=19
   iops        : min=95224, max=196658, avg=175228.42, stdev=31410.51, samples=19
  write: IOPS=176k, BW=687MiB/s (721MB/s)(6875MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5495.95, stdev=2737.64
     lat (usec): min=4, max=148, avg= 8.57, stdev= 4.51
    clat percentiles (msec):
     |  1.00th=[  271],  5.00th=[ 1003], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3742], 40.00th=[ 4665], 50.00th=[ 5604], 60.00th=[ 6477],
     | 70.00th=[ 7416], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=381072, max=783392, per=99.49%, avg=700395.79, stdev=125610.05, samples=19
   iops        : min=95268, max=195848, avg=175098.95, stdev=31402.51, samples=19
  lat (msec)   : 250=0.88%, 500=1.44%, 750=1.37%, 1000=1.31%, 2000=7.92%
  lat (msec)   : >=2000=87.08%
  cpu          : usr=28.04%, sys=71.93%, ctx=138, majf=0, minf=17
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1761863,1760059,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=688MiB/s (722MB/s), 688MiB/s-688MiB/s (722MB/s-722MB/s), io=6882MiB (7217MB), run=10001-10001msec
  WRITE: bw=687MiB/s (721MB/s), 687MiB/s-687MiB/s (721MB/s-721MB/s), io=6875MiB (7209MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/174, sectors=0/31816, merge=0/819, ticks=0/215, in_queue=216, util=0.11%
```
