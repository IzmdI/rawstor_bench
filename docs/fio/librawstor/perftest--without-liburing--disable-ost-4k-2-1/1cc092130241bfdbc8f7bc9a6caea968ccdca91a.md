[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-2-1

2025-09-03 21:21:48 UTC

refs/heads/feat/ci

[1cc0921](https://github.com/rawstor/librawstor/commit/1cc092130241bfdbc8f7bc9a6caea968ccdca91a)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9829: Wed Sep  3 21:21:46 2025
  read: IOPS=189k, BW=739MiB/s (775MB/s)(7394MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5470.31, stdev=2739.25
     lat (nsec): min=1573, max=109345, avg=2083.53, stdev=1097.89
    clat percentiles (msec):
     |  1.00th=[  279],  5.00th=[ 1011], 10.00th=[ 1653], 20.00th=[ 2702],
     | 30.00th=[ 3675], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=414128, max=833264, per=99.56%, avg=753720.42, stdev=132129.69, samples=19
   iops        : min=103532, max=208316, avg=188430.11, stdev=33032.39, samples=19
  write: IOPS=189k, BW=739MiB/s (774MB/s)(7387MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=104, max=10104, avg=5470.65, stdev=2739.22
     lat (usec): min=4, max=149, avg= 7.96, stdev= 4.13
    clat percentiles (msec):
     |  1.00th=[  279],  5.00th=[ 1011], 10.00th=[ 1653], 20.00th=[ 2702],
     | 30.00th=[ 3675], 40.00th=[ 4597], 50.00th=[ 5537], 60.00th=[ 6477],
     | 70.00th=[ 7349], 80.00th=[ 8288], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=414376, max=832952, per=99.54%, avg=752859.79, stdev=131868.06, samples=19
   iops        : min=103594, max=208238, avg=188214.95, stdev=32967.02, samples=19
  lat (msec)   : 250=0.84%, 500=1.42%, 750=1.33%, 1000=1.36%, 2000=8.08%
  lat (msec)   : >=2000=86.98%
  cpu          : usr=28.90%, sys=71.08%, ctx=63, majf=0, minf=16
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1892886,1891009,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=739MiB/s (775MB/s), 739MiB/s-739MiB/s (775MB/s-775MB/s), io=7394MiB (7753MB), run=10001-10001msec
  WRITE: bw=739MiB/s (774MB/s), 739MiB/s-739MiB/s (774MB/s-774MB/s), io=7387MiB (7746MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/216, sectors=0/365672, merge=0/31, ticks=0/528, in_queue=527, util=0.33%
```
