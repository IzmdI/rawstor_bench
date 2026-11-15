[&lt; back](..)

# perftest-file-4k-1-1

2026-11-15 12:04:35

refs/heads/main

[6a4e086](https://github.com/rawstor/librawstor/commit/6a4e0869ffcacd0f0eced8184e301af26a4adcd5)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15620: Sun Nov 15 12:04:14 2026
  read: IOPS=696k, BW=2720MiB/s (2852MB/s)(26.6GiB/10001msec)
    slat (nsec): min=177, max=104750, avg=222.67, stdev=264.79
    clat (nsec): min=562, max=111791, avg=1074.88, stdev=622.12
     lat (nsec): min=785, max=111992, avg=1297.54, stdev=695.69
    clat percentiles (nsec):
     |  1.00th=[  844],  5.00th=[  892], 10.00th=[  924], 20.00th=[  964],
     | 30.00th=[  996], 40.00th=[ 1032], 50.00th=[ 1048], 60.00th=[ 1064],
     | 70.00th=[ 1096], 80.00th=[ 1128], 90.00th=[ 1192], 95.00th=[ 1240],
     | 99.00th=[ 1368], 99.50th=[ 1496], 99.90th=[16768], 99.95th=[19072],
     | 99.99th=[19840]
   bw (  MiB/s): min= 2678, max= 2749, per=100.00%, avg=2722.23, stdev=18.00, samples=20
   iops        : min=685588, max=703869, avg=696891.05, stdev=4606.85, samples=20
  lat (nsec)   : 750=0.11%, 1000=30.41%
  lat (usec)   : 2=69.19%, 4=0.15%, 10=0.02%, 20=0.12%, 50=0.01%
  lat (usec)   : 100=0.01%, 250=0.01%
  cpu          : usr=40.97%, sys=59.02%, ctx=66, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=6964302,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15628: Sun Nov 15 12:04:14 2026
  write: IOPS=5451, BW=21.3MiB/s (22.3MB/s)(213MiB/10001msec); 0 zone resets
    slat (nsec): min=484, max=28362, avg=1594.76, stdev=1365.26
    clat (usec): min=110, max=4682, avg=180.99, stdev=46.40
     lat (usec): min=111, max=4684, avg=182.59, stdev=46.58
    clat percentiles (usec):
     |  1.00th=[  147],  5.00th=[  153], 10.00th=[  157], 20.00th=[  167],
     | 30.00th=[  172], 40.00th=[  176], 50.00th=[  178], 60.00th=[  182],
     | 70.00th=[  186], 80.00th=[  192], 90.00th=[  202], 95.00th=[  212],
     | 99.00th=[  265], 99.50th=[  302], 99.90th=[  424], 99.95th=[  478],
     | 99.99th=[ 2835]
   bw (  KiB/s): min=20096, max=23080, per=100.00%, avg=21818.05, stdev=705.52, samples=20
   iops        : min= 5024, max= 5770, avg=5454.35, stdev=176.41, samples=20
  lat (usec)   : 250=98.55%, 500=1.41%, 750=0.02%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%
  cpu          : usr=4.21%, sys=2.65%, ctx=54521, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,54520,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=2720MiB/s (2852MB/s), 2720MiB/s-2720MiB/s (2852MB/s-2852MB/s), io=26.6GiB (28.5GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=21.3MiB/s (22.3MB/s), 21.3MiB/s-21.3MiB/s (22.3MB/s-22.3MB/s), io=213MiB (223MB), run=10001-10001msec

Disk stats (read/write):
    dm-0: ios=27/446166, sectors=216/3569328, merge=0/0, ticks=27/246514, in_queue=246541, util=29.03%, aggrios=0/125268, aggsectors=108/2080228, aggrmerge=13/134760, aggrticks=0/5057, aggrin_queue=5057, aggrutil=25.09%
  nvme0n1: ios=1/0, sectors=216/0, merge=26/0, ticks=1/0, in_queue=0, util=0.00%
  nvme1n1: ios=0/250536, sectors=0/4160456, merge=0/269521, ticks=0/10114, in_queue=10115, util=25.09%
```
