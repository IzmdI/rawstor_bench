[&lt; back](..)

# perftest--without-liburing-ost-4k-1-1

2026-07-14 21:11:59

refs/heads/add/sources-test

[ccadbe1](https://github.com/rawstor/librawstor/commit/ccadbe1b8fc4a4e9f0d7eef10cd5cfc1bfda1841)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=11476: Tue Jul 14 21:11:08 2026
  read: IOPS=6374, BW=24.9MiB/s (26.1MB/s)(249MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10110, avg=5126.52, stdev=2886.00
     lat (usec): min=131, max=2027, avg=155.56, stdev=14.96
    clat percentiles (msec):
     |  1.00th=[  224],  5.00th=[  642], 10.00th=[ 1133], 20.00th=[ 2106],
     | 30.00th=[ 3138], 40.00th=[ 4111], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=24432, max=27008, per=99.98%, avg=25492.26, stdev=671.23, samples=19
   iops        : min= 6108, max= 6752, avg=6372.95, stdev=167.82, samples=19
  lat (msec)   : 250=1.25%, 500=2.39%, 750=2.51%, 1000=2.50%, 2000=10.19%
  lat (msec)   : >=2000=81.16%
  cpu          : usr=12.86%, sys=55.89%, ctx=64076, majf=0, minf=2040137
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=63752,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=11478: Tue Jul 14 21:11:08 2026
  write: IOPS=6446, BW=25.2MiB/s (26.4MB/s)(252MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=10322, max=20322, avg=15285.96, stdev=2888.58
     lat (usec): min=132, max=374, avg=153.90, stdev=12.88
    clat percentiles (msec):
     |  1.00th=[10402],  5.00th=[10805], 10.00th=[11342], 20.00th=[12281],
     | 30.00th=[13221], 40.00th=[14295], 50.00th=[15234], 60.00th=[16174],
     | 70.00th=[17113], 80.00th=[17113], 90.00th=[17113], 95.00th=[17113],
     | 99.00th=[17113], 99.50th=[17113], 99.90th=[17113], 99.95th=[17113],
     | 99.99th=[17113]
   bw (  KiB/s): min=23504, max=27224, per=99.99%, avg=25781.05, stdev=964.42, samples=19
   iops        : min= 5876, max= 6806, avg=6445.26, stdev=241.11, samples=19
  lat (msec)   : >=2000=100.00%
  cpu          : usr=11.63%, sys=57.18%, ctx=64836, majf=0, minf=2063016
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,64467,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=24.9MiB/s (26.1MB/s), 24.9MiB/s-24.9MiB/s (26.1MB/s-26.1MB/s), io=249MiB (261MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=25.2MiB/s (26.4MB/s), 25.2MiB/s-25.2MiB/s (26.4MB/s-26.4MB/s), io=252MiB (264MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/269, sectors=0/146576, merge=0/1051, ticks=0/334, in_queue=340, util=0.20%
```
