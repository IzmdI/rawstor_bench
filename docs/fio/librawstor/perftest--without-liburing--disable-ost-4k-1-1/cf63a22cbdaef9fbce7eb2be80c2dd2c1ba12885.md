[&lt; back](..)

# perftest--without-liburing--disable-ost-4k-1-1

2025-09-06 21:09:42

refs/heads/feat/protocol

[cf63a22](https://github.com/rawstor/librawstor/commit/cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=9844: Sat Sep  6 21:09:40 2025
  read: IOPS=183k, BW=714MiB/s (748MB/s)(7136MiB/10001msec)
    slat (nsec): min=20, max=22872, avg=27.97, stdev=61.19
    clat (nsec): min=1592, max=105406, avg=2142.45, stdev=1159.01
     lat (nsec): min=1623, max=105436, avg=2170.42, stdev=1161.85
    clat percentiles (nsec):
     |  1.00th=[ 1800],  5.00th=[ 1848], 10.00th=[ 1864], 20.00th=[ 1896],
     | 30.00th=[ 1912], 40.00th=[ 1928], 50.00th=[ 1944], 60.00th=[ 1960],
     | 70.00th=[ 1992], 80.00th=[ 2040], 90.00th=[ 2192], 95.00th=[ 3312],
     | 99.00th=[ 6496], 99.50th=[10048], 99.90th=[16064], 99.95th=[19328],
     | 99.99th=[27264]
   bw (  KiB/s): min=389232, max=809008, per=100.00%, avg=730716.00, stdev=129492.18, samples=20
   iops        : min=97308, max=202252, avg=182679.00, stdev=32373.05, samples=20
  write: IOPS=182k, BW=713MiB/s (747MB/s)(7128MiB/10001msec); 0 zone resets
    slat (nsec): min=29, max=27051, avg=43.64, stdev=66.94
    clat (usec): min=2, max=104, avg= 2.74, stdev= 1.09
     lat (usec): min=2, max=105, avg= 2.78, stdev= 1.10
    clat percentiles (nsec):
     |  1.00th=[ 2224],  5.00th=[ 2256], 10.00th=[ 2288], 20.00th=[ 2320],
     | 30.00th=[ 2320], 40.00th=[ 2320], 50.00th=[ 2352], 60.00th=[ 2384],
     | 70.00th=[ 2416], 80.00th=[ 2576], 90.00th=[ 4384], 95.00th=[ 4768],
     | 99.00th=[ 5792], 99.50th=[ 7328], 99.90th=[13632], 99.95th=[14912],
     | 99.99th=[20864]
   bw (  KiB/s): min=389840, max=806992, per=100.00%, avg=729906.40, stdev=129259.44, samples=20
   iops        : min=97460, max=201748, avg=182476.60, stdev=32314.86, samples=20
  lat (usec)   : 2=36.35%, 4=55.69%, 10=7.57%, 20=0.37%, 50=0.02%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=28.46%, sys=71.52%, ctx=67, majf=0, minf=14
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=1826790,1824766,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=714MiB/s (748MB/s), 714MiB/s-714MiB/s (748MB/s-748MB/s), io=7136MiB (7483MB), run=10001-10001msec
  WRITE: bw=713MiB/s (747MB/s), 713MiB/s-713MiB/s (747MB/s-747MB/s), io=7128MiB (7474MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=0/125, sectors=0/33712, merge=0/995, ticks=0/165, in_queue=175, util=0.19%
```
