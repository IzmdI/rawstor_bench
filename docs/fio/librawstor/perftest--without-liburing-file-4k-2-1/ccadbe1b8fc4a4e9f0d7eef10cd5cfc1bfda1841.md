[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-07-14 21:11:59

refs/heads/add/sources-test

[ccadbe1](https://github.com/rawstor/librawstor/commit/ccadbe1b8fc4a4e9f0d7eef10cd5cfc1bfda1841)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=11402: Tue Jul 14 21:10:45 2026
  read: IOPS=422k, BW=1647MiB/s (1727MB/s)(16.1GiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=110, max=10110, avg=5277.08, stdev=2797.13
     lat (usec): min=3, max=110, avg= 4.52, stdev= 1.42
    clat percentiles (msec):
     |  1.00th=[  268],  5.00th=[  944], 10.00th=[ 1435], 20.00th=[ 2400],
     | 30.00th=[ 3373], 40.00th=[ 4329], 50.00th=[ 5269], 60.00th=[ 6275],
     | 70.00th=[ 7215], 80.00th=[ 8154], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  MiB/s): min=  950, max= 1723, per=100.00%, avg=1656.69, stdev=180.36, samples=19
   iops        : min=243416, max=441226, avg=424111.42, stdev=46171.25, samples=19
  lat (msec)   : 250=0.90%, 500=1.44%, 750=1.35%, 1000=1.83%, 2000=10.39%
  lat (msec)   : >=2000=84.08%
  cpu          : usr=38.15%, sys=61.83%, ctx=72, majf=0, minf=34
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4216623,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=11404: Tue Jul 14 21:10:45 2026
  write: IOPS=338k, BW=1319MiB/s (1383MB/s)(12.9GiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=10324, max=20324, avg=15573.97, stdev=2768.63
     lat (usec): min=4, max=109, avg= 5.68, stdev= 1.52
    clat percentiles (msec):
     |  1.00th=[10537],  5.00th=[11208], 10.00th=[11745], 20.00th=[12684],
     | 30.00th=[13758], 40.00th=[14697], 50.00th=[15637], 60.00th=[16576],
     | 70.00th=[17113], 80.00th=[17113], 90.00th=[17113], 95.00th=[17113],
     | 99.00th=[17113], 99.50th=[17113], 99.90th=[17113], 99.95th=[17113],
     | 99.99th=[17113]
   bw (  MiB/s): min=  796, max= 1405, per=100.00%, avg=1319.40, stdev=188.02, samples=20
   iops        : min=203866, max=359760, avg=337765.40, stdev=48132.51, samples=20
  lat (msec)   : >=2000=100.00%
  cpu          : usr=32.72%, sys=67.26%, ctx=66, majf=0, minf=33
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,3377655,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1647MiB/s (1727MB/s), 1647MiB/s-1647MiB/s (1727MB/s-1727MB/s), io=16.1GiB (17.3GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=1319MiB/s (1383MB/s), 1319MiB/s-1319MiB/s (1383MB/s-1383MB/s), io=12.9GiB (13.8GB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/298, sectors=0/104656, merge=0/758, ticks=0/298, in_queue=303, util=0.12%
```
