[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-07-14 21:11:59

refs/heads/add/sources-test

[ccadbe1](https://github.com/rawstor/librawstor/commit/ccadbe1b8fc4a4e9f0d7eef10cd5cfc1bfda1841)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=11420: Tue Jul 14 21:10:59 2026
  read: IOPS=319k, BW=1245MiB/s (1306MB/s)(12.2GiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=111, max=10110, avg=5290.00, stdev=2805.20
     lat (usec): min=2, max=180, avg= 2.89, stdev= 1.08
    clat percentiles (msec):
     |  1.00th=[  249],  5.00th=[  894], 10.00th=[ 1435], 20.00th=[ 2400],
     | 30.00th=[ 3373], 40.00th=[ 4329], 50.00th=[ 5336], 60.00th=[ 6275],
     | 70.00th=[ 7215], 80.00th=[ 8221], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  MiB/s): min=  815, max= 1304, per=100.00%, avg=1249.96, stdev=132.31, samples=19
   iops        : min=208682, max=334028, avg=319989.68, stdev=33870.57, samples=19
  lat (msec)   : 250=1.00%, 500=1.69%, 750=1.49%, 1000=1.57%, 2000=10.00%
  lat (msec)   : >=2000=84.25%
  cpu          : usr=28.46%, sys=71.52%, ctx=61, majf=0, minf=35
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=3187665,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=11423: Tue Jul 14 21:10:59 2026
  write: IOPS=259k, BW=1012MiB/s (1061MB/s)(9.88GiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=10324, max=20324, avg=15555.92, stdev=2783.19
     lat (usec): min=2, max=149, avg= 3.59, stdev= 1.09
    clat percentiles (msec):
     |  1.00th=[10537],  5.00th=[11073], 10.00th=[11745], 20.00th=[12684],
     | 30.00th=[13624], 40.00th=[14563], 50.00th=[15503], 60.00th=[16576],
     | 70.00th=[17113], 80.00th=[17113], 90.00th=[17113], 95.00th=[17113],
     | 99.00th=[17113], 99.50th=[17113], 99.90th=[17113], 99.95th=[17113],
     | 99.99th=[17113]
   bw (  KiB/s): min=697376, max=1104280, per=99.78%, avg=1033904.00, stdev=143196.63, samples=19
   iops        : min=174344, max=276070, avg=258476.11, stdev=35799.21, samples=19
  lat (msec)   : >=2000=100.00%
  cpu          : usr=26.76%, sys=73.22%, ctx=63, majf=0, minf=35
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,2590829,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1245MiB/s (1306MB/s), 1245MiB/s-1245MiB/s (1306MB/s-1306MB/s), io=12.2GiB (13.1GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=1012MiB/s (1061MB/s), 1012MiB/s-1012MiB/s (1061MB/s-1061MB/s), io=9.88GiB (10.6GB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=1/329, sectors=208/123464, merge=0/747, ticks=0/551, in_queue=554, util=0.11%
```
