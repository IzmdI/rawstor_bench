[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-08-10 17:09:37

refs/heads/feat/rawstorstd

[b4d5bdb](https://github.com/rawstor/librawstor/commit/b4d5bdb04f86dafd58ab1d3be6d8de177b150eda)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9527: Sun Aug 10 17:09:36 2025
  read: IOPS=33.3k, BW=130MiB/s (136MB/s)(1300MiB/10001msec)
    slat (nsec): min=9, max=15359, avg=40.25, stdev=98.28
    clat (nsec): min=1252, max=139201, avg=3058.94, stdev=2729.40
     lat (nsec): min=1273, max=139231, avg=3099.19, stdev=2736.24
    clat percentiles (nsec):
     |  1.00th=[ 1560],  5.00th=[ 1640], 10.00th=[ 1688], 20.00th=[ 1752],
     | 30.00th=[ 1848], 40.00th=[ 2040], 50.00th=[ 2160], 60.00th=[ 2320],
     | 70.00th=[ 2992], 80.00th=[ 3888], 90.00th=[ 5152], 95.00th=[ 7200],
     | 99.00th=[14528], 99.50th=[18304], 99.90th=[25728], 99.95th=[29312],
     | 99.99th=[77312]
   bw (  KiB/s): min=112984, max=153808, per=99.34%, avg=132277.47, stdev=12696.32, samples=19
   iops        : min=28246, max=38452, avg=33069.37, stdev=3174.08, samples=19
  write: IOPS=33.2k, BW=130MiB/s (136MB/s)(1299MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=26049, avg=72.04, stdev=132.04
    clat (usec): min=7, max=1147, avg=26.16, stdev= 4.76
     lat (usec): min=7, max=1148, avg=26.23, stdev= 4.78
    clat percentiles (nsec):
     |  1.00th=[20608],  5.00th=[21632], 10.00th=[22400], 20.00th=[23168],
     | 30.00th=[23936], 40.00th=[24960], 50.00th=[25472], 60.00th=[26240],
     | 70.00th=[26752], 80.00th=[28288], 90.00th=[30848], 95.00th=[32384],
     | 99.00th=[41216], 99.50th=[44800], 99.90th=[54528], 99.95th=[60160],
     | 99.99th=[92672]
   bw (  KiB/s): min=114016, max=151936, per=99.40%, avg=132176.00, stdev=12407.56, samples=19
   iops        : min=28504, max=37984, avg=33044.00, stdev=3101.89, samples=19
  lat (usec)   : 2=18.33%, 4=22.27%, 10=8.24%, 20=1.38%, 50=49.66%
  lat (usec)   : 100=0.10%, 250=0.01%, 500=0.01%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=7.44%, sys=37.58%, ctx=332424, majf=0, minf=15
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=332925,332460,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=130MiB/s (136MB/s), 130MiB/s-130MiB/s (136MB/s-136MB/s), io=1300MiB (1364MB), run=10001-10001msec
  WRITE: bw=130MiB/s (136MB/s), 130MiB/s-130MiB/s (136MB/s-136MB/s), io=1299MiB (1362MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/117, sectors=0/33328, merge=0/991, ticks=0/217, in_queue=223, util=0.17%
```
