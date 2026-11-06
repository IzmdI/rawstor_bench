[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-06 23:18:25

refs/heads/docs-index-diagram

[e9ed680](https://github.com/rawstor/librawstor/commit/e9ed68032be1aedaae4c3b0d4545ebbef6c164ae)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15522: Fri Nov  6 23:17:02 2026
  read: IOPS=47.0k, BW=184MiB/s (193MB/s)(1836MiB/10001msec)
    slat (nsec): min=743, max=418378, avg=1114.48, stdev=1037.64
    clat (usec): min=15, max=3585, avg=40.99, stdev=15.65
     lat (usec): min=16, max=3586, avg=42.11, stdev=15.66
    clat percentiles (usec):
     |  1.00th=[   21],  5.00th=[   22], 10.00th=[   28], 20.00th=[   37],
     | 30.00th=[   39], 40.00th=[   40], 50.00th=[   42], 60.00th=[   43],
     | 70.00th=[   45], 80.00th=[   47], 90.00th=[   51], 95.00th=[   55],
     | 99.00th=[   67], 99.50th=[   73], 99.90th=[  111], 99.95th=[  182],
     | 99.99th=[  494]
   bw (  KiB/s): min=169568, max=213242, per=100.00%, avg=188140.80, stdev=10255.96, samples=20
   iops        : min=42392, max=53310, avg=47035.05, stdev=2563.95, samples=20
  lat (usec)   : 20=0.91%, 50=88.45%, 100=10.51%, 250=0.09%, 500=0.03%
  lat (usec)   : 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%
  cpu          : usr=16.69%, sys=42.14%, ctx=214776, majf=0, minf=457
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=470133,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15525: Fri Nov  6 23:17:02 2026
  write: IOPS=4852, BW=19.0MiB/s (19.9MB/s)(190MiB/10001msec); 0 zone resets
    slat (nsec): min=1377, max=631036, avg=3632.33, stdev=3341.65
    clat (usec): min=245, max=10894, avg=407.25, stdev=265.00
     lat (usec): min=247, max=10896, avg=410.88, stdev=264.97
    clat percentiles (usec):
     |  1.00th=[  277],  5.00th=[  293], 10.00th=[  306], 20.00th=[  330],
     | 30.00th=[  347], 40.00th=[  359], 50.00th=[  375], 60.00th=[  392],
     | 70.00th=[  416], 80.00th=[  453], 90.00th=[  523], 95.00th=[  586],
     | 99.00th=[  734], 99.50th=[  840], 99.90th=[ 4817], 99.95th=[ 7635],
     | 99.99th=[ 9372]
   bw (  KiB/s): min=18696, max=20288, per=100.00%, avg=19418.50, stdev=454.93, samples=20
   iops        : min= 4674, max= 5072, avg=4854.50, stdev=113.69, samples=20
  lat (usec)   : 250=0.01%, 500=87.38%, 750=11.75%, 1000=0.56%
  lat (msec)   : 2=0.13%, 4=0.06%, 10=0.11%, 20=0.01%
  cpu          : usr=5.05%, sys=9.43%, ctx=45272, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,48528,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=184MiB/s (193MB/s), 184MiB/s-184MiB/s (193MB/s-193MB/s), io=1836MiB (1926MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=19.0MiB/s (19.9MB/s), 19.0MiB/s-19.0MiB/s (19.9MB/s-19.9MB/s), io=190MiB (199MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=5/119888, sectors=88/2628640, merge=0/188431, ticks=3/13072, in_queue=13075, util=30.97%
```
