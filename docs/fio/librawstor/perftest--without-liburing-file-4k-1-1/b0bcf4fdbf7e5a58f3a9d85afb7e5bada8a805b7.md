[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-15 21:20:08

refs/heads/add/tls

[b0bcf4f](https://github.com/rawstor/librawstor/commit/b0bcf4fdbf7e5a58f3a9d85afb7e5bada8a805b7)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16108: Sun Nov 15 21:19:32 2026
  read: IOPS=530k, BW=2071MiB/s (2172MB/s)(20.2GiB/10001msec)
    slat (nsec): min=192, max=30932, avg=294.47, stdev=238.61
    clat (nsec): min=780, max=107728, avg=1455.62, stdev=573.65
     lat (nsec): min=1030, max=108060, avg=1750.09, stdev=638.86
    clat percentiles (nsec):
     |  1.00th=[ 1080],  5.00th=[ 1176], 10.00th=[ 1224], 20.00th=[ 1304],
     | 30.00th=[ 1352], 40.00th=[ 1400], 50.00th=[ 1432], 60.00th=[ 1480],
     | 70.00th=[ 1512], 80.00th=[ 1560], 90.00th=[ 1624], 95.00th=[ 1688],
     | 99.00th=[ 1848], 99.50th=[ 2024], 99.90th=[14912], 99.95th=[15424],
     | 99.99th=[16064]
   bw (  MiB/s): min= 2001, max= 2098, per=100.00%, avg=2072.27, stdev=22.47, samples=20
   iops        : min=512276, max=537234, avg=530501.30, stdev=5751.62, samples=20
  lat (nsec)   : 1000=0.13%
  lat (usec)   : 2=99.34%, 4=0.35%, 10=0.04%, 20=0.14%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=51.57%, sys=48.41%, ctx=67, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=5302097,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=16111: Sun Nov 15 21:19:32 2026
  write: IOPS=6084, BW=23.8MiB/s (24.9MB/s)(238MiB/10001msec); 0 zone resets
    slat (nsec): min=822, max=111259, avg=1230.81, stdev=958.96
    clat (usec): min=100, max=4504, avg=162.53, stdev=51.91
     lat (usec): min=101, max=4506, avg=163.77, stdev=52.08
    clat percentiles (usec):
     |  1.00th=[  131],  5.00th=[  139], 10.00th=[  145], 20.00th=[  147],
     | 30.00th=[  149], 40.00th=[  151], 50.00th=[  155], 60.00th=[  157],
     | 70.00th=[  163], 80.00th=[  172], 90.00th=[  182], 95.00th=[  194],
     | 99.00th=[  330], 99.50th=[  371], 99.90th=[  519], 99.95th=[  578],
     | 99.99th=[ 2474]
   bw (  KiB/s): min=23040, max=25434, per=100.00%, avg=24352.55, stdev=680.40, samples=20
   iops        : min= 5760, max= 6358, avg=6088.10, stdev=170.05, samples=20
  lat (usec)   : 250=97.32%, 500=2.56%, 750=0.09%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%
  cpu          : usr=3.05%, sys=12.86%, ctx=123320, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,60854,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=2071MiB/s (2172MB/s), 2071MiB/s-2071MiB/s (2172MB/s-2172MB/s), io=20.2GiB (21.7GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=23.8MiB/s (24.9MB/s), 23.8MiB/s-23.8MiB/s (24.9MB/s-24.9MB/s), io=238MiB (249MB), run=10001-10001msec

Disk stats (read/write):
    dm-0: ios=27/484831, sectors=216/3878648, merge=0/0, ticks=27/211608, in_queue=211635, util=31.84%, aggrios=0/142399, aggsectors=108/2268884, aggrmerge=13/141211, aggrticks=0/6350, aggrin_queue=6351, aggrutil=27.83%
  nvme0n1: ios=1/0, sectors=216/0, merge=26/0, ticks=1/0, in_queue=1, util=0.00%
  nvme1n1: ios=0/284799, sectors=0/4537768, merge=0/282422, ticks=0/12701, in_queue=12701, util=27.83%
```
