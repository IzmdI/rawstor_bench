[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-08-10 17:09:33

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9502: Sun Aug 10 17:09:33 2025
  read: IOPS=141k, BW=551MiB/s (577MB/s)(5506MiB/10001msec)
    slat (nsec): min=10, max=17153, avg=28.00, stdev=64.46
    clat (usec): min=2, max=124, avg= 2.89, stdev= 1.38
     lat (usec): min=2, max=124, avg= 2.92, stdev= 1.38
    clat percentiles (nsec):
     |  1.00th=[ 2448],  5.00th=[ 2480], 10.00th=[ 2512], 20.00th=[ 2544],
     | 30.00th=[ 2576], 40.00th=[ 2608], 50.00th=[ 2640], 60.00th=[ 2640],
     | 70.00th=[ 2672], 80.00th=[ 2768], 90.00th=[ 2992], 95.00th=[ 4128],
     | 99.00th=[ 8512], 99.50th=[12736], 99.90th=[19072], 99.95th=[22144],
     | 99.99th=[32128]
   bw (  KiB/s): min=334704, max=628352, per=99.50%, avg=560962.95, stdev=95509.32, samples=19
   iops        : min=83676, max=157088, avg=140240.74, stdev=23877.33, samples=19
  write: IOPS=141k, BW=550MiB/s (577MB/s)(5499MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=36498, avg=44.52, stdev=74.52
    clat (nsec): min=2624, max=89158, avg=3611.20, stdev=1320.30
     lat (nsec): min=2665, max=89208, avg=3655.72, stdev=1324.96
    clat percentiles (nsec):
     |  1.00th=[ 2896],  5.00th=[ 2928], 10.00th=[ 2960], 20.00th=[ 2992],
     | 30.00th=[ 3024], 40.00th=[ 3056], 50.00th=[ 3088], 60.00th=[ 3152],
     | 70.00th=[ 3216], 80.00th=[ 4048], 90.00th=[ 5472], 95.00th=[ 5792],
     | 99.00th=[ 7456], 99.50th=[ 9152], 99.90th=[15680], 99.95th=[17536],
     | 99.99th=[25728]
   bw (  KiB/s): min=334408, max=625336, per=99.51%, avg=560309.05, stdev=95093.40, samples=19
   iops        : min=83602, max=156334, avg=140077.26, stdev=23773.35, samples=19
  lat (usec)   : 4=86.97%, 10=12.44%, 20=0.54%, 50=0.05%, 100=0.01%
  lat (usec)   : 250=0.01%
  cpu          : usr=42.66%, sys=57.31%, ctx=81, majf=0, minf=25
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1409544,1407795,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=551MiB/s (577MB/s), 551MiB/s-551MiB/s (577MB/s-577MB/s), io=5506MiB (5773MB), run=10001-10001msec
  WRITE: bw=550MiB/s (577MB/s), 550MiB/s-550MiB/s (577MB/s-577MB/s), io=5499MiB (5766MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/185, sectors=0/207200, merge=0/1015, ticks=0/907, in_queue=912, util=0.31%
```
