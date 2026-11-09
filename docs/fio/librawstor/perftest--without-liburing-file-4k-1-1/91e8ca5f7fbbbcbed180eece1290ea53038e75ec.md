[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-09 20:19:07

refs/heads/add/vhost-live-migration

[91e8ca5](https://github.com/rawstor/librawstor/commit/91e8ca5f7fbbbcbed180eece1290ea53038e75ec)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15660: Mon Nov  9 20:17:55 2026
  read: IOPS=465k, BW=1818MiB/s (1907MB/s)(17.8GiB/10001msec)
    slat (nsec): min=180, max=340003, avg=245.11, stdev=505.78
    clat (nsec): min=1171, max=307545, avg=1755.26, stdev=1392.00
     lat (nsec): min=1372, max=341736, avg=2000.37, stdev=1495.18
    clat percentiles (nsec):
     |  1.00th=[ 1384],  5.00th=[ 1464], 10.00th=[ 1528], 20.00th=[ 1592],
     | 30.00th=[ 1640], 40.00th=[ 1672], 50.00th=[ 1720], 60.00th=[ 1752],
     | 70.00th=[ 1800], 80.00th=[ 1848], 90.00th=[ 1928], 95.00th=[ 1976],
     | 99.00th=[ 2192], 99.50th=[ 2448], 99.90th=[ 9152], 99.95th=[12992],
     | 99.99th=[75264]
   bw (  MiB/s): min= 1687, max= 1893, per=100.00%, avg=1819.49, stdev=56.45, samples=20
   iops        : min=432016, max=484790, avg=465789.60, stdev=14449.82, samples=20
  lat (usec)   : 2=95.54%, 4=4.21%, 10=0.18%, 20=0.04%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%, 500=0.01%
  cpu          : usr=47.20%, sys=52.77%, ctx=72, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4655242,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15669: Mon Nov  9 20:17:55 2026
  write: IOPS=3615, BW=14.1MiB/s (14.8MB/s)(141MiB/10001msec); 0 zone resets
    slat (nsec): min=350, max=28333, avg=604.36, stdev=424.53
    clat (usec): min=189, max=90376, avg=275.61, stdev=660.63
     lat (usec): min=190, max=90379, avg=276.22, stdev=660.75
    clat percentiles (usec):
     |  1.00th=[  202],  5.00th=[  212], 10.00th=[  219], 20.00th=[  231],
     | 30.00th=[  243], 40.00th=[  253], 50.00th=[  262], 60.00th=[  269],
     | 70.00th=[  277], 80.00th=[  285], 90.00th=[  302], 95.00th=[  318],
     | 99.00th=[  433], 99.50th=[  515], 99.90th=[ 1467], 99.95th=[ 6587],
     | 99.99th=[30016]
   bw (  KiB/s): min= 2992, max=15912, per=100.00%, avg=14470.95, stdev=2778.10, samples=20
   iops        : min=  748, max= 3978, avg=3617.60, stdev=694.50, samples=20
  lat (usec)   : 250=36.31%, 500=63.12%, 750=0.31%, 1000=0.07%
  lat (msec)   : 2=0.12%, 4=0.01%, 10=0.01%, 20=0.02%, 50=0.01%
  lat (msec)   : 100=0.01%
  cpu          : usr=0.77%, sys=6.52%, ctx=72882, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,36163,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1818MiB/s (1907MB/s), 1818MiB/s-1818MiB/s (1907MB/s-1907MB/s), io=17.8GiB (19.1GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=14.1MiB/s (14.8MB/s), 14.1MiB/s-14.1MiB/s (14.8MB/s-14.8MB/s), io=141MiB (148MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=6/93052, sectors=48/2573768, merge=0/138736, ticks=21/83675, in_queue=83697, util=44.86%
```
