[&lt; back](..)

# perftest-file-4k-2-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15644: Sun Nov 15 12:03:52 2026
  read: IOPS=432k, BW=1689MiB/s (1771MB/s)(16.5GiB/10001msec)
    slat (nsec): min=270, max=35847, avg=320.47, stdev=186.75
    clat (nsec): min=3387, max=86172, avg=4078.94, stdev=714.84
     lat (nsec): min=3697, max=86473, avg=4399.42, stdev=744.74
    clat percentiles (nsec):
     |  1.00th=[ 3696],  5.00th=[ 3792], 10.00th=[ 3824], 20.00th=[ 3888],
     | 30.00th=[ 3952], 40.00th=[ 3984], 50.00th=[ 4016], 60.00th=[ 4048],
     | 70.00th=[ 4080], 80.00th=[ 4128], 90.00th=[ 4256], 95.00th=[ 4320],
     | 99.00th=[ 5664], 99.50th=[ 7264], 99.90th=[13504], 99.95th=[15552],
     | 99.99th=[21888]
   bw (  MiB/s): min= 1667, max= 1707, per=100.00%, avg=1690.30, stdev=12.06, samples=20
   iops        : min=426953, max=437212, avg=432718.10, stdev=3088.70, samples=20
  lat (usec)   : 4=49.91%, 10=49.68%, 20=0.39%, 50=0.02%, 100=0.01%
  cpu          : usr=39.49%, sys=60.49%, ctx=62, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4324784,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15649: Sun Nov 15 12:03:52 2026
  write: IOPS=4310, BW=16.8MiB/s (17.7MB/s)(168MiB/10001msec); 0 zone resets
    slat (nsec): min=491, max=25829, avg=2321.77, stdev=1233.24
    clat (usec): min=233, max=9358, avg=460.16, stdev=253.34
     lat (usec): min=237, max=9359, avg=462.48, stdev=253.28
    clat percentiles (usec):
     |  1.00th=[  262],  5.00th=[  281], 10.00th=[  302], 20.00th=[  330],
     | 30.00th=[  355], 40.00th=[  379], 50.00th=[  404], 60.00th=[  437],
     | 70.00th=[  494], 80.00th=[  562], 90.00th=[  644], 95.00th=[  717],
     | 99.00th=[ 1221], 99.50th=[ 2073], 99.90th=[ 3490], 99.95th=[ 4228],
     | 99.99th=[ 5866]
   bw (  KiB/s): min=16208, max=17800, per=100.00%, avg=17250.40, stdev=449.35, samples=20
   iops        : min= 4052, max= 4450, avg=4312.50, stdev=112.25, samples=20
  lat (usec)   : 250=0.18%, 500=70.91%, 750=25.17%, 1000=2.34%
  lat (msec)   : 2=0.87%, 4=0.46%, 10=0.06%
  cpu          : usr=3.66%, sys=4.23%, ctx=45234, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,43110,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1689MiB/s (1771MB/s), 1689MiB/s-1689MiB/s (1771MB/s-1771MB/s), io=16.5GiB (17.7GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=16.8MiB/s (17.7MB/s), 16.8MiB/s-16.8MiB/s (17.7MB/s-17.7MB/s), io=168MiB (177MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=2/103767, sectors=224/2700888, merge=0/153716, ticks=9/16838, in_queue=16848, util=36.65%
```
