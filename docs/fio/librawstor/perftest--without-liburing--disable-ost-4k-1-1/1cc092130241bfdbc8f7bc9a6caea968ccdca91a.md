[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-03 21:22:04 UTC

refs/heads/feat/ci

[1cc0921](https://github.com/rawstor/librawstor/commit/1cc092130241bfdbc8f7bc9a6caea968ccdca91a)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9781: Wed Sep  3 21:22:03 2025
  read: IOPS=177k, BW=690MiB/s (724MB/s)(6901MiB/10001msec)
    slat (nsec): min=9, max=25197, avg=30.29, stdev=57.58
    clat (nsec): min=1552, max=122630, avg=2223.19, stdev=1190.92
     lat (nsec): min=1583, max=122660, avg=2253.48, stdev=1193.52
    clat percentiles (nsec):
     |  1.00th=[ 1832],  5.00th=[ 1880], 10.00th=[ 1912], 20.00th=[ 1944],
     | 30.00th=[ 1976], 40.00th=[ 1992], 50.00th=[ 2024], 60.00th=[ 2040],
     | 70.00th=[ 2096], 80.00th=[ 2128], 90.00th=[ 2288], 95.00th=[ 3344],
     | 99.00th=[ 6688], 99.50th=[10560], 99.90th=[16512], 99.95th=[19840],
     | 99.99th=[28032]
   bw (  KiB/s): min=380928, max=783424, per=99.53%, avg=703336.42, stdev=126744.60, samples=19
   iops        : min=95232, max=195856, avg=175834.21, stdev=31685.89, samples=19
  write: IOPS=176k, BW=689MiB/s (723MB/s)(6894MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=28653, avg=44.43, stdev=70.10
    clat (nsec): min=1984, max=114124, avg=2839.35, stdev=1153.17
     lat (usec): min=2, max=114, avg= 2.88, stdev= 1.16
    clat percentiles (nsec):
     |  1.00th=[ 2256],  5.00th=[ 2288], 10.00th=[ 2320], 20.00th=[ 2352],
     | 30.00th=[ 2384], 40.00th=[ 2416], 50.00th=[ 2416], 60.00th=[ 2448],
     | 70.00th=[ 2512], 80.00th=[ 2672], 90.00th=[ 4640], 95.00th=[ 5024],
     | 99.00th=[ 5984], 99.50th=[ 7648], 99.90th=[13760], 99.95th=[15296],
     | 99.99th=[21120]
   bw (  KiB/s): min=381176, max=783984, per=99.55%, avg=702775.16, stdev=126671.97, samples=19
   iops        : min=95294, max=195996, avg=175693.79, stdev=31667.99, samples=19
  lat (usec)   : 2=20.12%, 4=71.32%, 10=8.14%, 20=0.39%, 50=0.03%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=26.74%, sys=73.24%, ctx=70, majf=0, minf=15
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1766779,1764977,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=690MiB/s (724MB/s), 690MiB/s-690MiB/s (724MB/s-724MB/s), io=6901MiB (7237MB), run=10001-10001msec
  WRITE: bw=689MiB/s (723MB/s), 689MiB/s-689MiB/s (723MB/s-723MB/s), io=6894MiB (7229MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=1/309, sectors=24/102232, merge=0/183, ticks=0/611, in_queue=611, util=0.15%
```
