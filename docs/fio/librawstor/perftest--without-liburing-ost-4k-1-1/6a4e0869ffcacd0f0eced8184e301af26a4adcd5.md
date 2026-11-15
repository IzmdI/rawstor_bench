[&lt; back](..)

# perftest--without-liburing-ost-4k-1-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15642: Sun Nov 15 12:04:15 2026
  read: IOPS=12.4k, BW=48.5MiB/s (50.8MB/s)(485MiB/10001msec)
    slat (nsec): min=842, max=22301, avg=1280.61, stdev=717.99
    clat (usec): min=61, max=1686, avg=78.40, stdev=11.58
     lat (usec): min=63, max=1688, avg=79.68, stdev=11.74
    clat percentiles (usec):
     |  1.00th=[   66],  5.00th=[   68], 10.00th=[   69], 20.00th=[   70],
     | 30.00th=[   71], 40.00th=[   73], 50.00th=[   76], 60.00th=[   81],
     | 70.00th=[   85], 80.00th=[   87], 90.00th=[   92], 95.00th=[   98],
     | 99.00th=[  112], 99.50th=[  116], 99.90th=[  126], 99.95th=[  133],
     | 99.99th=[  145]
   bw (  KiB/s): min=46837, max=54372, per=100.00%, avg=49639.85, stdev=2047.52, samples=20
   iops        : min=11709, max=13593, avg=12409.95, stdev=511.90, samples=20
  lat (usec)   : 100=95.90%, 250=4.10%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=15.87%, sys=27.62%, ctx=124053, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=124048,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15644: Sun Nov 15 12:04:15 2026
  write: IOPS=2222, BW=8889KiB/s (9102kB/s)(86.8MiB/10001msec); 0 zone resets
    slat (nsec): min=1964, max=67837, avg=3093.71, stdev=1362.16
    clat (usec): min=308, max=7062, avg=445.28, stdev=200.52
     lat (usec): min=311, max=7065, avg=448.38, stdev=200.59
    clat percentiles (usec):
     |  1.00th=[  326],  5.00th=[  343], 10.00th=[  355], 20.00th=[  379],
     | 30.00th=[  392], 40.00th=[  408], 50.00th=[  420], 60.00th=[  437],
     | 70.00th=[  453], 80.00th=[  478], 90.00th=[  519], 95.00th=[  570],
     | 99.00th=[  922], 99.50th=[ 1516], 99.90th=[ 3490], 99.95th=[ 4146],
     | 99.99th=[ 5866]
   bw (  KiB/s): min= 8024, max= 9656, per=100.00%, avg=8892.25, stdev=357.79, samples=20
   iops        : min= 2006, max= 2414, avg=2223.00, stdev=89.41, samples=20
  lat (usec)   : 500=86.89%, 750=11.53%, 1000=0.72%
  lat (msec)   : 2=0.52%, 4=0.27%, 10=0.07%
  cpu          : usr=4.70%, sys=5.68%, ctx=22224, majf=0, minf=37
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,22224,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=48.5MiB/s (50.8MB/s), 48.5MiB/s-48.5MiB/s (50.8MB/s-50.8MB/s), io=485MiB (508MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=8889KiB/s (9102kB/s), 8889KiB/s-8889KiB/s (9102kB/s-9102kB/s), io=86.8MiB (91.0MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=4/56900, sectors=240/1310112, merge=0/86126, ticks=2/8138, in_queue=8141, util=29.90%
```
