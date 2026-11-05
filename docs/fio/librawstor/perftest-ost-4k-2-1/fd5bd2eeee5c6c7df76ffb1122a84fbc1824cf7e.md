[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-05 20:32:30

refs/heads/add/cli-output-format

[fd5bd2e](https://github.com/rawstor/librawstor/commit/fd5bd2eeee5c6c7df76ffb1122a84fbc1824cf7e)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15282: Thu Nov  5 20:30:36 2026
  read: IOPS=83.9k, BW=328MiB/s (344MB/s)(3278MiB/10001msec)
    slat (nsec): min=370, max=127451, avg=462.08, stdev=246.02
    clat (usec): min=13, max=2671, avg=23.21, stdev= 7.83
     lat (usec): min=14, max=2672, avg=23.67, stdev= 7.84
    clat percentiles (usec):
     |  1.00th=[   15],  5.00th=[   16], 10.00th=[   16], 20.00th=[   19],
     | 30.00th=[   21], 40.00th=[   22], 50.00th=[   23], 60.00th=[   24],
     | 70.00th=[   26], 80.00th=[   28], 90.00th=[   31], 95.00th=[   33],
     | 99.00th=[   39], 99.50th=[   42], 99.90th=[   51], 99.95th=[   60],
     | 99.99th=[  210]
   bw (  KiB/s): min=313624, max=355072, per=100.00%, avg=335792.30, stdev=10339.48, samples=20
   iops        : min=78406, max=88768, avg=83947.95, stdev=2584.90, samples=20
  lat (usec)   : 20=28.49%, 50=71.40%, 100=0.09%, 250=0.02%, 500=0.01%
  lat (usec)   : 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=13.43%, sys=65.94%, ctx=350067, majf=0, minf=2046
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=839065,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15286: Thu Nov  5 20:30:36 2026
  write: IOPS=4618, BW=18.0MiB/s (18.9MB/s)(180MiB/10001msec); 0 zone resets
    slat (nsec): min=711, max=235514, avg=1270.95, stdev=1337.16
    clat (usec): min=239, max=19290, avg=431.37, stdev=505.10
     lat (usec): min=241, max=19291, avg=432.64, stdev=505.13
    clat percentiles (usec):
     |  1.00th=[  269],  5.00th=[  285], 10.00th=[  302], 20.00th=[  326],
     | 30.00th=[  343], 40.00th=[  359], 50.00th=[  379], 60.00th=[  408],
     | 70.00th=[  445], 80.00th=[  515], 90.00th=[  578], 95.00th=[  627],
     | 99.00th=[  758], 99.50th=[  914], 99.90th=[ 3195], 99.95th=[16188],
     | 99.99th=[18482]
   bw (  KiB/s): min=16296, max=19775, per=100.00%, avg=18483.55, stdev=758.69, samples=20
   iops        : min= 4074, max= 4943, avg=4620.75, stdev=189.69, samples=20
  lat (usec)   : 250=0.03%, 500=77.80%, 750=21.11%, 1000=0.65%
  lat (msec)   : 2=0.27%, 4=0.05%, 10=0.01%, 20=0.09%
  cpu          : usr=1.74%, sys=6.25%, ctx=42931, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,46188,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=328MiB/s (344MB/s), 328MiB/s-328MiB/s (344MB/s-344MB/s), io=3278MiB (3437MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=18.0MiB/s (18.9MB/s), 18.0MiB/s-18.0MiB/s (18.9MB/s-18.9MB/s), io=180MiB (189MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/110179, sectors=16/2853416, merge=0/176138, ticks=6/41864, in_queue=41871, util=38.56%
```
