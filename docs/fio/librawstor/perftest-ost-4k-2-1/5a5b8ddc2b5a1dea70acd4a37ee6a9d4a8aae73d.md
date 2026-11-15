[&lt; back](..)

# perftest-ost-4k-2-1

2026-11-15 12:50:15

refs/heads/add/tls

[5a5b8dd](https://github.com/rawstor/librawstor/commit/5a5b8ddc2b5a1dea70acd4a37ee6a9d4a8aae73d)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=16053: Sun Nov 15 12:49:26 2026
  read: IOPS=54.4k, BW=213MiB/s (223MB/s)(2127MiB/10001msec)
    slat (nsec): min=253, max=47330, avg=595.07, stdev=338.03
    clat (usec): min=9, max=1620, avg=35.81, stdev=12.61
     lat (usec): min=10, max=1621, avg=36.41, stdev=12.54
    clat percentiles (usec):
     |  1.00th=[   11],  5.00th=[   13], 10.00th=[   20], 20.00th=[   26],
     | 30.00th=[   29], 40.00th=[   35], 50.00th=[   38], 60.00th=[   40],
     | 70.00th=[   42], 80.00th=[   48], 90.00th=[   52], 95.00th=[   55],
     | 99.00th=[   62], 99.50th=[   64], 99.90th=[   74], 99.95th=[   84],
     | 99.99th=[  105]
   bw (  KiB/s): min=182024, max=324744, per=100.00%, avg=217870.05, stdev=33531.16, samples=20
   iops        : min=45506, max=81186, avg=54467.45, stdev=8382.82, samples=20
  lat (usec)   : 10=0.02%, 20=10.09%, 50=72.85%, 100=17.03%, 250=0.01%
  lat (usec)   : 500=0.01%, 750=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=14.75%, sys=37.93%, ctx=257576, majf=0, minf=410
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=544448,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=16056: Sun Nov 15 12:49:26 2026
  write: IOPS=2900, BW=11.3MiB/s (11.9MB/s)(113MiB/10001msec); 0 zone resets
    slat (nsec): min=517, max=22320, avg=1909.65, stdev=1115.36
    clat (usec): min=346, max=3067, avg=686.76, stdev=181.99
     lat (usec): min=349, max=3070, avg=688.67, stdev=181.87
    clat percentiles (usec):
     |  1.00th=[  416],  5.00th=[  461], 10.00th=[  494], 20.00th=[  537],
     | 30.00th=[  570], 40.00th=[  611], 50.00th=[  644], 60.00th=[  685],
     | 70.00th=[  742], 80.00th=[  848], 90.00th=[  955], 95.00th=[ 1029],
     | 99.00th=[ 1172], 99.50th=[ 1254], 99.90th=[ 1516], 99.95th=[ 1811],
     | 99.99th=[ 2474]
   bw (  KiB/s): min=11216, max=12016, per=100.00%, avg=11608.15, stdev=225.47, samples=20
   iops        : min= 2804, max= 3004, avg=2901.90, stdev=56.38, samples=20
  lat (usec)   : 500=11.52%, 750=59.55%, 1000=22.30%
  lat (msec)   : 2=6.60%, 4=0.02%
  cpu          : usr=2.20%, sys=4.41%, ctx=26284, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,29010,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=213MiB/s (223MB/s), 213MiB/s-213MiB/s (223MB/s-223MB/s), io=2127MiB (2230MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.3MiB/s (11.9MB/s), 11.3MiB/s-11.3MiB/s (11.9MB/s-11.9MB/s), io=113MiB (119MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=3/71102, sectors=232/1624504, merge=0/110624, ticks=1/16970, in_queue=16972, util=36.48%
```
