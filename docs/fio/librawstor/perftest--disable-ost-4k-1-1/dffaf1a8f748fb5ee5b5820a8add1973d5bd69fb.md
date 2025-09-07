[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-08-07 13:59:36 UTC

refs/heads/feat/matrix

[dffaf1a](https://github.com/rawstor/librawstor/commit/dffaf1a8f748fb5ee5b5820a8add1973d5bd69fb)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9127: Thu Aug  7 13:59:34 2025
  read: IOPS=31.7k, BW=124MiB/s (130MB/s)(1237MiB/10001msec)
    slat (nsec): min=9, max=17463, avg=40.99, stdev=79.99
    clat (nsec): min=1243, max=161812, avg=3424.20, stdev=3038.15
     lat (nsec): min=1273, max=161892, avg=3465.20, stdev=3043.67
    clat percentiles (nsec):
     |  1.00th=[ 1656],  5.00th=[ 1736], 10.00th=[ 1784], 20.00th=[ 1880],
     | 30.00th=[ 2040], 40.00th=[ 2192], 50.00th=[ 2320], 60.00th=[ 2608],
     | 70.00th=[ 3440], 80.00th=[ 4448], 90.00th=[ 5920], 95.00th=[ 8096],
     | 99.00th=[16064], 99.50th=[20096], 99.90th=[28288], 99.95th=[33536],
     | 99.99th=[73216]
   bw (  KiB/s): min=108256, max=149096, per=99.63%, avg=126161.68, stdev=11908.94, samples=19
   iops        : min=27064, max=37274, avg=31540.42, stdev=2977.23, samples=19
  write: IOPS=31.6k, BW=124MiB/s (130MB/s)(1236MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=24505, avg=81.16, stdev=136.94
    clat (usec): min=7, max=1043, avg=27.15, stdev= 5.70
     lat (usec): min=7, max=1043, avg=27.23, stdev= 5.71
    clat percentiles (usec):
     |  1.00th=[   21],  5.00th=[   22], 10.00th=[   23], 20.00th=[   24],
     | 30.00th=[   25], 40.00th=[   26], 50.00th=[   27], 60.00th=[   28],
     | 70.00th=[   29], 80.00th=[   31], 90.00th=[   33], 95.00th=[   34],
     | 99.00th=[   42], 99.50th=[   46], 99.90th=[   59], 99.95th=[  101],
     | 99.99th=[  147]
   bw (  KiB/s): min=110536, max=146392, per=99.66%, avg=126107.79, stdev=11490.14, samples=19
   iops        : min=27634, max=36598, avg=31526.95, stdev=2872.53, samples=19
  lat (usec)   : 2=14.33%, 4=23.69%, 10=10.46%, 20=1.54%, 50=49.85%
  lat (usec)   : 100=0.10%, 250=0.03%, 500=0.01%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=7.64%, sys=37.50%, ctx=316252, majf=0, minf=15
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=316591,316363,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=124MiB/s (130MB/s), 124MiB/s-124MiB/s (130MB/s-130MB/s), io=1237MiB (1297MB), run=10001-10001msec
  WRITE: bw=124MiB/s (130MB/s), 124MiB/s-124MiB/s (130MB/s-130MB/s), io=1236MiB (1296MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/105, sectors=0/30912, merge=0/752, ticks=0/588, in_queue=588, util=0.03%
```
