[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-08-27 21:41:56 UTC

refs/heads/main

[ad80eec](https://github.com/rawstor/librawstor/commit/ad80eec81bb26cbbb01dde51a65dd7dfe19a8be1)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9742: Wed Aug 27 21:41:55 2025
  read: IOPS=32.2k, BW=126MiB/s (132MB/s)(1258MiB/10001msec)
    slat (nsec): min=9, max=16932, avg=42.66, stdev=80.53
    clat (nsec): min=1202, max=141056, avg=3213.83, stdev=2866.70
     lat (nsec): min=1232, max=141086, avg=3256.49, stdev=2873.70
    clat percentiles (nsec):
     |  1.00th=[ 1576],  5.00th=[ 1656], 10.00th=[ 1720], 20.00th=[ 1800],
     | 30.00th=[ 1912], 40.00th=[ 2096], 50.00th=[ 2224], 60.00th=[ 2480],
     | 70.00th=[ 3152], 80.00th=[ 4016], 90.00th=[ 5472], 95.00th=[ 7584],
     | 99.00th=[15296], 99.50th=[19072], 99.90th=[26752], 99.95th=[31104],
     | 99.99th=[74240]
   bw (  KiB/s): min=107008, max=148696, per=100.00%, avg=128792.80, stdev=12925.67, samples=20
   iops        : min=26752, max=37174, avg=32198.20, stdev=3231.42, samples=20
  write: IOPS=32.2k, BW=126MiB/s (132MB/s)(1257MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=16541, avg=68.09, stdev=102.77
    clat (usec): min=8, max=1232, avg=26.95, stdev= 5.13
     lat (usec): min=8, max=1232, avg=27.02, stdev= 5.15
    clat percentiles (usec):
     |  1.00th=[   21],  5.00th=[   23], 10.00th=[   23], 20.00th=[   24],
     | 30.00th=[   25], 40.00th=[   26], 50.00th=[   27], 60.00th=[   27],
     | 70.00th=[   29], 80.00th=[   31], 90.00th=[   33], 95.00th=[   34],
     | 99.00th=[   41], 99.50th=[   45], 99.90th=[   52], 99.95th=[   58],
     | 99.99th=[  115]
   bw (  KiB/s): min=104248, max=148464, per=100.00%, avg=128711.20, stdev=12849.00, samples=20
   iops        : min=26062, max=37116, avg=32177.80, stdev=3212.25, samples=20
  lat (usec)   : 2=16.88%, 4=23.03%, 10=8.75%, 20=1.55%, 50=49.70%
  lat (usec)   : 100=0.08%, 250=0.01%, 500=0.01%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=7.75%, sys=39.76%, ctx=321506, majf=0, minf=16
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=321982,321778,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=126MiB/s (132MB/s), 126MiB/s-126MiB/s (132MB/s-132MB/s), io=1258MiB (1319MB), run=10001-10001msec
  WRITE: bw=126MiB/s (132MB/s), 126MiB/s-126MiB/s (132MB/s-132MB/s), io=1257MiB (1318MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/257, sectors=0/36504, merge=0/1297, ticks=0/607, in_queue=614, util=0.23%
```
