[&lt; back](..)

# perftest--without-liburing-4k-1-1

2025-09-06 21:09:51 UTC

refs/heads/feat/protocol

[cf63a22](https://github.com/rawstor/librawstor/commit/cf63a22cbdaef9fbce7eb2be80c2dd2c1ba12885)

rw = randrw, bs = 4k, iodepth = 1, numjobs = 1

```

rawstor: (groupid=0, jobs=1): err= 0: pid=10900: Sat Sep  6 21:09:49 2025
  read: IOPS=5982, BW=23.4MiB/s (24.5MB/s)(234MiB/10001msec)
    slat (nsec): min=31, max=22502, avg=162.78, stdev=231.83
    clat (usec): min=40, max=21720, avg=71.00, stdev=185.85
     lat (usec): min=41, max=21721, avg=71.16, stdev=185.85
    clat percentiles (usec):
     |  1.00th=[   52],  5.00th=[   56], 10.00th=[   58], 20.00th=[   62],
     | 30.00th=[   64], 40.00th=[   67], 50.00th=[   69], 60.00th=[   71],
     | 70.00th=[   73], 80.00th=[   77], 90.00th=[   82], 95.00th=[   88],
     | 99.00th=[  102], 99.50th=[  111], 99.90th=[  133], 99.95th=[  165],
     | 99.99th=[ 8225]
   bw (  KiB/s): min=21800, max=26120, per=100.00%, avg=23934.00, stdev=917.25, samples=20
   iops        : min= 5450, max= 6530, avg=5983.50, stdev=229.18, samples=20
  write: IOPS=5967, BW=23.3MiB/s (24.4MB/s)(233MiB/10001msec); 0 zone resets
    slat (nsec): min=70, max=22853, avg=248.72, stdev=259.19
    clat (usec): min=55, max=24021, avg=92.81, stdev=124.87
     lat (usec): min=55, max=24021, avg=93.06, stdev=124.87
    clat percentiles (usec):
     |  1.00th=[   75],  5.00th=[   79], 10.00th=[   81], 20.00th=[   84],
     | 30.00th=[   86], 40.00th=[   89], 50.00th=[   91], 60.00th=[   93],
     | 70.00th=[   96], 80.00th=[   99], 90.00th=[  105], 95.00th=[  112],
     | 99.00th=[  126], 99.50th=[  135], 99.90th=[  163], 99.95th=[  184],
     | 99.99th=[  510]
   bw (  KiB/s): min=22704, max=25584, per=100.00%, avg=23871.60, stdev=814.52, samples=20
   iops        : min= 5676, max= 6396, avg=5967.90, stdev=203.63, samples=20
  lat (usec)   : 50=0.16%, 100=90.31%, 250=9.51%, 500=0.01%, 750=0.01%
  lat (msec)   : 2=0.01%, 10=0.01%, 20=0.01%, 50=0.01%
  cpu          : usr=8.30%, sys=32.22%, ctx=119583, majf=0, minf=280
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=59835,59679,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=23.4MiB/s (24.5MB/s), 23.4MiB/s-23.4MiB/s (24.5MB/s-24.5MB/s), io=234MiB (245MB), run=10001-10001msec
  WRITE: bw=23.3MiB/s (24.4MB/s), 23.3MiB/s-23.3MiB/s (24.4MB/s-24.4MB/s), io=233MiB (244MB), run=10001-10001msec

Disk stats (read/write):
  sdb: ios=0/138, sectors=0/14240, merge=0/172, ticks=0/128, in_queue=128, util=0.06%
```
