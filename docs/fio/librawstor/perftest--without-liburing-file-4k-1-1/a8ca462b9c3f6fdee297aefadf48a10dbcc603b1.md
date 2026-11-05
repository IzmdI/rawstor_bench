[&lt; back](..)

# perftest--without-liburing-file-4k-1-1

2026-11-05 21:00:41

refs/heads/main

[a8ca462](https://github.com/rawstor/librawstor/commit/a8ca462b9c3f6fdee297aefadf48a10dbcc603b1)

rw = randread, bs = 4k, iodepth = 1, numjobs = 1

```

randread: (groupid=0, jobs=1): err= 0: pid=15448: Thu Nov  5 20:59:49 2026
  read: IOPS=268k, BW=1045MiB/s (1096MB/s)(10.2GiB/10001msec)
    slat (nsec): min=551, max=47249, avg=720.63, stdev=393.19
    clat (nsec): min=1984, max=92894, avg=2772.29, stdev=823.67
     lat (nsec): min=2625, max=93986, avg=3492.92, stdev=938.49
    clat percentiles (nsec):
     |  1.00th=[ 2224],  5.00th=[ 2320], 10.00th=[ 2384], 20.00th=[ 2512],
     | 30.00th=[ 2672], 40.00th=[ 2704], 50.00th=[ 2768], 60.00th=[ 2800],
     | 70.00th=[ 2832], 80.00th=[ 2896], 90.00th=[ 2960], 95.00th=[ 3056],
     | 99.00th=[ 3792], 99.50th=[ 4832], 99.90th=[15040], 99.95th=[21376],
     | 99.99th=[25984]
   bw (  MiB/s): min= 1022, max= 1063, per=100.00%, avg=1045.91, stdev=13.74, samples=20
   iops        : min=261688, max=272324, avg=267752.65, stdev=3516.07, samples=20
  lat (usec)   : 2=0.01%, 4=99.10%, 10=0.61%, 20=0.23%, 50=0.06%
  lat (usec)   : 100=0.01%
  cpu          : usr=58.57%, sys=41.41%, ctx=71, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=2676089,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1
randwrite: (groupid=1, jobs=1): err= 0: pid=15450: Thu Nov  5 20:59:49 2026
  write: IOPS=2827, BW=11.0MiB/s (11.6MB/s)(110MiB/10001msec); 0 zone resets
    slat (nsec): min=2144, max=36178, avg=3558.77, stdev=1441.15
    clat (usec): min=221, max=14177, avg=348.62, stdev=197.18
     lat (usec): min=225, max=14183, avg=352.18, stdev=197.22
    clat percentiles (usec):
     |  1.00th=[  239],  5.00th=[  253], 10.00th=[  265], 20.00th=[  285],
     | 30.00th=[  302], 40.00th=[  314], 50.00th=[  326], 60.00th=[  338],
     | 70.00th=[  355], 80.00th=[  379], 90.00th=[  420], 95.00th=[  469],
     | 99.00th=[  701], 99.50th=[ 1074], 99.90th=[ 3064], 99.95th=[ 3720],
     | 99.99th=[ 6128]
   bw (  KiB/s): min=10360, max=12120, per=100.00%, avg=11315.90, stdev=414.63, samples=20
   iops        : min= 2590, max= 3030, avg=2828.85, stdev=103.62, samples=20
  lat (usec)   : 250=4.20%, 500=92.05%, 750=2.91%, 1000=0.30%
  lat (msec)   : 2=0.20%, 4=0.29%, 10=0.04%, 20=0.01%
  cpu          : usr=3.61%, sys=10.65%, ctx=56847, majf=0, minf=36
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,28279,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=1045MiB/s (1096MB/s), 1045MiB/s-1045MiB/s (1096MB/s-1096MB/s), io=10.2GiB (11.0GB), run=10001-10001msec

Run status group 1 (all jobs):
  WRITE: bw=11.0MiB/s (11.6MB/s), 11.0MiB/s-11.0MiB/s (11.6MB/s-11.6MB/s), io=110MiB (116MB), run=10001-10001msec

Disk stats (read/write):
  sda: ios=5/71810, sectors=40/2070624, merge=0/109038, ticks=11/11228, in_queue=11239, util=37.51%
```
