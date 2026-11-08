[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-08 14:31:32

refs/heads/worktree-snapshot-barrier

[80d9f80](https://github.com/rawstor/librawstor/commit/80d9f80ce896a0da4be1fa6bbd2db4eac3bd73a2)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15351: Sun Nov  8 14:30:28 2026
  read: IOPS=42.8k, BW=167MiB/s (175MB/s)(1673MiB/10001msec)
    slat (nsec): min=210, max=12920, avg=379.70, stdev=213.15
    clat (usec): min=19, max=2172, avg=46.10, stdev=18.57
     lat (usec): min=20, max=2172, avg=46.48, stdev=18.57
    clat percentiles (usec):
     |  1.00th=[   29],  5.00th=[   35], 10.00th=[   37], 20.00th=[   38],
     | 30.00th=[   40], 40.00th=[   41], 50.00th=[   42], 60.00th=[   43],
     | 70.00th=[   45], 80.00th=[   48], 90.00th=[   56], 95.00th=[   91],
     | 99.00th=[  121], 99.50th=[  135], 99.90th=[  147], 99.95th=[  151],
     | 99.99th=[  172]
   bw (  KiB/s): min=161370, max=176632, per=100.00%, avg=171339.70, stdev=3659.82, samples=20
   iops        : min=40342, max=44160, avg=42835.05, stdev=915.05, samples=20
  lat (usec)   : 20=0.01%, 50=85.03%, 100=12.69%, 250=2.28%, 500=0.01%
  lat (usec)   : 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=17.93%, sys=45.40%, ctx=225455, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=428231,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15358: Sun Nov  8 14:30:28 2026
  write: IOPS=4922, BW=19.2MiB/s (20.2MB/s)(192MiB/10001msec); 0 zone resets
    slat (nsec): min=420, max=14151, avg=743.67, stdev=426.27
    clat (usec): min=221, max=2335, avg=405.19, stdev=117.34
     lat (usec): min=222, max=2336, avg=405.94, stdev=117.33
    clat percentiles (usec):
     |  1.00th=[  245],  5.00th=[  262], 10.00th=[  273], 20.00th=[  297],
     | 30.00th=[  318], 40.00th=[  347], 50.00th=[  371], 60.00th=[  408],
     | 70.00th=[  486], 80.00th=[  529], 90.00th=[  570], 95.00th=[  603],
     | 99.00th=[  676], 99.50th=[  709], 99.90th=[  816], 99.95th=[  914],
     | 99.99th=[ 1696]
   bw (  KiB/s): min=18928, max=20168, per=100.00%, avg=19696.25, stdev=355.92, samples=20
   iops        : min= 4732, max= 5042, avg=4924.00, stdev=89.01, samples=20
  lat (usec)   : 250=1.79%, 500=71.33%, 750=26.62%, 1000=0.22%
  lat (msec)   : 2=0.04%, 4=0.01%
  cpu          : usr=2.89%, sys=6.36%, ctx=42896, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,49232,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=167MiB/s (175MB/s), 167MiB/s-167MiB/s (175MB/s-175MB/s), io=1673MiB (1754MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=19.2MiB/s (20.2MB/s), 19.2MiB/s-19.2MiB/s (20.2MB/s-20.2MB/s), io=192MiB (202MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=7/115548, sectors=56/2519512, merge=0/177986, ticks=11/18461, in_queue=18472, util=36.90%
```
