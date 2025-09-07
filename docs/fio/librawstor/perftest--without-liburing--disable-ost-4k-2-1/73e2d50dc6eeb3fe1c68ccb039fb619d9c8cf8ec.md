[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-03 09:33:04 UTC

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9854: Wed Sep  3 09:33:02 2025
  read: IOPS=182k, BW=709MiB/s (744MB/s)(7093MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5464.30, stdev=2731.80
     lat (nsec): min=1623, max=123783, avg=2189.09, stdev=1166.19
    clat percentiles (msec):
     |  1.00th=[  275],  5.00th=[ 1003], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3708], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=395008, max=803176, per=99.59%, avg=723218.11, stdev=127785.81, samples=19
   iops        : min=98752, max=200792, avg=180804.53, stdev=31946.45, samples=19
  write: IOPS=181k, BW=709MiB/s (743MB/s)(7086MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5464.86, stdev=2731.87
     lat (usec): min=4, max=149, avg= 8.31, stdev= 4.33
    clat percentiles (msec):
     |  1.00th=[  275],  5.00th=[ 1011], 10.00th=[ 1670], 20.00th=[ 2735],
     | 30.00th=[ 3675], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6409],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=395048, max=802024, per=99.60%, avg=722588.21, stdev=127711.65, samples=19
   iops        : min=98762, max=200506, avg=180647.05, stdev=31927.88, samples=19
  lat (msec)   : 250=0.86%, 500=1.41%, 750=1.35%, 1000=1.34%, 2000=8.06%
  lat (msec)   : >=2000=86.98%
  cpu          : usr=29.46%, sys=70.52%, ctx=68, majf=0, minf=16
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1815690,1813980,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=709MiB/s (744MB/s), 709MiB/s-709MiB/s (744MB/s-744MB/s), io=7093MiB (7437MB), run=10001-10001msec
  WRITE: bw=709MiB/s (743MB/s), 709MiB/s-709MiB/s (743MB/s-743MB/s), io=7086MiB (7430MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/147, sectors=0/30528, merge=0/824, ticks=0/168, in_queue=169, util=0.08%
```
