[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-03 09:32:36 UTC

refs/heads/feat/opts

[73e2d50](https://github.com/rawstor/librawstor/commit/73e2d50dc6eeb3fe1c68ccb039fb619d9c8cf8ec)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9765: Wed Sep  3 09:32:34 2025
  read: IOPS=175k, BW=683MiB/s (716MB/s)(6831MiB/10001msec)
    slat (nsec): min=9, max=15930, avg=29.82, stdev=49.25
    clat (nsec): min=1603, max=127468, avg=2252.50, stdev=1217.22
     lat (nsec): min=1633, max=127498, avg=2282.32, stdev=1218.99
    clat percentiles (nsec):
     |  1.00th=[ 1864],  5.00th=[ 1912], 10.00th=[ 1944], 20.00th=[ 1976],
     | 30.00th=[ 2008], 40.00th=[ 2024], 50.00th=[ 2040], 60.00th=[ 2064],
     | 70.00th=[ 2096], 80.00th=[ 2160], 90.00th=[ 2320], 95.00th=[ 3344],
     | 99.00th=[ 6688], 99.50th=[10560], 99.90th=[16768], 99.95th=[20352],
     | 99.99th=[29056]
   bw (  KiB/s): min=377856, max=778288, per=99.52%, avg=696073.26, stdev=123623.22, samples=19
   iops        : min=94464, max=194570, avg=174018.42, stdev=30905.65, samples=19
  write: IOPS=175k, BW=682MiB/s (716MB/s)(6824MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=65031, avg=46.80, stdev=88.46
    clat (nsec): min=1994, max=89067, avg=2864.71, stdev=1157.64
     lat (nsec): min=2034, max=89147, avg=2911.51, stdev=1162.96
    clat percentiles (nsec):
     |  1.00th=[ 2288],  5.00th=[ 2320], 10.00th=[ 2352], 20.00th=[ 2384],
     | 30.00th=[ 2416], 40.00th=[ 2416], 50.00th=[ 2448], 60.00th=[ 2480],
     | 70.00th=[ 2544], 80.00th=[ 2704], 90.00th=[ 4640], 95.00th=[ 5024],
     | 99.00th=[ 6112], 99.50th=[ 7776], 99.90th=[13888], 99.95th=[15424],
     | 99.99th=[22144]
   bw (  KiB/s): min=378096, max=776664, per=99.53%, avg=695440.42, stdev=123529.53, samples=19
   iops        : min=94524, max=194166, avg=173860.11, stdev=30882.38, samples=19
  lat (usec)   : 2=14.49%, 4=76.84%, 10=8.25%, 20=0.39%, 50=0.03%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=26.57%, sys=73.40%, ctx=67, majf=0, minf=16
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1748759,1747066,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=683MiB/s (716MB/s), 683MiB/s-683MiB/s (716MB/s-716MB/s), io=6831MiB (7163MB), run=10001-10001msec
  WRITE: bw=682MiB/s (716MB/s), 682MiB/s-682MiB/s (716MB/s-716MB/s), io=6824MiB (7156MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/163, sectors=0/32104, merge=0/837, ticks=0/597, in_queue=598, util=0.07%
```
