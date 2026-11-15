[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-15 21:20:08

refs/heads/add/tls

[b0bcf4f](https://github.com/rawstor/librawstor/commit/b0bcf4fdbf7e5a58f3a9d85afb7e5bada8a805b7)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15962: Sun Nov 15 21:18:56 2026
  read: IOPS=37.8k, BW=148MiB/s (155MB/s)(1478MiB/10001msec)
    slat (nsec): min=261, max=50116, avg=437.25, stdev=275.35
    clat (usec): min=23, max=3440, avg=52.14, stdev=23.84
     lat (usec): min=23, max=3441, avg=52.57, stdev=23.84
    clat percentiles (usec):
     |  1.00th=[   34],  5.00th=[   40], 10.00th=[   41], 20.00th=[   43],
     | 30.00th=[   45], 40.00th=[   46], 50.00th=[   47], 60.00th=[   48],
     | 70.00th=[   50], 80.00th=[   55], 90.00th=[   64], 95.00th=[   98],
     | 99.00th=[  135], 99.50th=[  145], 99.90th=[  192], 99.95th=[  233],
     | 99.99th=[  441]
   bw (  KiB/s): min=142280, max=159184, per=100.00%, avg=151389.80, stdev=5284.75, samples=20
   iops        : min=35570, max=39796, avg=37847.35, stdev=1321.24, samples=20
  lat (usec)   : 50=70.15%, 100=25.45%, 250=4.36%, 500=0.03%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=17.19%, sys=43.11%, ctx=204914, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=378289,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15965: Sun Nov 15 21:18:56 2026
  write: IOPS=4591, BW=17.9MiB/s (18.8MB/s)(179MiB/10001msec); 0 zone resets
    slat (nsec): min=471, max=15703, avg=975.54, stdev=524.72
    clat (usec): min=238, max=14801, avg=434.18, stdev=170.53
     lat (usec): min=239, max=14802, avg=435.15, stdev=170.52
    clat percentiles (usec):
     |  1.00th=[  269],  5.00th=[  285], 10.00th=[  302], 20.00th=[  326],
     | 30.00th=[  343], 40.00th=[  367], 50.00th=[  392], 60.00th=[  420],
     | 70.00th=[  469], 80.00th=[  562], 90.00th=[  619], 95.00th=[  668],
     | 99.00th=[  848], 99.50th=[  979], 99.90th=[ 1287], 99.95th=[ 1893],
     | 99.99th=[ 3195]
   bw (  KiB/s): min=17496, max=19032, per=100.00%, avg=18375.95, stdev=401.84, samples=20
   iops        : min= 4374, max= 4758, avg=4593.95, stdev=100.43, samples=20
  lat (usec)   : 250=0.05%, 500=72.62%, 750=25.32%, 1000=1.58%
  lat (msec)   : 2=0.40%, 4=0.04%, 20=0.01%
  cpu          : usr=3.16%, sys=6.46%, ctx=40224, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,45918,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=148MiB/s (155MB/s), 148MiB/s-148MiB/s (155MB/s-155MB/s), io=1478MiB (1549MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=17.9MiB/s (18.8MB/s), 17.9MiB/s-17.9MiB/s (18.8MB/s-18.8MB/s), io=179MiB (188MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=3/107711, sectors=232/2375552, merge=0/165688, ticks=3/21433, in_queue=21436, util=36.87%
```
