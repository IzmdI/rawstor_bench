[&lt; back](..)

# perftest-4k-2-1

2025-09-12 22:46:38

refs/heads/feat/evqueue

[6fcf1ca](https://github.com/rawstor/librawstor/commit/6fcf1ca0fbb65da872268b2b6b5fece15a2d5cc8)

rw = randrw, bs = 4k, iodepth = 2, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11310: Fri Sep 12 22:46:36 2025
  read: IOPS=11.0k, BW=43.1MiB/s (45.2MB/s)(431MiB/10001msec)
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5098.36, stdev=2916.71
     lat (usec): min=27, max=31033, avg=77.68, stdev=189.52
    clat percentiles (msec):
     |  1.00th=[  213],  5.00th=[  584], 10.00th=[ 1036], 20.00th=[ 2005],
     | 30.00th=[ 3071], 40.00th=[ 4111], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8087], 90.00th=[ 9194], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=38928, max=48704, per=100.00%, avg=44168.80, stdev=2486.51, samples=20
   iops        : min= 9732, max=12176, avg=11042.20, stdev=621.63, samples=20
  write: IOPS=11.0k, BW=43.0MiB/s (45.1MB/s)(430MiB/10001msec); 0 zone resets
    slat (nsec): min=0, max=0, avg= 0.00, stdev= 0.00
    clat (msec): min=112, max=10111, avg=5100.11, stdev=2918.73
     lat (usec): min=43, max=32235, avg=100.93, stdev=328.05
    clat percentiles (msec):
     |  1.00th=[  209],  5.00th=[  575], 10.00th=[ 1045], 20.00th=[ 2005],
     | 30.00th=[ 3071], 40.00th=[ 4111], 50.00th=[ 5134], 60.00th=[ 6141],
     | 70.00th=[ 7148], 80.00th=[ 8087], 90.00th=[ 9060], 95.00th=[ 9597],
     | 99.00th=[10000], 99.50th=[10000], 99.90th=[10134], 99.95th=[10134],
     | 99.99th=[10134]
   bw (  KiB/s): min=37512, max=49056, per=100.00%, avg=44042.00, stdev=2689.71, samples=20
   iops        : min= 9378, max=12264, avg=11010.50, stdev=672.43, samples=20
  lat (msec)   : 250=1.42%, 500=2.69%, 750=2.77%, 1000=2.67%, 2000=10.36%
  lat (msec)   : >=2000=80.08%
  cpu          : usr=9.05%, sys=50.07%, ctx=150723, majf=0, minf=285
  IO depths    : 1=0.1%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=110422,110105,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=43.1MiB/s (45.2MB/s), 43.1MiB/s-43.1MiB/s (45.2MB/s-45.2MB/s), io=431MiB (452MB), run=10001-10001msec
  WRITE: bw=43.0MiB/s (45.1MB/s), 43.0MiB/s-43.0MiB/s (45.1MB/s-45.1MB/s), io=430MiB (451MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/249, sectors=0/39648, merge=0/1417, ticks=0/1003, in_queue=1008, util=0.20%
```
