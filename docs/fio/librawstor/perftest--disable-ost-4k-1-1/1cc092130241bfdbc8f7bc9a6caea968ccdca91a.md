[&lt; back](..)

# perftest--disable-ost-4k-1-1

2025-09-03T21:22:04+00:00

refs/heads/feat/ci

[1cc092130241bfdbc8f7bc9a6caea968ccdca91a](https://github.com/rawstor/librawstor/commit/1cc092130241bfdbc8f7bc9a6caea968ccdca91a)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9813: Wed Sep  3 21:22:03 2025
  read: IOPS=31.9k, BW=125MiB/s (131MB/s)(1246MiB/10001msec)
    slat (nsec): min=9, max=14848, avg=44.35, stdev=99.80
    clat (nsec): min=1222, max=132599, avg=3094.17, stdev=2850.02
     lat (nsec): min=1242, max=132639, avg=3138.52, stdev=2857.56
    clat percentiles (nsec):
     |  1.00th=[ 1512],  5.00th=[ 1576], 10.00th=[ 1640], 20.00th=[ 1704],
     | 30.00th=[ 1832], 40.00th=[ 2040], 50.00th=[ 2160], 60.00th=[ 2384],
     | 70.00th=[ 2992], 80.00th=[ 3952], 90.00th=[ 5280], 95.00th=[ 7328],
     | 99.00th=[15040], 99.50th=[18816], 99.90th=[26752], 99.95th=[31872],
     | 99.99th=[82432]
   bw (  KiB/s): min=110776, max=138976, per=99.38%, avg=126741.47, stdev=10200.40, samples=19
   iops        : min=27694, max=34744, avg=31685.37, stdev=2550.10, samples=19
  write: IOPS=31.9k, BW=124MiB/s (130MB/s)(1245MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=14778, avg=74.90, stdev=113.82
    clat (usec): min=7, max=714, avg=27.35, stdev= 4.71
     lat (usec): min=7, max=714, avg=27.42, stdev= 4.72
    clat percentiles (usec):
     |  1.00th=[   21],  5.00th=[   23], 10.00th=[   23], 20.00th=[   24],
     | 30.00th=[   25], 40.00th=[   26], 50.00th=[   27], 60.00th=[   28],
     | 70.00th=[   29], 80.00th=[   31], 90.00th=[   33], 95.00th=[   35],
     | 99.00th=[   43], 99.50th=[   47], 99.90th=[   55], 99.95th=[   59],
     | 99.99th=[  101]
   bw (  KiB/s): min=111968, max=141392, per=99.41%, avg=126687.16, stdev=10173.81, samples=19
   iops        : min=27992, max=35348, avg=31671.79, stdev=2543.45, samples=19
  lat (usec)   : 2=18.40%, 4=21.86%, 10=8.49%, 20=1.33%, 50=49.79%
  lat (usec)   : 100=0.11%, 250=0.01%, 500=0.01%, 750=0.01%
  cpu          : usr=8.21%, sys=39.34%, ctx=318392, majf=0, minf=16
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=318868,318624,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=125MiB/s (131MB/s), 125MiB/s-125MiB/s (131MB/s-131MB/s), io=1246MiB (1306MB), run=10001-10001msec
  WRITE: bw=124MiB/s (130MB/s), 124MiB/s-124MiB/s (130MB/s-130MB/s), io=1245MiB (1305MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/15, sectors=0/7624, merge=0/153, ticks=0/30, in_queue=30, util=0.02%
```
