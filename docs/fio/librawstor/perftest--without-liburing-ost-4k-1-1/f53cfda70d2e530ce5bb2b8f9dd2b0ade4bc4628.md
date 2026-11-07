[&lt; back](..)

# perftest--without-liburing-ost-4k-1-1

2026-11-07 13:11:26

refs/heads/main

[f53cfda](https://github.com/rawstor/librawstor/commit/f53cfda70d2e530ce5bb2b8f9dd2b0ade4bc4628)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15369: Sat Nov  7 13:10:08 2026
  read: IOPS=25.8k, BW=101MiB/s (105MB/s)(1006MiB/10001msec)
    slat (nsec): min=250, max=181060, avg=335.11, stdev=545.24
    clat (usec): min=30, max=1931, avg=38.27, stdev=12.29
     lat (usec): min=30, max=1931, avg=38.60, stdev=12.34
    clat percentiles (usec):
     |  1.00th=[   34],  5.00th=[   35], 10.00th=[   35], 20.00th=[   36],
     | 30.00th=[   36], 40.00th=[   36], 50.00th=[   37], 60.00th=[   38],
     | 70.00th=[   39], 80.00th=[   40], 90.00th=[   43], 95.00th=[   46],
     | 99.00th=[   56], 99.50th=[   62], 99.90th=[  225], 99.95th=[  293],
     | 99.99th=[  416]
   bw (  KiB/s): min=85200, max=110012, per=100.00%, avg=103084.15, stdev=5886.65, samples=20
   iops        : min=21300, max=27503, avg=25770.95, stdev=1471.68, samples=20
  lat (usec)   : 50=97.68%, 100=2.01%, 250=0.23%, 500=0.07%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=10.32%, sys=32.16%, ctx=257590, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=257580,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15372: Sat Nov  7 13:10:08 2026
  write: IOPS=2990, BW=11.7MiB/s (12.2MB/s)(117MiB/10001msec); 0 zone resets
    slat (nsec): min=461, max=146408, avg=811.40, stdev=929.70
    clat (usec): min=236, max=2226, avg=333.30, stdev=61.67
     lat (usec): min=237, max=2227, avg=334.11, stdev=61.76
    clat percentiles (usec):
     |  1.00th=[  260],  5.00th=[  273], 10.00th=[  281], 20.00th=[  293],
     | 30.00th=[  310], 40.00th=[  318], 50.00th=[  326], 60.00th=[  338],
     | 70.00th=[  347], 80.00th=[  359], 90.00th=[  379], 95.00th=[  404],
     | 99.00th=[  578], 99.50th=[  644], 99.90th=[  922], 99.95th=[ 1106],
     | 99.99th=[ 2040]
   bw (  KiB/s): min=11438, max=12680, per=100.00%, avg=11966.65, stdev=341.06, samples=20
   iops        : min= 2859, max= 3170, avg=2991.60, stdev=85.32, samples=20
  lat (usec)   : 250=0.13%, 500=98.28%, 750=1.36%, 1000=0.16%
  lat (msec)   : 2=0.06%, 4=0.01%
  cpu          : usr=1.81%, sys=4.16%, ctx=29906, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,29906,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=101MiB/s (105MB/s), 101MiB/s-101MiB/s (105MB/s-105MB/s), io=1006MiB (1055MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.7MiB/s (12.2MB/s), 11.7MiB/s-11.7MiB/s (12.2MB/s-12.2MB/s), io=117MiB (122MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=5/77250, sectors=40/2192168, merge=0/114796, ticks=49/40241, in_queue=40290, util=39.60%
```
