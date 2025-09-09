[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-09 20:03:39

refs/heads/main

[aa80da7](https://github.com/rawstor/librawstor/commit/aa80da71e7fcd89c7fb2e2f03d3fbc7f72ec1cab)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10245: Tue Sep  9 20:03:37 2025
  read: IOPS=169k, BW=661MiB/s (693MB/s)(6609MiB/10000msec)
    slat (nsec): min=9, max=23374, avg=29.11, stdev=64.00
    clat (nsec): min=1603, max=152126, avg=2332.81, stdev=1261.36
     lat (nsec): min=1633, max=152156, avg=2361.92, stdev=1264.09
    clat percentiles (nsec):
     |  1.00th=[ 1896],  5.00th=[ 1944], 10.00th=[ 1992], 20.00th=[ 2024],
     | 30.00th=[ 2064], 40.00th=[ 2096], 50.00th=[ 2128], 60.00th=[ 2160],
     | 70.00th=[ 2192], 80.00th=[ 2256], 90.00th=[ 2448], 95.00th=[ 3472],
     | 99.00th=[ 7072], 99.50th=[11072], 99.90th=[17280], 99.95th=[20608],
     | 99.99th=[29568]
   bw (  KiB/s): min=362624, max=756200, per=99.99%, avg=676725.15, stdev=123227.76, samples=20
   iops        : min=90656, max=189050, avg=169181.35, stdev=30807.10, samples=20
  write: IOPS=169k, BW=660MiB/s (692MB/s)(6604MiB/10000msec); 0 zone resets
    slat (nsec): min=29, max=24075, avg=46.20, stdev=73.36
    clat (usec): min=2, max=168, avg= 2.97, stdev= 1.25
     lat (usec): min=2, max=168, avg= 3.02, stdev= 1.26
    clat percentiles (nsec):
     |  1.00th=[ 2288],  5.00th=[ 2352], 10.00th=[ 2384], 20.00th=[ 2416],
     | 30.00th=[ 2448], 40.00th=[ 2480], 50.00th=[ 2512], 60.00th=[ 2544],
     | 70.00th=[ 2608], 80.00th=[ 2800], 90.00th=[ 4896], 95.00th=[ 5280],
     | 99.00th=[ 6432], 99.50th=[ 8032], 99.90th=[14656], 99.95th=[16320],
     | 99.99th=[22656]
   bw (  KiB/s): min=363064, max=754528, per=99.99%, avg=676177.40, stdev=123070.04, samples=20
   iops        : min=90766, max=188632, avg=169044.35, stdev=30767.51, samples=20
  lat (usec)   : 2=6.64%, 4=84.08%, 10=8.82%, 20=0.42%, 50=0.03%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=26.60%, sys=73.37%, ctx=76, majf=0, minf=25
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1691913,1690542,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=661MiB/s (693MB/s), 661MiB/s-661MiB/s (693MB/s-693MB/s), io=6609MiB (6930MB), run=10000-10000msec
  WRITE: bw=660MiB/s (692MB/s), 660MiB/s-660MiB/s (692MB/s-692MB/s), io=6604MiB (6924MB), run=10000-10000msec

Disk stats (read/write):
  sdb: ios=0/89, sectors=0/164984, merge=0/37, ticks=0/269, in_queue=269, util=0.24%
```
