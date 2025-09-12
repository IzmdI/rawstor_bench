[&lt; back](..)

# perftest-4k-1-1

2025-09-12 22:46:45

refs/heads/feat/evqueue

[6fcf1ca](https://github.com/rawstor/librawstor/commit/6fcf1ca0fbb65da872268b2b6b5fece15a2d5cc8)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=11350: Fri Sep 12 22:46:43 2025
  read: IOPS=6096, BW=23.8MiB/s (25.0MB/s)(238MiB/10001msec)
    slat (nsec): min=60, max=17472, avg=174.77, stdev=140.71
    clat (usec): min=41, max=26300, avg=67.90, stdev=175.50
     lat (usec): min=42, max=26300, avg=68.08, stdev=175.50
    clat percentiles (usec):
     |  1.00th=[   51],  5.00th=[   54], 10.00th=[   56], 20.00th=[   60],
     | 30.00th=[   62], 40.00th=[   64], 50.00th=[   66], 60.00th=[   68],
     | 70.00th=[   71], 80.00th=[   74], 90.00th=[   79], 95.00th=[   85],
     | 99.00th=[   99], 99.50th=[  106], 99.90th=[  137], 99.95th=[  192],
     | 99.99th=[  457]
   bw (  KiB/s): min=22760, max=26408, per=100.00%, avg=24388.00, stdev=1054.75, samples=20
   iops        : min= 5690, max= 6602, avg=6097.00, stdev=263.69, samples=20
  write: IOPS=6079, BW=23.7MiB/s (24.9MB/s)(237MiB/10001msec); 0 zone resets
    slat (nsec): min=100, max=19447, avg=250.92, stdev=262.95
    clat (usec): min=54, max=27007, avg=92.65, stdev=234.97
     lat (usec): min=54, max=27008, avg=92.90, stdev=234.97
    clat percentiles (usec):
     |  1.00th=[   72],  5.00th=[   77], 10.00th=[   80], 20.00th=[   83],
     | 30.00th=[   85], 40.00th=[   88], 50.00th=[   89], 60.00th=[   91],
     | 70.00th=[   94], 80.00th=[   97], 90.00th=[  103], 95.00th=[  110],
     | 99.00th=[  124], 99.50th=[  131], 99.90th=[  167], 99.95th=[  212],
     | 99.99th=[ 2343]
   bw (  KiB/s): min=22480, max=26488, per=100.00%, avg=24319.20, stdev=1116.80, samples=20
   iops        : min= 5620, max= 6622, avg=6079.80, stdev=279.20, samples=20
  lat (usec)   : 50=0.30%, 100=92.27%, 250=7.39%, 500=0.02%, 750=0.01%
  lat (usec)   : 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 50=0.01%
  cpu          : usr=6.79%, sys=34.27%, ctx=121849, majf=0, minf=285
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=60970,60798,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.8MiB/s (25.0MB/s), 23.8MiB/s-23.8MiB/s (25.0MB/s-25.0MB/s), io=238MiB (250MB), run=10001-10001msec
  WRITE: bw=23.7MiB/s (24.9MB/s), 23.7MiB/s-23.7MiB/s (24.9MB/s-24.9MB/s), io=237MiB (249MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=1/189, sectors=224/36024, merge=0/1162, ticks=0/708, in_queue=715, util=0.18%
```
