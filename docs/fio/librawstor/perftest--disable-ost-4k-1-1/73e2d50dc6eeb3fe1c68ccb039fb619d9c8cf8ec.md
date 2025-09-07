[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-09-03 09:32:22

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9739: Wed Sep  3 09:32:21 2025
  read: IOPS=32.3k, BW=126MiB/s (132MB/s)(1261MiB/10001msec)
    slat (nsec): min=10, max=36127, avg=42.86, stdev=112.36
    clat (nsec): min=1202, max=115957, avg=3055.60, stdev=2741.41
     lat (nsec): min=1232, max=116026, avg=3098.46, stdev=2749.43
    clat percentiles (nsec):
     |  1.00th=[ 1480],  5.00th=[ 1592], 10.00th=[ 1640], 20.00th=[ 1720],
     | 30.00th=[ 1816], 40.00th=[ 2040], 50.00th=[ 2128], 60.00th=[ 2320],
     | 70.00th=[ 2992], 80.00th=[ 3888], 90.00th=[ 5152], 95.00th=[ 7200],
     | 99.00th=[14784], 99.50th=[18304], 99.90th=[25728], 99.95th=[30336],
     | 99.99th=[70144]
   bw (  KiB/s): min=112736, max=143128, per=99.77%, avg=128826.95, stdev=10349.90, samples=19
   iops        : min=28184, max=35782, avg=32206.74, stdev=2587.47, samples=19
  write: IOPS=32.2k, BW=126MiB/s (132MB/s)(1260MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=15689, avg=69.29, stdev=119.94
    clat (usec): min=8, max=2054, avg=27.02, stdev= 5.47
     lat (usec): min=8, max=2054, avg=27.08, stdev= 5.48
    clat percentiles (nsec):
     |  1.00th=[20864],  5.00th=[22656], 10.00th=[23168], 20.00th=[24192],
     | 30.00th=[24960], 40.00th=[25728], 50.00th=[26496], 60.00th=[27008],
     | 70.00th=[27776], 80.00th=[29568], 90.00th=[31872], 95.00th=[33024],
     | 99.00th=[40192], 99.50th=[43776], 99.90th=[49920], 99.95th=[52992],
     | 99.99th=[90624]
   bw (  KiB/s): min=114296, max=142800, per=99.80%, avg=128734.32, stdev=10092.45, samples=19
   iops        : min=28574, max=35700, avg=32183.58, stdev=2523.11, samples=19
  lat (usec)   : 2=18.85%, 4=21.76%, 10=8.22%, 20=1.23%, 50=49.88%
  lat (usec)   : 100=0.06%, 250=0.01%, 500=0.01%, 750=0.01%
  lat (msec)   : 4=0.01%
  cpu          : usr=8.15%, sys=39.54%, ctx=322286, majf=0, minf=15
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=322842,322515,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=126MiB/s (132MB/s), 126MiB/s-126MiB/s (132MB/s-132MB/s), io=1261MiB (1322MB), run=10001-10001msec
  WRITE: bw=126MiB/s (132MB/s), 126MiB/s-126MiB/s (132MB/s-132MB/s), io=1260MiB (1321MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/141, sectors=0/203752, merge=0/621, ticks=0/358, in_queue=364, util=0.28%
```
