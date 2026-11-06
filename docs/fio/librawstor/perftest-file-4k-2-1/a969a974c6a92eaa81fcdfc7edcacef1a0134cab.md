[&lt; back](..)

# perftest-file-4k-2-1

2026-11-06 23:04:11

refs/heads/docs-index-diagram

[a969a97](https://github.com/rawstor/librawstor/commit/a969a974c6a92eaa81fcdfc7edcacef1a0134cab)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15517: Fri Nov  6 23:03:20 2026
  read: IOPS=400k, BW=1563MiB/s (1639MB/s)(15.3GiB/10001msec)
    slat (nsec): min=573, max=100251, avg=673.46, stdev=264.27
    clat (nsec): min=3169, max=264798, avg=4101.17, stdev=764.53
     lat (nsec): min=3845, max=265934, avg=4774.63, stdev=818.47
    clat percentiles (nsec):
     |  1.00th=[ 3600],  5.00th=[ 3696], 10.00th=[ 3760], 20.00th=[ 3824],
     | 30.00th=[ 3888], 40.00th=[ 3952], 50.00th=[ 4016], 60.00th=[ 4080],
     | 70.00th=[ 4192], 80.00th=[ 4256], 90.00th=[ 4448], 95.00th=[ 4576],
     | 99.00th=[ 5088], 99.50th=[ 6880], 99.90th=[14016], 99.95th=[15808],
     | 99.99th=[21376]
   bw (  MiB/s): min= 1542, max= 1580, per=100.00%, avg=1563.98, stdev= 9.04, samples=20
   iops        : min=394946, max=404696, avg=400377.65, stdev=2314.86, samples=20
  lat (usec)   : 4=49.32%, 10=50.25%, 20=0.41%, 50=0.01%, 100=0.01%
  lat (usec)   : 250=0.01%, 500=0.01%
  cpu          : usr=55.21%, sys=44.77%, ctx=74, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4001776,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15520: Fri Nov  6 23:03:20 2026
  write: IOPS=4937, BW=19.3MiB/s (20.2MB/s)(193MiB/10001msec); 0 zone resets
    slat (nsec): min=1128, max=61015, avg=3500.40, stdev=1907.08
    clat (usec): min=193, max=16249, avg=400.00, stdev=316.03
     lat (usec): min=196, max=16251, avg=403.50, stdev=315.94
    clat percentiles (usec):
     |  1.00th=[  237],  5.00th=[  258], 10.00th=[  273], 20.00th=[  297],
     | 30.00th=[  314], 40.00th=[  334], 50.00th=[  355], 60.00th=[  379],
     | 70.00th=[  424], 80.00th=[  490], 90.00th=[  562], 95.00th=[  611],
     | 99.00th=[  758], 99.50th=[  898], 99.90th=[ 5735], 99.95th=[ 8848],
     | 99.99th=[11338]
   bw (  KiB/s): min=18632, max=20561, per=100.00%, avg=19760.60, stdev=490.22, samples=20
   iops        : min= 4658, max= 5140, avg=4940.00, stdev=122.53, samples=20
  lat (usec)   : 250=3.16%, 500=78.30%, 750=17.48%, 1000=0.69%
  lat (msec)   : 2=0.22%, 4=0.03%, 10=0.09%, 20=0.03%
  cpu          : usr=5.31%, sys=3.96%, ctx=51857, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,49382,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1563MiB/s (1639MB/s), 1563MiB/s-1563MiB/s (1639MB/s-1639MB/s), io=15.3GiB (16.4GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=19.3MiB/s (20.2MB/s), 19.3MiB/s-19.3MiB/s (20.2MB/s-20.2MB/s), io=193MiB (202MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=5/119555, sectors=40/3054072, merge=0/187548, ticks=12/14446, in_queue=14457, util=33.21%
```
