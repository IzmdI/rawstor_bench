[&lt; back](..)

# perftest-file-4k-2-1

2026-11-05 20:32:30

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15323: Thu Nov  5 20:30:39 2026
  read: IOPS=372k, BW=1453MiB/s (1523MB/s)(14.2GiB/10001msec)
    slat (nsec): min=380, max=168638, avg=514.71, stdev=374.71
    clat (usec): min=3, max=241, avg= 4.67, stdev= 1.83
     lat (usec): min=4, max=242, avg= 5.19, stdev= 1.88
    clat percentiles (nsec):
     |  1.00th=[ 4128],  5.00th=[ 4256], 10.00th=[ 4320], 20.00th=[ 4384],
     | 30.00th=[ 4448], 40.00th=[ 4512], 50.00th=[ 4576], 60.00th=[ 4576],
     | 70.00th=[ 4640], 80.00th=[ 4768], 90.00th=[ 4832], 95.00th=[ 5024],
     | 99.00th=[ 6048], 99.50th=[12480], 99.90th=[21120], 99.95th=[39168],
     | 99.99th=[93696]
   bw (  MiB/s): min= 1270, max= 1490, per=100.00%, avg=1453.66, stdev=53.77, samples=20
   iops        : min=325182, max=381628, avg=372137.95, stdev=13763.72, samples=20
  lat (usec)   : 4=0.26%, 10=99.12%, 20=0.51%, 50=0.08%, 100=0.02%
  lat (usec)   : 250=0.01%
  cpu          : usr=41.53%, sys=58.45%, ctx=50, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3719201,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15328: Thu Nov  5 20:30:39 2026
  write: IOPS=3949, BW=15.4MiB/s (16.2MB/s)(154MiB/10001msec); 0 zone resets
    slat (nsec): min=741, max=24747, avg=1950.17, stdev=990.13
    clat (usec): min=191, max=230926, avg=504.75, stdev=3108.44
     lat (usec): min=193, max=230927, avg=506.70, stdev=3108.46
    clat percentiles (usec):
     |  1.00th=[   212],  5.00th=[   229], 10.00th=[   243], 20.00th=[   269],
     | 30.00th=[   289], 40.00th=[   302], 50.00th=[   322], 60.00th=[   343],
     | 70.00th=[   379], 80.00th=[   437], 90.00th=[   553], 95.00th=[   725],
     | 99.00th=[  1483], 99.50th=[  3523], 99.90th=[ 35914], 99.95th=[ 56361],
     | 99.99th=[152044]
   bw (  KiB/s): min= 6525, max=22360, per=100.00%, avg=15804.30, stdev=4558.00, samples=20
   iops        : min= 1631, max= 5590, avg=3951.00, stdev=1139.52, samples=20
  lat (usec)   : 250=13.18%, 500=72.70%, 750=9.40%, 1000=2.21%
  lat (msec)   : 2=1.79%, 4=0.27%, 10=0.15%, 20=0.12%, 50=0.11%
  lat (msec)   : 100=0.03%, 250=0.03%
  cpu          : usr=2.05%, sys=2.96%, ctx=41541, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,39498,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1453MiB/s (1523MB/s), 1453MiB/s-1453MiB/s (1523MB/s-1523MB/s), io=14.2GiB (15.2GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=15.4MiB/s (16.2MB/s), 15.4MiB/s-15.4MiB/s (16.2MB/s-16.2MB/s), io=154MiB (162MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=7/86661, sectors=56/2360056, merge=0/134788, ticks=64/69038, in_queue=69102, util=44.46%
```
