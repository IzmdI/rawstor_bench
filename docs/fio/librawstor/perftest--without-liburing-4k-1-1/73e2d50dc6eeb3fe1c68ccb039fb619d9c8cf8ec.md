[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-03 09:33:10 UTC

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10811: Wed Sep  3 09:33:09 2025
  read: IOPS=5944, BW=23.2MiB/s (24.3MB/s)(232MiB/10001msec)
    slat (nsec): min=50, max=16200, avg=194.58, stdev=199.44
    clat (usec): min=42, max=28173, avg=71.09, stdev=218.65
     lat (usec): min=42, max=28173, avg=71.29, stdev=218.66
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   56], 10.00th=[   58], 20.00th=[   61],
     | 30.00th=[   64], 40.00th=[   67], 50.00th=[   68], 60.00th=[   71],
     | 70.00th=[   73], 80.00th=[   76], 90.00th=[   82], 95.00th=[   88],
     | 99.00th=[  102], 99.50th=[  110], 99.90th=[  133], 99.95th=[  151],
     | 99.99th=[ 3228]
   bw (  KiB/s): min=22400, max=26112, per=100.00%, avg=23862.74, stdev=956.03, samples=19
   iops        : min= 5600, max= 6528, avg=5965.68, stdev=239.01, samples=19
  write: IOPS=5929, BW=23.2MiB/s (24.3MB/s)(232MiB/10001msec); 0 zone resets
    slat (nsec): min=90, max=17372, avg=267.78, stdev=218.98
    clat (usec): min=54, max=24639, avg=93.58, stdev=165.71
     lat (usec): min=54, max=24639, avg=93.84, stdev=165.71
    clat percentiles (usec):
     |  1.00th=[   75],  5.00th=[   79], 10.00th=[   82], 20.00th=[   85],
     | 30.00th=[   87], 40.00th=[   89], 50.00th=[   91], 60.00th=[   93],
     | 70.00th=[   96], 80.00th=[   99], 90.00th=[  105], 95.00th=[  112],
     | 99.00th=[  125], 99.50th=[  133], 99.90th=[  159], 99.95th=[  200],
     | 99.99th=[ 1811]
   bw (  KiB/s): min=22008, max=25552, per=100.00%, avg=23754.53, stdev=942.54, samples=19
   iops        : min= 5502, max= 6388, avg=5938.63, stdev=235.64, samples=19
  lat (usec)   : 50=0.15%, 100=90.26%, 250=9.56%, 500=0.02%, 750=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=8.32%, sys=32.02%, ctx=118819, majf=0, minf=279
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=59450,59297,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.2MiB/s (24.3MB/s), 23.2MiB/s-23.2MiB/s (24.3MB/s-24.3MB/s), io=232MiB (244MB), run=10001-10001msec
  WRITE: bw=23.2MiB/s (24.3MB/s), 23.2MiB/s-23.2MiB/s (24.3MB/s-24.3MB/s), io=232MiB (243MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/65, sectors=0/13496, merge=0/34, ticks=0/41, in_queue=41, util=0.05%
```
