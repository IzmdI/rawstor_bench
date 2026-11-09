[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-09 20:19:07

refs/heads/add/vhost-live-migration

[91e8ca5](https://github.com/rawstor/librawstor/commit/91e8ca5f7fbbbcbed180eece1290ea53038e75ec)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15674: Mon Nov  9 20:18:48 2026
  read: IOPS=38.2k, BW=149MiB/s (156MB/s)(1493MiB/10001msec)
    slat (nsec): min=351, max=50905, avg=895.95, stdev=629.53
    clat (usec): min=20, max=2676, avg=50.74, stdev=14.38
     lat (usec): min=21, max=2677, avg=51.64, stdev=14.39
    clat percentiles (usec):
     |  1.00th=[   23],  5.00th=[   32], 10.00th=[   35], 20.00th=[   43],
     | 30.00th=[   46], 40.00th=[   48], 50.00th=[   50], 60.00th=[   53],
     | 70.00th=[   55], 80.00th=[   59], 90.00th=[   66], 95.00th=[   73],
     | 99.00th=[   91], 99.50th=[  100], 99.90th=[  135], 99.95th=[  169],
     | 99.99th=[  219]
   bw (  KiB/s): min=131856, max=176889, per=100.00%, avg=152913.60, stdev=11276.63, samples=20
   iops        : min=32964, max=44222, avg=38228.30, stdev=2819.21, samples=20
  lat (usec)   : 50=50.05%, 100=49.47%, 250=0.48%, 500=0.01%
  lat (msec)   : 4=0.01%
  cpu          : usr=16.23%, sys=54.65%, ctx=167614, majf=0, minf=2089
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=382091,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15677: Mon Nov  9 20:18:48 2026
  write: IOPS=3831, BW=15.0MiB/s (15.7MB/s)(150MiB/10001msec); 0 zone resets
    slat (nsec): min=731, max=105427, avg=3170.06, stdev=1568.36
    clat (usec): min=298, max=13289, avg=517.05, stdev=267.35
     lat (usec): min=301, max=13292, avg=520.22, stdev=267.30
    clat percentiles (usec):
     |  1.00th=[  347],  5.00th=[  371], 10.00th=[  388], 20.00th=[  408],
     | 30.00th=[  429], 40.00th=[  445], 50.00th=[  461], 60.00th=[  486],
     | 70.00th=[  519], 80.00th=[  578], 90.00th=[  668], 95.00th=[  766],
     | 99.00th=[ 1237], 99.50th=[ 2311], 99.90th=[ 3752], 99.95th=[ 4490],
     | 99.99th=[ 6063]
   bw (  KiB/s): min=13699, max=16256, per=100.00%, avg=15333.40, stdev=625.96, samples=20
   iops        : min= 3424, max= 4064, avg=3833.20, stdev=156.55, samples=20
  lat (usec)   : 500=64.88%, 750=29.61%, 1000=3.82%
  lat (msec)   : 2=1.14%, 4=0.47%, 10=0.07%, 20=0.01%
  cpu          : usr=4.43%, sys=11.27%, ctx=35989, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,38319,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=149MiB/s (156MB/s), 149MiB/s-149MiB/s (156MB/s-156MB/s), io=1493MiB (1565MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=15.0MiB/s (15.7MB/s), 15.0MiB/s-15.0MiB/s (15.7MB/s-15.7MB/s), io=150MiB (157MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=3/94975, sectors=24/2059464, merge=0/141927, ticks=5/13487, in_queue=13492, util=32.67%
```
