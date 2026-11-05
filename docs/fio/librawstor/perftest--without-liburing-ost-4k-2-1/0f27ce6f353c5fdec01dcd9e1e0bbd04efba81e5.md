[&lt; back](..)

# perftest--without-liburing-ost-4k-2-1

2026-11-05 13:03:18

refs/heads/main

[0f27ce6](https://github.com/rawstor/librawstor/commit/0f27ce6f353c5fdec01dcd9e1e0bbd04efba81e5)

rw = randread, bs = 4k, iodepth = 2, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15226: Thu Nov  5 13:02:53 2026
  read: IOPS=26.2k, BW=102MiB/s (107MB/s)(1023MiB/10001msec)
    slat (nsec): min=442, max=29085, avg=1036.29, stdev=604.76
    clat (usec): min=41, max=550, avg=74.91, stdev=19.54
     lat (usec): min=42, max=552, avg=75.94, stdev=19.57
    clat percentiles (usec):
     |  1.00th=[   51],  5.00th=[   56], 10.00th=[   59], 20.00th=[   62],
     | 30.00th=[   65], 40.00th=[   68], 50.00th=[   71], 60.00th=[   74],
     | 70.00th=[   78], 80.00th=[   84], 90.00th=[   94], 95.00th=[  117],
     | 99.00th=[  153], 99.50th=[  163], 99.90th=[  192], 99.95th=[  206],
     | 99.99th=[  237]
   bw (  KiB/s): min=98976, max=110308, per=100.00%, avg=104853.75, stdev=3606.83, samples=20
   iops        : min=24744, max=27577, avg=26213.35, stdev=901.74, samples=20
  lat (usec)   : 50=0.74%, 100=91.53%, 250=7.73%, 500=0.01%, 750=0.01%
  cpu          : usr=28.85%, sys=27.31%, ctx=149470, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=261965,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2
randwrite: (groupid=1, jobs=1): err= 0: pid=15228: Thu Nov  5 13:02:53 2026
  write: IOPS=3353, BW=13.1MiB/s (13.7MB/s)(131MiB/10001msec); 0 zone resets
    slat (nsec): min=952, max=29334, avg=2663.64, stdev=1614.49
    clat (usec): min=324, max=3987, avg=592.90, stdev=156.42
     lat (usec): min=327, max=3990, avg=595.56, stdev=156.41
    clat percentiles (usec):
     |  1.00th=[  388],  5.00th=[  420], 10.00th=[  441], 20.00th=[  474],
     | 30.00th=[  502], 40.00th=[  529], 50.00th=[  553], 60.00th=[  586],
     | 70.00th=[  619], 80.00th=[  693], 90.00th=[  824], 95.00th=[  906],
     | 99.00th=[ 1057], 99.50th=[ 1123], 99.90th=[ 1303], 99.95th=[ 1532],
     | 99.99th=[ 3589]
   bw (  KiB/s): min=11759, max=14164, per=100.00%, avg=13422.30, stdev=673.89, samples=20
   iops        : min= 2939, max= 3541, avg=3355.40, stdev=168.52, samples=20
  lat (usec)   : 500=30.12%, 750=54.23%, 1000=13.80%
  lat (msec)   : 2=1.83%, 4=0.02%
  cpu          : usr=5.73%, sys=4.87%, ctx=29284, majf=0, minf=36
  IO depths    : 1=0.0%, 2=100.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,33541,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=2

Run status group 0 (all jobs):
   READ: bw=102MiB/s (107MB/s), 102MiB/s-102MiB/s (107MB/s-107MB/s), io=1023MiB (1073MB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=13.1MiB/s (13.7MB/s), 13.1MiB/s-13.1MiB/s (13.7MB/s-13.7MB/s), io=131MiB (137MB), run=10001-10001msec

Disk stats (read/write):
  nvme0n1: ios=2/80234, sectors=16/1752584, merge=0/118985, ticks=1/17260, in_queue=17265, util=36.19%
```
