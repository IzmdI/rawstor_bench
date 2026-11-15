[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15392: Sun Nov 15 12:03:18 2026
  read: IOPS=576k, BW=2248MiB/s (2357MB/s)(22.0GiB/10001msec)
    slat (nsec): min=150, max=188351, avg=233.96, stdev=281.86
    clat (nsec): min=1703, max=270602, avg=3104.63, stdev=1467.60
     lat (nsec): min=1913, max=270783, avg=3338.60, stdev=1490.62
    clat percentiles (nsec):
     |  1.00th=[ 1944],  5.00th=[ 2128], 10.00th=[ 2256], 20.00th=[ 2608],
     | 30.00th=[ 2800], 40.00th=[ 2864], 50.00th=[ 2960], 60.00th=[ 3024],
     | 70.00th=[ 3120], 80.00th=[ 3280], 90.00th=[ 4256], 95.00th=[ 4960],
     | 99.00th=[ 5344], 99.50th=[ 5600], 99.90th=[11840], 99.95th=[13760],
     | 99.99th=[68096]
   bw (  MiB/s): min= 2017, max= 2371, per=100.00%, avg=2249.27, stdev=66.08, samples=20
   iops        : min=516563, max=607182, avg=575815.00, stdev=16916.69, samples=20
  lat (usec)   : 2=2.09%, 4=86.74%, 10=10.91%, 20=0.24%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%, 500=0.01%
  cpu          : usr=49.26%, sys=50.72%, ctx=59, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=5755667,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15395: Sun Nov 15 12:03:18 2026
  write: IOPS=3485, BW=13.6MiB/s (14.3MB/s)(136MiB/10001msec); 0 zone resets
    slat (nsec): min=310, max=14361, avg=558.21, stdev=367.09
    clat (usec): min=202, max=129736, avg=572.94, stdev=1208.68
     lat (usec): min=202, max=129737, avg=573.50, stdev=1208.74
    clat percentiles (usec):
     |  1.00th=[  231],  5.00th=[  273], 10.00th=[  322], 20.00th=[  490],
     | 30.00th=[  510], 40.00th=[  529], 50.00th=[  545], 60.00th=[  562],
     | 70.00th=[  578], 80.00th=[  603], 90.00th=[  750], 95.00th=[  824],
     | 99.00th=[  914], 99.50th=[  971], 99.90th=[ 1680], 99.95th=[19268],
     | 99.99th=[68682]
   bw (  KiB/s): min= 6312, max=14872, per=100.00%, avg=13948.90, stdev=1975.76, samples=20
   iops        : min= 1578, max= 3718, avg=3487.20, stdev=493.93, samples=20
  lat (usec)   : 250=2.76%, 500=21.49%, 750=65.61%, 1000=9.76%
  lat (msec)   : 2=0.30%, 4=0.02%, 10=0.01%, 20=0.02%, 50=0.03%
  lat (msec)   : 100=0.01%, 250=0.01%
  cpu          : usr=0.68%, sys=6.30%, ctx=70197, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,34859,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=2248MiB/s (2357MB/s), 2248MiB/s-2248MiB/s (2357MB/s-2357MB/s), io=22.0GiB (23.6GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=13.6MiB/s (14.3MB/s), 13.6MiB/s-13.6MiB/s (14.3MB/s-14.3MB/s), io=136MiB (143MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/90257, sectors=224/2639272, merge=0/134293, ticks=13/107410, in_queue=107424, util=46.51%
```
