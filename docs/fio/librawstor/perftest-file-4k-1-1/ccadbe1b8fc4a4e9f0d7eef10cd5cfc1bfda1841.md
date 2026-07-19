[&lt; back](..)

# perftest-file-4k-1-1

2026-07-14 21:11:59

refs/heads/add/sources-test

[ccadbe1](https://github.com/rawstor/librawstor/commit/ccadbe1b8fc4a4e9f0d7eef10cd5cfc1bfda1841)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=11365: Tue Jul 14 21:10:41 2026
  read: IOPS=400k, BW=1562MiB/s (1638MB/s)(15.3GiB/10000msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10111, avg=5300.97, stdev=2793.82
     lat (nsec): min=1653, max=253264, avg=2258.04, stdev=1115.85
    clat percentiles (msec):
     |  1.00th=[  271],  5.00th=[  961], 10.00th=[ 1469], 20.00th=[ 2433],
     | 30.00th=[ 3406], 40.00th=[ 4329], 50.00th=[ 5336], 60.00th=[ 6275],
     | 70.00th=[ 7215], 80.00th=[ 8221], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  MiB/s): min=  895, max= 1647, per=100.00%, avg=1570.08, stdev=181.31, samples=19
   iops        : min=229328, max=421870, avg=401939.37, stdev=46415.55, samples=19
  lat (msec)   : 250=0.87%, 500=1.48%, 750=1.30%, 1000=1.65%, 2000=10.28%
  lat (msec)   : >=2000=84.41%
  cpu          : usr=29.24%, sys=70.74%, ctx=88, majf=0, minf=18
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3999175,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=11368: Tue Jul 14 21:10:41 2026
  write: IOPS=30.8k, BW=120MiB/s (126MB/s)(1203MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=10324, max=20324, avg=15347.30, stdev=2892.08
     lat (usec): min=13, max=276, avg=31.94, stdev= 3.80
    clat percentiles (msec):
     |  1.00th=[10402],  5.00th=[10805], 10.00th=[11342], 20.00th=[12281],
     | 30.00th=[13355], 40.00th=[14429], 50.00th=[15368], 60.00th=[16308],
     | 70.00th=[17113], 80.00th=[17113], 90.00th=[17113], 95.00th=[17113],
     | 99.00th=[17113], 99.50th=[17113], 99.90th=[17113], 99.95th=[17113],
     | 99.99th=[17113]
   bw (  KiB/s): min=111272, max=134168, per=100.00%, avg=123203.79, stdev=4987.16, samples=19
   iops        : min=27818, max=33542, avg=30801.05, stdev=1246.82, samples=19
  lat (msec)   : >=2000=100.00%
  cpu          : usr=9.10%, sys=32.50%, ctx=307955, majf=0, minf=18
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,307960,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1562MiB/s (1638MB/s), 1562MiB/s-1562MiB/s (1638MB/s-1638MB/s), io=15.3GiB (16.4GB), run=10000-10000msec

Run status group 1 (all jobs):
  WRITE: bw=120MiB/s (126MB/s), 120MiB/s-120MiB/s (126MB/s-126MB/s), io=1203MiB (1261MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=1/615, sectors=208/988984, merge=0/1447, ticks=0/2425, in_queue=2432, util=0.30%
```
