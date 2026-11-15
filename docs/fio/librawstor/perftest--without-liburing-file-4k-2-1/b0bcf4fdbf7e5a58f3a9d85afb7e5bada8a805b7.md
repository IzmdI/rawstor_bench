[&lt; back](..)

# perftest--without-liburing-file-4k-2-1

2026-11-15 21:20:08

refs/heads/add/tls

[b0bcf4f](https://github.com/rawstor/librawstor/commit/b0bcf4fdbf7e5a58f3a9d85afb7e5bada8a805b7)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15928: Sun Nov 15 21:18:59 2026
  read: IOPS=480k, BW=1877MiB/s (1968MB/s)(18.3GiB/10001msec)
    slat (nsec): min=160, max=145059, avg=256.60, stdev=359.54
    clat (nsec): min=1953, max=421656, avg=3755.46, stdev=2252.41
     lat (usec): min=2, max=421, avg= 4.01, stdev= 2.29
    clat percentiles (usec):
     |  1.00th=[    3],  5.00th=[    3], 10.00th=[    3], 20.00th=[    4],
     | 30.00th=[    4], 40.00th=[    4], 50.00th=[    4], 60.00th=[    4],
     | 70.00th=[    4], 80.00th=[    4], 90.00th=[    6], 95.00th=[    6],
     | 99.00th=[    7], 99.50th=[   11], 99.90th=[   20], 99.95th=[   45],
     | 99.99th=[  108]
   bw (  MiB/s): min= 1743, max= 1967, per=100.00%, avg=1878.17, stdev=58.21, samples=20
   iops        : min=446304, max=503755, avg=480812.20, stdev=14901.11, samples=20
  lat (usec)   : 2=0.01%, 4=80.81%, 10=18.69%, 20=0.41%, 50=0.05%
  lat (usec)   : 100=0.03%, 250=0.01%, 500=0.01%
  cpu          : usr=47.40%, sys=52.54%, ctx=896, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=4805027,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15935: Sun Nov 15 21:18:59 2026
  write: IOPS=3326, BW=13.0MiB/s (13.6MB/s)(130MiB/10001msec); 0 zone resets
    slat (nsec): min=340, max=100602, avg=628.35, stdev=751.18
    clat (usec): min=205, max=207271, avg=600.21, stdev=1996.50
     lat (usec): min=205, max=207272, avg=600.84, stdev=1996.57
    clat percentiles (usec):
     |  1.00th=[   237],  5.00th=[   281], 10.00th=[   343], 20.00th=[   502],
     | 30.00th=[   529], 40.00th=[   545], 50.00th=[   562], 60.00th=[   578],
     | 70.00th=[   594], 80.00th=[   627], 90.00th=[   791], 95.00th=[   857],
     | 99.00th=[  1057], 99.50th=[  1287], 99.90th=[  2212], 99.95th=[  3163],
     | 99.99th=[166724]
   bw (  KiB/s): min= 7880, max=14688, per=100.00%, avg=13313.05, stdev=1939.91, samples=20
   iops        : min= 1970, max= 3672, avg=3328.20, stdev=484.97, samples=20
  lat (usec)   : 250=2.09%, 500=16.76%, 750=68.80%, 1000=11.09%
  lat (msec)   : 2=1.13%, 4=0.09%, 10=0.01%, 20=0.01%, 50=0.02%
  lat (msec)   : 250=0.01%
  cpu          : usr=0.83%, sys=6.65%, ctx=66965, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,33267,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=1877MiB/s (1968MB/s), 1877MiB/s-1877MiB/s (1968MB/s-1968MB/s), io=18.3GiB (19.7GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=13.0MiB/s (13.6MB/s), 13.0MiB/s-13.0MiB/s (13.6MB/s-13.6MB/s), io=130MiB (136MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=3/87699, sectors=232/2866320, merge=0/129629, ticks=11/116435, in_queue=116447, util=47.34%
```
