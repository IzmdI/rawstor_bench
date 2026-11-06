[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-06 23:18:25

refs/heads/docs-index-diagram

[e9ed680](https://github.com/rawstor/librawstor/commit/e9ed68032be1aedaae4c3b0d4545ebbef6c164ae)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15272: Fri Nov  6 23:16:47 2026
  read: IOPS=445k, BW=1740MiB/s (1824MB/s)(17.0GiB/10001msec)
    slat (nsec): min=297, max=89295, avg=438.47, stdev=265.18
    clat (nsec): min=967, max=75242, avg=1672.41, stdev=577.50
     lat (nsec): min=1302, max=93052, avg=2110.89, stdev=657.34
    clat percentiles (nsec):
     |  1.00th=[ 1240],  5.00th=[ 1352], 10.00th=[ 1416], 20.00th=[ 1496],
     | 30.00th=[ 1544], 40.00th=[ 1592], 50.00th=[ 1640], 60.00th=[ 1688],
     | 70.00th=[ 1736], 80.00th=[ 1800], 90.00th=[ 1880], 95.00th=[ 1976],
     | 99.00th=[ 2224], 99.50th=[ 2512], 99.90th=[12736], 99.95th=[13504],
     | 99.99th=[18304]
   bw (  MiB/s): min= 1655, max= 1783, per=100.00%, avg=1741.20, stdev=30.15, samples=20
   iops        : min=423732, max=456517, avg=445747.35, stdev=7719.86, samples=20
  lat (nsec)   : 1000=0.01%
  lat (usec)   : 2=95.98%, 4=3.72%, 10=0.12%, 20=0.17%, 50=0.01%
  lat (usec)   : 100=0.01%
  cpu          : usr=52.14%, sys=47.84%, ctx=58, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4454782,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15277: Fri Nov  6 23:16:47 2026
  write: IOPS=1891, BW=7565KiB/s (7747kB/s)(73.9MiB/10001msec); 0 zone resets
    slat (nsec): min=1223, max=30185, avg=1951.25, stdev=1361.90
    clat (usec): min=301, max=149103, avg=526.11, stdev=1337.45
     lat (usec): min=303, max=149114, avg=528.06, stdev=1337.58
    clat percentiles (usec):
     |  1.00th=[  351],  5.00th=[  379], 10.00th=[  396], 20.00th=[  416],
     | 30.00th=[  437], 40.00th=[  453], 50.00th=[  465], 60.00th=[  482],
     | 70.00th=[  502], 80.00th=[  529], 90.00th=[  611], 95.00th=[  807],
     | 99.00th=[ 1303], 99.50th=[ 1500], 99.90th=[ 2474], 99.95th=[ 8094],
     | 99.99th=[60031]
   bw (  KiB/s): min= 4561, max= 8168, per=100.00%, avg=7569.10, stdev=965.76, samples=20
   iops        : min= 1140, max= 2042, avg=1892.20, stdev=241.47, samples=20
  lat (usec)   : 500=69.44%, 750=24.67%, 1000=3.22%
  lat (msec)   : 2=2.51%, 4=0.10%, 10=0.03%, 20=0.01%, 50=0.01%
  lat (msec)   : 100=0.02%, 250=0.01%
  cpu          : usr=1.26%, sys=3.94%, ctx=37969, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,18915,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1740MiB/s (1824MB/s), 1740MiB/s-1740MiB/s (1824MB/s-1824MB/s), io=17.0GiB (18.2GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=7565KiB/s (7747kB/s), 7565KiB/s-7565KiB/s (7747kB/s-7747kB/s), io=73.9MiB (77.5MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=8/50033, sectors=64/1688864, merge=0/74078, ticks=20/69810, in_queue=69832, util=44.40%
```
