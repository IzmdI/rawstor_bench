[&lt; back](..)

# perftest-ost-legacy-4k-2-1

2026-08-03 15:53:01

refs/tags/v0.2.2

[fd1963e](https://github.com/rawstor/librawstor/commit/fd1963ee0fa5ddb71310d89cacdd5b137aed4a6e)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=13063: Mon Aug  3 15:52:20 2026
  read: IOPS=23.1k, BW=90.0MiB/s (94.4MB/s)(901MiB/10001msec)
    slat (nsec): min=261, max=473344, avg=877.06, stdev=1513.50
    clat (usec): min=25, max=34337, avg=84.76, stdev=287.54
     lat (usec): min=26, max=34338, avg=85.64, stdev=287.54
    clat percentiles (usec):
     |  1.00th=[   39],  5.00th=[   48], 10.00th=[   54], 20.00th=[   61],
     | 30.00th=[   67], 40.00th=[   73], 50.00th=[   80], 60.00th=[   86],
     | 70.00th=[   92], 80.00th=[   97], 90.00th=[  105], 95.00th=[  117],
     | 99.00th=[  188], 99.50th=[  215], 99.90th=[  824], 99.95th=[  963],
     | 99.99th=[22938]
   bw (  KiB/s): min=81434, max=101888, per=100.00%, avg=92286.35, stdev=6595.13, samples=20
   iops        : min=20358, max=25472, avg=23071.35, stdev=1648.73, samples=20
  lat (usec)   : 50=6.10%, 100=78.71%, 250=14.98%, 500=0.07%, 750=0.02%
  lat (usec)   : 1000=0.08%
  lat (msec)   : 2=0.02%, 4=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=12.29%, sys=47.31%, ctx=143028, majf=0, minf=4304
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=230548,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=13080: Mon Aug  3 15:52:20 2026
  write: IOPS=15.5k, BW=60.7MiB/s (63.6MB/s)(607MiB/10001msec); 0 zone resets
    slat (nsec): min=551, max=1099.4k, avg=1693.33, stdev=3770.06
    clat (usec): min=47, max=31476, avg=125.70, stdev=320.34
     lat (usec): min=48, max=31477, avg=127.39, stdev=320.37
    clat percentiles (usec):
     |  1.00th=[   60],  5.00th=[   72], 10.00th=[   83], 20.00th=[   95],
     | 30.00th=[  104], 40.00th=[  113], 50.00th=[  121], 60.00th=[  127],
     | 70.00th=[  133], 80.00th=[  139], 90.00th=[  147], 95.00th=[  159],
     | 99.00th=[  281], 99.50th=[  404], 99.90th=[ 1037], 99.95th=[ 1647],
     | 99.99th=[26084]
   bw (  KiB/s): min=53667, max=67296, per=100.00%, avg=62170.90, stdev=3657.52, samples=20
   iops        : min=13416, max=16824, avg=15542.60, stdev=914.42, samples=20
  lat (usec)   : 50=0.01%, 100=25.21%, 250=73.53%, 500=0.90%, 750=0.17%
  lat (usec)   : 1000=0.08%
  lat (msec)   : 2=0.07%, 4=0.02%, 10=0.01%, 50=0.01%
  cpu          : usr=9.26%, sys=36.90%, ctx=99949, majf=0, minf=85
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,155351,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=90.0MiB/s (94.4MB/s), 90.0MiB/s-90.0MiB/s (94.4MB/s-94.4MB/s), io=901MiB (944MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=60.7MiB/s (63.6MB/s), 60.7MiB/s-60.7MiB/s (63.6MB/s-63.6MB/s), io=607MiB (636MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/101241, sectors=0/1275760, merge=0/1291, ticks=0/767429, in_queue=767435, util=16.70%
```
