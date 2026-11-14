[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-11-14 06:32:27

refs/heads/worktree-security-design-doc

[8d0fa24](https://github.com/rawstor/librawstor/commit/8d0fa24eb734bc5b8b5a4ebcc3894add0cf18b6c)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16082: Sat Nov 14 06:31:43 2026
  read: IOPS=422k, BW=1648MiB/s (1728MB/s)(16.1GiB/10001msec)
    slat (nsec): min=234, max=61101, avg=353.34, stdev=228.26
    clat (usec): min=2, max=113, avg= 4.19, stdev= 1.27
     lat (usec): min=2, max=113, avg= 4.54, stdev= 1.29
    clat percentiles (nsec):
     |  1.00th=[ 2576],  5.00th=[ 2768], 10.00th=[ 2928], 20.00th=[ 3344],
     | 30.00th=[ 3632], 40.00th=[ 3920], 50.00th=[ 4048], 60.00th=[ 4192],
     | 70.00th=[ 4320], 80.00th=[ 4704], 90.00th=[ 5344], 95.00th=[ 6560],
     | 99.00th=[ 7392], 99.50th=[ 9792], 99.90th=[16192], 99.95th=[18304],
     | 99.99th=[23168]
   bw (  MiB/s): min= 1592, max= 1683, per=100.00%, avg=1649.47, stdev=24.39, samples=20
   iops        : min=407672, max=430952, avg=422265.30, stdev=6243.82, samples=20
  lat (usec)   : 4=45.73%, 10=53.78%, 20=0.47%, 50=0.03%, 100=0.01%
  lat (usec)   : 250=0.01%
  cpu          : usr=55.18%, sys=44.80%, ctx=82, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4220229,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=16084: Sat Nov 14 06:31:43 2026
  write: IOPS=2177, BW=8712KiB/s (8921kB/s)(85.1MiB/10001msec); 0 zone resets
    slat (nsec): min=523, max=36300, avg=1854.94, stdev=2495.52
    clat (usec): min=336, max=109138, avg=915.34, stdev=1898.56
     lat (usec): min=337, max=109141, avg=917.19, stdev=1898.63
    clat percentiles (usec):
     |  1.00th=[   371],  5.00th=[   429], 10.00th=[   515], 20.00th=[   783],
     | 30.00th=[   816], 40.00th=[   840], 50.00th=[   865], 60.00th=[   889],
     | 70.00th=[   922], 80.00th=[   963], 90.00th=[  1188], 95.00th=[  1319],
     | 99.00th=[  1450], 99.50th=[  1516], 99.90th=[  2057], 99.95th=[ 40633],
     | 99.99th=[108528]
   bw (  KiB/s): min= 5306, max= 9432, per=100.00%, avg=8715.65, stdev=1130.38, samples=20
   iops        : min= 1326, max= 2358, avg=2178.80, stdev=282.64, samples=20
  lat (usec)   : 500=9.70%, 750=4.34%, 1000=70.50%
  lat (msec)   : 2=15.37%, 4=0.03%, 10=0.02%, 20=0.01%, 50=0.01%
  lat (msec)   : 100=0.03%, 250=0.02%
  cpu          : usr=1.65%, sys=7.55%, ctx=43740, majf=0, minf=37
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,21782,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1648MiB/s (1728MB/s), 1648MiB/s-1648MiB/s (1728MB/s-1728MB/s), io=16.1GiB (17.3GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=8712KiB/s (8921kB/s), 8712KiB/s-8712KiB/s (8921kB/s-8921kB/s), io=85.1MiB (89.2MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=22/57491, sectors=1192/1790816, merge=28/85685, ticks=65/132470, in_queue=132538, util=46.41%
```
